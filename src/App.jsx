import { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, ArrowLeft, Clock, Check, Sparkles, 
  MessageSquare, Briefcase, Award, TrendingUp, RefreshCw, Download, 
  HelpCircle, CheckCircle2, Circle, ChevronRight, Send, AlertCircle,
  FileText, Layers, ExternalLink, Trash2, ClipboardCheck, FileDown,
  GraduationCap, Code, Shield, Cloud, Smartphone, Palette, User, Camera,
  Compass, CheckSquare, FolderGit2, X, Upload, Globe
} from 'lucide-react';
import './index.css';
import { exportRoadmapAsPDF, exportRoadmapAsWord } from './utils/exportDocuments';
import { getCareerRoadmap, LEARNER_LOCATIONS, filterCoursesByLocation, getCoursesForLocation } from './data/careerDatabase';
import { ensureLiveCourseLinks } from './data/courseLinks';
import { puter } from '@heyputer/puter.js';

if (typeof window !== 'undefined' && !window.puter) {
  window.puter = puter;
}

// --- PUTER.JS AI ENGINE ---
function extractPuterText(response) {
  const content = response?.message?.content || response?.text || response?.content || response;
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map(part => typeof part === 'string' ? part : part?.text || '')
      .join('')
      .trim();
  }
  return '';
}

const ROADMAP_STAGES = ['Beginner', 'Intermediate', 'Advanced', 'Job Ready'];

function normalizeStageName(stage) {
  const value = String(stage || '').toLowerCase();
  if (value.includes('job') || value.includes('ready') || value.includes('portfolio')) return 'Job Ready';
  if (value.includes('advanced') || value.includes('expert')) return 'Advanced';
  if (value.includes('intermediate') || value.includes('applied')) return 'Intermediate';
  return 'Beginner';
}

function formatCourseAccessLabel() {
  return 'Course';
}

function ensureTasksForEveryStage(tasks, fallbackTasks = []) {
  const source = Array.isArray(tasks) ? tasks : [];
  const fallback = Array.isArray(fallbackTasks) ? fallbackTasks : [];
  const normalized = source.map((task, index) => ({
    ...task,
    id: task.id || `roadmap-task-${index + 1}`,
    stage: normalizeStageName(task.stage || task.level || task.difficulty)
  }));

  ROADMAP_STAGES.forEach(stage => {
    if (!normalized.some(task => task.stage === stage)) {
      fallback
        .filter(task => normalizeStageName(task.stage) === stage)
        .forEach(task => normalized.push({ ...task, id: `${task.id}-fallback`, stage }));

      if (!normalized.some(task => task.stage === stage)) {
        normalized.push({
          id: `roadmap-${stage.toLowerCase().replace(/\s+/g, '-')}-readiness`,
          title: `${stage} practical readiness deliverable`,
          description: `Complete a portfolio-ready ${stage.toLowerCase()} deliverable that demonstrates your ${stage.toLowerCase()} capability.`,
          difficulty: stage,
          requiredSkills: [],
          estimatedTime: stage === 'Job Ready' ? '8 Hours' : '4 Hours',
          prerequisites: stage === 'Beginner' ? 'Basic computer literacy' : `${ROADMAP_STAGES[ROADMAP_STAGES.indexOf(stage) - 1]} skills`,
          expectedOutcome: stage === 'Job Ready' ? 'A public portfolio, resume, and interview-ready case study with proof of your work.' : `A completed ${stage.toLowerCase()} deliverable with clear documentation and evidence.`,
          stage
        });
      }
    }
  });

  return normalized;
}

function withTimeout(promise, timeoutMs = 12000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI request timed out.')), timeoutMs))
  ]);
}

async function callPuterAI(prompt) {
  if (!puter?.ai?.chat) {
    throw new Error("Puter AI client is not available.");
  }

  // Use one current default model so an unavailable live service fails quickly.
  const models = [null];
  let lastError = null;

  for (const model of models) {
    try {
      const options = model ? { model } : undefined;
      const resp = await withTimeout(puter.ai.chat(prompt, options));
      const text = extractPuterText(resp);
      if (text) return text;
    } catch (err) {
      console.warn(`Puter AI model ${model} attempt failed:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Unable to connect to Puter AI services.");
}

// --- TASK EVIDENCE VERIFICATION AI ---
async function verifyTaskSubmissionAI(task, submissionText, formData) {
  const prompt = `
You are an expert technical evaluator and AI code reviewer assessing a user's task completion evidence for their goal of becoming a "${formData.goal}".

Task Details:
- Title: ${task.title}
- Stage: ${task.stage || 'General'}
- Learning Objective & Expected Outcome: ${task.expectedOutcome}
- Required Skills: ${(task.requiredSkills || []).join(', ')}

User Submitted Evidence (Repo link, Code snippet, or Project summary):
"""
${submissionText}
"""

Evaluate if this evidence genuinely demonstrates that the user completed the learning objective of the task.
You MUST return your output strictly as a single valid JSON object, no markdown fences, no extra text:
{
  "status": "verified" | "partial" | "needs_revision",
  "score": 90,
  "feedback": "2-3 sentences evaluating what was done well and any specific gaps.",
  "suggestions": ["Actionable next step 1", "Actionable next step 2"],
  "resumeBullet": "One bullet point the user can put on their resume based on this completed task."
}

`;

  try {
    const rawText = await callPuterAI(prompt);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON content.");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Task verification AI error, using fallback evaluation:", err);
    return {
      status: "needs_revision",
      score: 0,
      feedback: "Your evidence was saved, but the AI verification service is unavailable right now. This task was not marked complete.",
      suggestions: ["Try verification again when the AI service is available.", "Include a working repository, live demo, screenshots, or a detailed project summary."],
      resumeBullet: ""
    };
  }
}

async function verifyCourseProgressAI(course, evidenceText, formData) {
  const prompt = `
You are an honest learning-record reviewer. Check whether the learner's evidence proves they completed this course.

Course: ${course.title}
Platform: ${course.platform || 'Unknown'}
Career goal: ${formData.goal}
Learner evidence (progress report, certificate text, certificate URL, or screenshot description):
"""
${evidenceText}
"""

Accept evidence only when it clearly identifies the course and shows meaningful completion, such as a completion certificate, 100% progress, final assessment, or platform completion record. Do not treat a plan, enrollment, partial progress, or unsupported claim as complete.
Return one valid JSON object only:
{
  "status": "verified" | "incomplete" | "needs_revision",
  "score": 0,
  "feedback": "Short explanation",
  "suggestions": ["Actionable next step"]
}
`;

  try {
    const rawText = await callPuterAI(prompt);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI did not return valid course verification JSON.');
    const result = JSON.parse(jsonMatch[0]);
    if (!['verified', 'incomplete', 'needs_revision'].includes(result.status)) {
      throw new Error('AI returned an invalid course verification status.');
    }
    return result;
  } catch (err) {
    console.error('Course verification AI error:', err);
    return {
      status: 'needs_revision',
      score: 0,
      feedback: 'The evidence was saved, but live AI verification is unavailable. The course was not marked complete.',
      suggestions: ['Try again with the certificate details, course URL, or a progress report showing completion.']
    };
  }
}

// --- DAILY TASK SCAN AI ---
async function scanDailyProgress(dayPlan, userInput, formData) {
  const tasksList = (dayPlan.tasks || []).map((t, i) => `${i}. ${t}`).join('\n');

  const prompt = `
You are an honest but encouraging AI accountability coach helping ${formData.name || 'a learner'} on their path to becoming a "${formData.goal}".

Today is ${dayPlan.day}. Here are today's planned tasks (indexed from 0):
${tasksList}

Here is what the user says they actually did today:
"""
${userInput}
"""

Compare what they actually did against the planned tasks. Determine which planned tasks were genuinely covered (matched) and which were not (missed).

You MUST return your output strictly as a single valid JSON object, no markdown fences, no extra text:
{
  "status": "on_track" | "partial" | "off_track",
  "matchedTaskIndexes": [0],
  "missedTaskIndexes": [1],
  "feedback": "One short paragraph on what went well and what didn't.",
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"],
  "encouragement": "One short motivating line."
}
`;

  try {
    const rawText = await callPuterAI(prompt);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON content.");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Daily scan AI error, using fallback:", err);
    return {
      status: "partial",
      matchedTaskIndexes: [],
      missedTaskIndexes: (dayPlan.tasks || []).map((_, i) => i),
      feedback: "We couldn't reach the AI scanner right now. Your notes were saved.",
      suggestions: ["Try scanning again in a moment.", "Manually check off completed tasks."],
      encouragement: "Every logged day counts — keep going!"
    };
  }
}

// --- COURSE RECOMMENDATION AI ---
async function fetchCourseRecommendationsAI(formData, roadmapData) {
  const skillNames = (roadmapData?.skills || []).map(s => s.name).join(', ');
  const location = formData.nationality || 'Global (Online)';

  const prompt = `
You are a career learning advisor. Recommend real, currently available courses that help someone become a "${formData.goal}".
Their current level is "${formData.level}", location is "${location}", and key skills to build are: ${skillNames || formData.goal}.

Only recommend courses available for learners in "${location}" (global online options plus location-relevant providers such as NPTEL for India, SkillsFuture for Singapore, FutureLearn for UK, etc.).
Return 8 courses total with a balanced mix of course types and learning formats.
Each course MUST include "availableLocations" as an array that includes "${location}" and/or "Global (Online)".

CRITICAL URL RULES:
- "url" MUST be a specific course/certificate/path page (deep link), NEVER a platform homepage like https://www.coursera.org or https://www.udemy.com
- Prefer well-known live pages such as Coursera professional-certificates/specializations, freeCodeCamp learn paths, TryHackMe paths, Microsoft Learn learning paths, AWS Skill Builder, NPTEL course pages
- If unsure of the exact slug, use a platform SEARCH URL that includes the course title and "${formData.goal}" (and "${location}" when not Global), e.g. https://www.coursera.org/search?query=...

You MUST return your output strictly as a single valid JSON object, no markdown fences, no extra text:
{
  "courses": [
    { "title": "Course Name", "platform": "Platform Name", "level": "Beginner", "url": "https://...", "availableLocations": ["${location}", "Global (Online)"] },
    { "title": "Course Name", "platform": "Platform Name", "level": "Intermediate", "url": "https://...", "availableLocations": ["Global (Online)"] }
  ]
}
`;

  try {
    const rawText = await callPuterAI(prompt);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON content.");
    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed.courses)) throw new Error("Malformed course data.");
    const filtered = filterCoursesByLocation(parsed.courses, location);
    const withLiveLinks = ensureLiveCourseLinks(filtered, formData.goal, location);
    if (withLiveLinks.length) return withLiveLinks;
    return getCoursesForLocation(roadmapData?.courses || [], formData.goal, location);
  } catch (err) {
    console.error("Course recommendation AI error, using fallback database courses:", err);
    return getCoursesForLocation(roadmapData?.courses || [], formData.goal, location);
  }
}

// --- SYNTHESIZE AI ROADMAP WITH CURATED FALLBACK INTEGRATION ---
async function synthesizeRoadmapAI(formData) {
  let hoursPerWeek = 0;
  let scheduleString = "";
  Object.keys(formData.schedule).forEach(day => {
    const data = formData.schedule[day];
    const hrs = parseInt(data.hours || 0);
    hoursPerWeek += hrs;
    scheduleString += `- ${day}: ${hrs} hours in the ${data.time}\n`;
  });

  // Fetch baseline curated career roadmap from local knowledge base (location filters courses)
  const baseCareerData = getCareerRoadmap(formData.goal, formData.level, formData.timeline, formData.nationality);

  const prompt = `
You are an expert career strategist and AI mentor. Create a comprehensive, realistic, step-by-step career roadmap for a user based on these details:
User Name: ${formData.name}
Current Age: ${formData.age}
Location/Nationality: ${formData.nationality}
Current Skill Level: ${formData.level}
Target Career Goal: ${formData.goal}
Target Timeline: ${formData.timeline}
Preferred Learning Style: ${formData.learningStyle}
Weekly Availability (${hoursPerWeek} hours/week total):
${scheduleString}

CRITICAL RULES:
1. Every stage (Beginner -> Intermediate -> Advanced -> Job Ready) MUST be strictly non-repeating and escalating in difficulty.
2. Higher stages MUST explicitly reference and build upon skills mastered in previous stages (e.g. "Building on Python mastered in Stage 1, construct predictive ML models...").
3. Do NOT use generic boilerplate phrasing ("Master baseline tools and principles"). Make every task, topic, and course specific to "${formData.goal}".
4. Courses MUST be available for the learner's location "${formData.nationality}". Prefer global online courses plus providers relevant to that location. Each course must include "availableLocations".
5. Every course "url" MUST be a specific live course/certificate/path page OR a platform search URL for that exact course title — NEVER a bare homepage (coursera.org, udemy.com, edx.org roots).

You MUST return your output strictly as a single valid JSON object without markdown fences, code blocks, or extra text.

Required JSON Structure:
{
  "totalHoursRequired": 1200,
  "estimatedSalary": "$85,000 - $135,000 / year",
  "marketOutlook": "High Growth (+22% demand in 5 years)",
  "careerOverview": {
    "name": "${baseCareerData.careerOverview.name}",
    "desc": "Short 2-sentence description of the career role.",
    "whatProfessionalDoes": "Clear explanation of professional responsibilities.",
    "whereUsed": "Industries and companies where this career is used.",
    "expectedLevels": {
      "beginner": "$55,000 - $75,000 / year",
      "intermediate": "$85,000 - $115,000 / year",
      "advanced": "$125,000 - $175,000+ / year"
    }
  },
  "requiredSkills": {
    "beginner": ["Skill 1", "Skill 2"],
    "intermediate": ["Skill 3", "Skill 4"],
    "advanced": ["Skill 5", "Skill 6"],
    "softSkills": ["Soft Skill 1", "Soft Skill 2"]
  },
  "courses": [
    {
      "title": "Course Name",
      "whyRequired": "Why required for this career",
      "difficulty": "Beginner | Intermediate | Advanced",
      "prerequisites": "Prerequisite knowledge needed from earlier stage",
      "learnOutcome": "What the user will learn",
      "relatedSkills": ["Skill A", "Skill B"],
      "url": "https://...",
      "availableLocations": ["${formData.nationality}", "Global (Online)"]
    }
  ],
  "technologies": ["Tech 1", "Tech 2", "Tool 3"],
  "skills": [
    { "name": "Core Technical Skill 1", "level": 85 },
    { "name": "Technical Skill 2", "level": 75 },
    { "name": "Essential Tool 3", "level": 70 },
    { "name": "Soft Skill / Communication", "level": 90 }
  ],
  "macro": [
    {
      "id": "phase1",
      "age": "${formData.age}",
      "timeframe": "Stage 1: Beginner",
      "title": "Beginner: Core Fundamentals",
      "desc": "Master baseline tools and principles.",
      "objectives": ["Understand core concepts", "Setup environment"],
      "projects": ["Beginner Prototype Project"],
      "resources": ["Official Documentation"]
    },
    {
      "id": "phase2",
      "age": "${parseInt(formData.age) || 21}",
      "timeframe": "Stage 2: Intermediate",
      "title": "Intermediate: Applied Skills & Frameworks",
      "desc": "Deep dive into real-world applications building on Stage 1.",
      "objectives": ["Build real applications", "Master frameworks"],
      "projects": ["Intermediate Portfolio Project"],
      "resources": ["Advanced Guides"]
    },
    {
      "id": "phase3",
      "age": "${(parseInt(formData.age) || 21) + 1}",
      "timeframe": "Stage 3: Advanced",
      "title": "Advanced: System Architecture & Optimization",
      "desc": "Focus on high performance, security, and enterprise scale.",
      "objectives": ["Advanced system design", "Testing & security"],
      "projects": ["Advanced Capstone Project"],
      "resources": ["Interview Handbooks"]
    },
    {
      "id": "phase4",
      "age": "${(parseInt(formData.age) || 21) + 1}",
      "timeframe": "Stage 4: Job Ready",
      "title": "Job Ready: Portfolio & Real-World Experience",
      "desc": "Prepare resume, internships, mock interviews, and job placement.",
      "objectives": ["Resume optimization", "Real-world experience"],
      "projects": ["Portfolio-level Showcase"],
      "resources": ["Networking Groups"]
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Career-Specific Task Title",
      "description": "Task description explaining hands-on exercise.",
      "difficulty": "Beginner",
      "requiredSkills": ["Skill 1", "Skill 2"],
      "estimatedTime": "3 Hours",
      "prerequisites": "Prerequisites for task",
      "expectedOutcome": "Concrete expected deliverable outcome.",
      "stage": "Beginner"
    }
  ],
  "projects": [
    {
      "level": "Beginner | Intermediate | Advanced | Portfolio-level",
      "title": "Project Title",
      "description": "Description of project",
      "technologies": ["Tech 1", "Tech 2"],
      "keyFeatures": ["Feature 1", "Feature 2"]
    }
  ],
  "realWorldExperience": [
    {
      "title": "Experience Title",
      "type": "Internship | Open Source | Freelance Micro-Gig | Hackathon | Volunteer Work",
      "stage": "Intermediate | Advanced | Job Ready",
      "description": "Description of real-world project or internship task matched to ${formData.nationality}.",
      "resumeOutcome": "What to put on resume after completing this item.",
      "platforms": ["Platform 1", "Platform 2"],
      "verificationTip": "How to verify (URL / certificate / commit link)"
    }
  ],
  "recommendations": {
    "certifications": ["Cert 1", "Cert 2"],
    "portfolioIdeas": ["Idea 1", "Idea 2"],
    "githubIdeas": ["GitHub tip 1", "GitHub tip 2"],
    "interviewPrep": ["Topic 1", "Topic 2"],
    "resumeSkills": ["Skill A", "Skill B"],
    "importantTech": ["Tech A", "Tech B"],
    "nextCareerStep": "Junior Role -> Mid-Level Role -> Senior Role"
  },
  "micro": [
    { "day": "Monday", "active": true, "timePref": "Evening", "hoursAllocated": 2, "tasks": ["Task 1", "Task 2"] },
    { "day": "Tuesday", "active": true, "timePref": "Evening", "hoursAllocated": 2, "tasks": ["Task 3"] },
    { "day": "Wednesday", "active": false, "timePref": "", "hoursAllocated": 0, "tasks": ["Rest & Recovery"] },
    { "day": "Thursday", "active": true, "timePref": "Evening", "hoursAllocated": 2, "tasks": ["Task 4"] },
    { "day": "Friday", "active": true, "timePref": "Evening", "hoursAllocated": 2, "tasks": ["Task 5"] },
    { "day": "Saturday", "active": false, "timePref": "", "hoursAllocated": 0, "tasks": ["Rest / Casual Reading"] },
    { "day": "Sunday", "active": false, "timePref": "", "hoursAllocated": 0, "tasks": ["Weekly Review"] }
  ],
  "aiAdvice": "Actionable strategic advice tailored specifically to becoming a ${formData.goal}."
}
`;

  try {
    const rawText = await callPuterAI(prompt);
    let jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON content.");
    
    const parsed = JSON.parse(jsonMatch[0]);
    parsed.hoursPerWeek = hoursPerWeek;

    // Merge missing fields with local knowledge base to guarantee 100% complete career schema
    if (!parsed.careerOverview) parsed.careerOverview = baseCareerData.careerOverview;
    if (!parsed.requiredSkills) parsed.requiredSkills = baseCareerData.requiredSkills;
    if (!parsed.courses || !parsed.courses.length) {
      parsed.courses = baseCareerData.courses;
    } else {
      parsed.courses = getCoursesForLocation(parsed.courses, formData.goal, formData.nationality);
      if (!parsed.courses.length) parsed.courses = baseCareerData.courses;
    }
    parsed.courses = ensureLiveCourseLinks(parsed.courses, formData.goal, formData.nationality);
    if (!parsed.technologies || !parsed.technologies.length) parsed.technologies = baseCareerData.technologies;
    parsed.tasks = ensureTasksForEveryStage(parsed.tasks, baseCareerData.tasks);
    if (!parsed.projects || !parsed.projects.length) parsed.projects = baseCareerData.projects;
    if (!parsed.realWorldExperience || !parsed.realWorldExperience.length) parsed.realWorldExperience = baseCareerData.realWorldExperience;
    if (!parsed.recommendations) parsed.recommendations = baseCareerData.recommendations;

    return parsed;
  } catch (err) {
    console.error("AI Generation Error, generating career-specific data from knowledge base:", err);
    return generateFallbackData(formData, hoursPerWeek, baseCareerData);
  }
}

function generateFallbackData(formData, hoursPerWeek, baseCareerData) {
  const currentAge = parseInt(formData.age) || 21;
  const careerData = baseCareerData || getCareerRoadmap(formData.goal, formData.level, formData.timeline, formData.nationality);

  const sampleTasks = (careerData.tasks || []).map(t => t.title);
  let taskIdx = 0;

  const microSchedule = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
    const active = !!formData.schedule[day];
    const hoursAllocated = active ? parseInt(formData.schedule[day].hours || 2) : 0;
    const timePref = active ? formData.schedule[day].time : "";
    
    let dayTasks = ["Rest & Recovery"];
    if (active) {
      const t1 = sampleTasks[taskIdx % sampleTasks.length] || `Study ${formData.goal} core concepts`;
      taskIdx++;
      const t2 = sampleTasks[taskIdx % sampleTasks.length] || `Practical ${formData.goal} exercises`;
      taskIdx++;
      dayTasks = [`${t1} (${Math.ceil(hoursAllocated / 2)}h)`, `${t2} (${Math.floor(hoursAllocated / 2)}h)`];
    }

    return {
      day,
      active,
      timePref,
      hoursAllocated,
      tasks: dayTasks
    };
  });

  const macroPhases = (careerData.learningRoadmap || []).map((stg, idx) => ({
    id: `phase${idx + 1}`,
    age: currentAge + Math.floor(idx / 2),
    timeframe: `Stage ${idx + 1}: ${stg.stage}`,
    title: `${stg.stage}: ${careerData.careerOverview.name}`,
    desc: `Focus on ${stg.topics.join(', ')}.`,
    objectives: stg.topics || [],
    projects: stg.projects || [],
    resources: stg.courses || []
  }));

  const skillsList = (careerData.requiredSkills.beginner || []).slice(0, 3)
    .concat(careerData.requiredSkills.intermediate || []).slice(0, 2)
    .map((sName, i) => ({ name: sName, level: 90 - (i * 8) }));

  return {
    totalHoursRequired: 1200,
    hoursPerWeek,
    estimatedSalary: careerData.careerOverview.expectedLevels.intermediate,
    marketOutlook: "Strong Demand (+20% projected growth)",
    careerOverview: careerData.careerOverview,
    requiredSkills: careerData.requiredSkills,
    courses: careerData.courses,
    technologies: careerData.technologies,
    skills: skillsList,
    macro: macroPhases,
    tasks: ensureTasksForEveryStage(careerData.tasks),
    projects: careerData.projects,
    realWorldExperience: careerData.realWorldExperience,
    recommendations: careerData.recommendations,
    micro: microSchedule,
    aiAdvice: `As a ${formData.level} aiming to become a ${formData.goal}, focus on completing practical tasks and building verified portfolio projects. Stick to your ${hoursPerWeek}h weekly schedule!`
  };
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nationality: '',
    level: 'Beginner',
    goal: 'Web Developer',
    timeline: '1 Year',
    learningStyle: 'Hands-on Projects',
    schedule: {}
  });

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  
  // Active Dashboard Tab: 'overview', 'roadmap', 'courses', 'tasks', 'experience', 'projects', 'recommendations', 'micro', 'scan', 'mentor'
  const [activeTab, setActiveTab] = useState('experience');
  
  // Stage Filter for Tasks/Roadmap: 'All', 'Beginner', 'Intermediate', 'Advanced', 'Job Ready'
  const [stageFilter, setStageFilter] = useState('All');

  // Checkbox & Verified Task States saved in localStorage
  const [completedTasks, setCompletedTasks] = useState({});
  const [verifiedSubmissions, setVerifiedSubmissions] = useState({});
  const [completedPhases, setCompletedPhases] = useState({});
  const [phaseCompletionMessage, setPhaseCompletionMessage] = useState(null);
  const [stageAccessMessage, setStageAccessMessage] = useState('');
  const [completedCourses, setCompletedCourses] = useState({});
  const [verifiedCourses, setVerifiedCourses] = useState({});
  const [loggedExperiences, setLoggedExperiences] = useState({});

  // Task Verification Modal State
  const [activeVerifyTask, setActiveVerifyTask] = useState(null);
  const [activeVerificationType, setActiveVerificationType] = useState('task');
  const [submissionInput, setSubmissionInput] = useState('');
  const [isVerifyingTask, setIsVerifyingTask] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  // Chat State for Puter AI Mentor
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [mentorConnection, setMentorConnection] = useState('unknown');
  const chatEndRef = useRef(null);
  const profileInputRef = useRef(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    avatar: '',
    provider: ''
  });

  const ensurePuterConnection = async () => {
    if (!puter?.auth) {
      setMentorConnection('offline');
      return false;
    }

    try {
      if (puter.authToken || puter.auth.isSignedIn()) {
        setMentorConnection('online');
        return true;
      }

      setMentorConnection('connecting');
      await withTimeout(puter.auth.signIn({ attempt_temp_user_creation: true }), 12000);
      setMentorConnection('online');
      return true;
    } catch (err) {
      console.warn('Puter sign-in was not completed:', err);
      setMentorConnection('offline');
      setError('Live AI needs Puter access. Select Connect Live AI and allow the sign-in window, or continue with the offline roadmap coach.');
      return false;
    }
  };

  const handleGoogleProfileLogin = async () => {
    const connected = await ensurePuterConnection();
    if (!connected) return;

    try {
      const user = await puter.auth.getUser();
      setProfileData(prev => ({
        ...prev,
        displayName: user?.username || formData.name || 'Career learner',
        email: user?.email || '',
        avatar: user?.profile?.avatar || prev.avatar,
        provider: 'Google / Puter'
      }));
      setError('');
    } catch {
      setError('Profile connected, but account details could not be loaded yet.');
    }
  };

  const handleLogout = async () => {
    try {
      if (puter?.auth?.signOut && puter.authToken) await puter.auth.signOut();
    } catch (err) {
      console.warn('Puter logout could not be completed:', err);
    } finally {
      setProfileData({ displayName: '', email: '', avatar: '', provider: '' });
      setMentorConnection('unknown');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setProfileData(prev => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  // Daily Task Scan state
  const [dailyLogs, setDailyLogs] = useState([]);
  const [scanDayIdx, setScanDayIdx] = useState(0);
  const [scanInput, setScanInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState('');

  // Course recommendations state
  const [courses, setCourses] = useState(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [courseEvidence, setCourseEvidence] = useState('');
  const [courseVerification, setCourseVerification] = useState(null);
  const [isVerifyingCourse, setIsVerifyingCourse] = useState(false);
  const [courseVerifyError, setCourseVerifyError] = useState('');

  // Preset career options for quick selection
  const careerPresets = [
    { title: 'Web Developer', icon: Code, desc: 'HTML/CSS, JS, React, Node.js, REST APIs' },
    { title: 'Game Developer', icon: Code, desc: 'Game engines, gameplay systems, scripting, optimization' },
    { title: 'Esports Player', icon: TrendingUp, desc: 'Competitive practice, performance analysis, team communication' },
    { title: 'Game Designer', icon: Palette, desc: 'Game mechanics, level design, player experience, prototyping' },
    { title: 'Esports Coach', icon: TrendingUp, desc: 'Team strategy, match review, training plans, performance coaching' },
    { title: 'AI Engineer', icon: Code, desc: 'Machine learning systems, model evaluation, deployment, responsible AI' },
    { title: 'UX Researcher', icon: Compass, desc: 'User interviews, usability studies, synthesis, product insights' },
    { title: '3D Artist', icon: Palette, desc: 'Modeling, texturing, lighting, rendering, portfolio presentation' },
    { title: 'Animator', icon: Palette, desc: 'Motion principles, 2D/3D animation, storyboarding, production' },
    { title: 'Financial Analyst', icon: TrendingUp, desc: 'Financial modeling, forecasting, reporting, business decisions' },
    { title: 'HR Specialist', icon: User, desc: 'Hiring processes, employee support, documentation, people operations' },
    { title: 'Technical Writer', icon: FileText, desc: 'Product documentation, API guides, tutorials, information design' },
    { title: 'Data Scientist', icon: TrendingUp, desc: 'Python, SQL, ML, Pandas, Statistics' },
    { title: 'Cybersecurity Analyst', icon: Shield, desc: 'Networking, Linux, Wireshark, SIEM, Pentesting' },
    { title: 'Cloud Engineer', icon: Cloud, desc: 'Linux, AWS, Terraform, Docker, Kubernetes' },
    { title: 'Mobile App Developer', icon: Smartphone, desc: 'Flutter, Swift, Kotlin, React Native, App Stores' },
    { title: 'UI/UX Designer', icon: Palette, desc: 'Figma, Wireframing, UX Research, Design Systems' },
    { title: 'Software Engineer', icon: Code, desc: 'APIs, testing, architecture, Git, delivery' },
    { title: 'Product Manager', icon: Briefcase, desc: 'Roadmaps, discovery, stakeholders, analytics' },
    { title: 'Data Analyst', icon: TrendingUp, desc: 'SQL, dashboards, reporting, spreadsheets, insights' },
    { title: 'DevOps Engineer', icon: Cloud, desc: 'CI/CD, Docker, Kubernetes, monitoring, automation' },
    { title: 'Business Analyst', icon: Compass, desc: 'Process mapping, requirements, workflows, data' },
    { title: 'Digital Marketer', icon: Award, desc: 'Campaigns, SEO, content, analytics, growth' },
    { title: 'QA Automation Engineer', icon: CheckSquare, desc: 'Testing, automation, bug triage, quality' }
  ];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('career_roadmap_puter_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.roadmapData && parsed.formData) {
          const fallbackRoadmap = getCareerRoadmap(parsed.formData.goal, parsed.formData.level, parsed.formData.timeline);
          const repairedRoadmap = {
            ...parsed.roadmapData,
            tasks: ensureTasksForEveryStage(parsed.roadmapData.tasks, fallbackRoadmap.tasks)
          };
          setRoadmapData(repairedRoadmap);
          setFormData(parsed.formData);
          if (parsed.completedTasks) setCompletedTasks(parsed.completedTasks);
          if (parsed.verifiedSubmissions) setVerifiedSubmissions(parsed.verifiedSubmissions);
          if (parsed.completedPhases) setCompletedPhases(parsed.completedPhases);
          if (parsed.completedCourses) setCompletedCourses(parsed.completedCourses);
          if (parsed.verifiedCourses) setVerifiedCourses(parsed.verifiedCourses);
          if (parsed.loggedExperiences) setLoggedExperiences(parsed.loggedExperiences);
          if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
          if (parsed.courses) setCourses(parsed.courses);
          if (parsed.profileData) setProfileData(parsed.profileData);
          setStep(6); // Jump straight to dashboard
        }
      }
    } catch (e) {
      console.error("Error loading cached roadmap:", e);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (roadmapData) {
      try {
        localStorage.setItem('career_roadmap_puter_data', JSON.stringify({
          roadmapData,
          formData,
          completedTasks,
          verifiedSubmissions,
          completedPhases,
          completedCourses,
          verifiedCourses,
          loggedExperiences,
          dailyLogs,
          courses,
          profileData
        }));
      } catch (e) {
        console.error("Error saving state:", e);
      }
    }
  }, [roadmapData, formData, completedTasks, verifiedSubmissions, completedPhases, completedCourses, verifiedCourses, loggedExperiences, dailyLogs, courses, profileData]);

  // Default Daily Scan day selector to today's weekday
  useEffect(() => {
    if (roadmapData?.micro?.length) {
      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = weekdayNames[new Date().getDay()];
      const idx = roadmapData.micro.findIndex(d => d.day === todayName);
      setScanDayIdx(idx >= 0 ? idx : 0);
    }
  }, [roadmapData]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  const toggleDay = (day) => {
    setFormData(prev => {
      const newSchedule = { ...prev.schedule };
      if (newSchedule[day]) {
        delete newSchedule[day];
      } else {
        newSchedule[day] = { hours: 2, time: 'Evening' };
      }
      return { ...prev, schedule: newSchedule };
    });
  };

  const updateDaySchedule = (day, field, value) => {
    setFormData(prev => {
      const newSchedule = { ...prev.schedule };
      if (newSchedule[day]) {
        newSchedule[day][field] = value;
      }
      return { ...prev, schedule: newSchedule };
    });
  };

  const handleGenerateRoadmapForGoal = async (targetGoal) => {
    setIsProcessing(true);
    setStep(6);
    
    // Completely clear old career completion states
    setCompletedTasks({});
    setVerifiedSubmissions({});
    setCompletedPhases({});
    setCompletedCourses({});
    setLoggedExperiences({});
    setDailyLogs([]);
    setScanResult(null);
    setScanInput('');
    setScanError('');
    setVerificationFeedback(null);
    setSubmissionInput('');
    setVerifyError('');
    setActiveVerifyTask(null);

    const updatedFormData = { ...formData, goal: targetGoal };
    setFormData(updatedFormData);

    try {
      await ensurePuterConnection();
      const generated = await synthesizeRoadmapAI(updatedFormData);
      setRoadmapData(generated);
      setCourses(generated.courses || null);
      
      setChatMessages([
        {
          sender: 'ai',
          text: `Hello ${updatedFormData.name || 'Learner'}! I am Puter AI, your dedicated career mentor for becoming a ${updatedFormData.goal}. I've synthesized a personalized roadmap with evidence-verified tasks and real-world internship entry points. How can I help you get started?`
        }
      ]);
    } catch (err) {
      setError(err.message || 'Error generating roadmap.');
      setStep(5);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    setError('');
    if (step === 1 && !formData.name.trim()) return setError('Please enter your name');
    if (step === 2) {
      const ageNum = parseInt(formData.age);
      if (!formData.age || isNaN(ageNum) || ageNum < 10 || ageNum > 100) return setError('Enter a valid age between 10 and 100');
    }
    if (step === 3 && !formData.nationality.trim()) return setError('Please select your location');
    if (step === 4 && !formData.goal.trim()) return setError('Please type or select your career goal');
    if (step === 5) {
      if (Object.keys(formData.schedule).length === 0) return setError('Please select at least one available day.');
      await handleGenerateRoadmapForGoal(formData.goal);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const isStageUnlocked = (stage) => {
    const stageName = normalizeStageName(stage);
    const stageIndex = ROADMAP_STAGES.indexOf(stageName);
    if (stageIndex <= 0) return true;
    return ROADMAP_STAGES.slice(0, stageIndex).every(previousStage => {
      const previousTasks = (roadmapData?.tasks || []).filter(task => normalizeStageName(task.stage) === previousStage);
      return previousTasks.length > 0 && previousTasks.every(task => verifiedSubmissions[task.id]?.status === 'verified');
    });
  };

  const handleStageSelect = (stage) => {
    if (!isStageUnlocked(stage)) {
      const index = ROADMAP_STAGES.indexOf(normalizeStageName(stage));
      setStageAccessMessage(`Finish and verify every ${ROADMAP_STAGES[index - 1]} task before starting ${stage}.`);
      return;
    }
    setStageAccessMessage('');
    setStageFilter(stage);
    setActiveTab('tasks');
  };

  // Open Task Verification Modal
  const openTaskVerificationModal = (task) => {
    if (!isStageUnlocked(task.stage)) {
      const index = ROADMAP_STAGES.indexOf(normalizeStageName(task.stage));
      setStageAccessMessage(`Finish and verify every ${ROADMAP_STAGES[index - 1]} task before starting ${task.stage}.`);
      return;
    }
    setActiveVerificationType('task');
    setActiveVerifyTask(task);
    setSubmissionInput(verifiedSubmissions[task.id]?.submissionText || '');
    setVerificationFeedback(verifiedSubmissions[task.id] || null);
    setVerifyError('');
  };

  const openExperienceVerificationModal = (experience) => {
    setActiveVerificationType('experience');
    setActiveVerifyTask({
      id: `experience-${experience.title}`,
      title: experience.title,
      stage: experience.stage || 'Job Ready',
      description: experience.description,
      expectedOutcome: experience.resumeOutcome || 'Evidence that this real-world experience was completed.',
      requiredSkills: []
    });
    setSubmissionInput(verifiedSubmissions[`experience-${experience.title}`]?.submissionText || '');
    setVerificationFeedback(verifiedSubmissions[`experience-${experience.title}`] || null);
    setVerifyError('');
  };

  const openScheduleVerificationModal = (task, taskId) => {
    setActiveVerificationType('schedule');
    setActiveVerifyTask({
      id: taskId,
      title: task,
      stage: 'Weekly Schedule',
      description: 'Complete the scheduled learning activity and provide proof of the work completed.',
      expectedOutcome: 'A note, link, screenshot, code sample, or other evidence showing this activity was completed.',
      requiredSkills: []
    });
    setSubmissionInput(verifiedSubmissions[taskId]?.submissionText || '');
    setVerificationFeedback(verifiedSubmissions[taskId] || null);
    setVerifyError('');
  };

  // Submit Task Evidence to Puter AI for Verification
  const handleVerifyTaskSubmission = async () => {
    setVerifyError('');
    if (!submissionInput.trim()) {
      return setVerifyError('Please paste your code snippet, GitHub repository link, or project summary to verify completion.');
    }
    if (!activeVerifyTask) return;

    setIsVerifyingTask(true);
    try {
      const evalResult = await verifyTaskSubmissionAI(activeVerifyTask, submissionInput, formData);
      evalResult.submissionText = submissionInput;
      evalResult.verifiedAt = new Date().toISOString();

      setVerificationFeedback(evalResult);
      setVerifiedSubmissions(prev => ({
        ...prev,
        [activeVerifyTask.id]: evalResult
      }));

      // Only verified evidence should auto-complete the task.
      if (evalResult.status === 'verified') {
        if (activeVerificationType === 'experience') {
          setLoggedExperiences(prev => ({ ...prev, [activeVerifyTask.title]: true }));
        } else {
          setCompletedTasks(prev => ({ ...prev, [activeVerifyTask.id]: true }));
        }
      }
    } catch (err) {
      setVerifyError(err.message || 'Error verifying task submission.');
    } finally {
      setIsVerifyingTask(false);
    }
  };

  const togglePhase = (phase) => {
    if (completedPhases[phase.id]) {
      setCompletedPhases(prev => ({
        ...prev,
        [phase.id]: false
      }));
      setPhaseCompletionMessage(null);
      return;
    }

    const stageName = normalizeStageName(phase.timeframe);
    if (!isStageUnlocked(stageName) && !completedPhases[phase.id]) {
      const index = ROADMAP_STAGES.indexOf(stageName);
      setPhaseCompletionMessage({
        phaseId: phase.id,
        text: `Finish and verify every ${ROADMAP_STAGES[index - 1]} task before starting this stage.`
      });
      return;
    }
    const stageTasks = (roadmapData?.tasks || []).filter(task => (
      normalizeStageName(task.stage) === stageName
    ));
    const unverifiedTasks = stageTasks.filter(task => (
      verifiedSubmissions[task.id]?.status !== 'verified'
    ));

    if (unverifiedTasks.length > 0) {
      setPhaseCompletionMessage({
        phaseId: phase.id,
        text: `Complete and verify ${unverifiedTasks.length} task${unverifiedTasks.length === 1 ? '' : 's'} in ${stageName || 'this stage'} before marking the stage as done.`
      });
      return;
    }

    if (stageTasks.length === 0) {
      setPhaseCompletionMessage({
        phaseId: phase.id,
        text: 'This stage has no tracked tasks yet, so it cannot be marked complete.'
      });
      return;
    }

    setCompletedPhases(prev => ({
      ...prev,
      [phase.id]: true
    }));
    setPhaseCompletionMessage(null);
  };

  const openCourseVerification = (course) => {
    setActiveCourse(course);
    setCourseEvidence(verifiedCourses[course.title]?.evidence || '');
    setCourseVerification(verifiedCourses[course.title] || null);
    setCourseVerifyError('');
  };

  const handleVerifyCourse = async () => {
    if (!courseEvidence.trim()) {
      setCourseVerifyError('Please provide a certificate, progress report, course URL, or screenshot description.');
      return;
    }
    if (!activeCourse) return;

    setCourseVerifyError('');
    setIsVerifyingCourse(true);
    try {
      const result = await verifyCourseProgressAI(activeCourse, courseEvidence, formData);
      const record = { ...result, evidence: courseEvidence, verifiedAt: new Date().toISOString() };
      setCourseVerification(record);
      setVerifiedCourses(prev => ({ ...prev, [activeCourse.title]: record }));
      setCompletedCourses(prev => ({
        ...prev,
        [activeCourse.title]: result.status === 'verified'
      }));
    } catch (err) {
      setCourseVerifyError(err.message || 'Course verification failed.');
    } finally {
      setIsVerifyingCourse(false);
    }
  };

  const buildMentorFallbackResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    const allTasks = roadmapData?.tasks || [];
    const verifiedCount = allTasks.filter(task => verifiedSubmissions[task.id]?.status === 'verified').length;
    const nextTask = allTasks.find(task => verifiedSubmissions[task.id]?.status !== 'verified');
    const currentStage = nextTask?.stage || 'your current stage';

    if (lowerQuestion.includes('start') || lowerQuestion.includes('begin')) {
      return `Here is your best starting point for ${formData.goal}:\n\n1. Study one core skill from the Beginner stage for ${roadmapData?.hoursPerWeek || 10} hours this week.\n2. Complete the first practical task: ${nextTask?.title || `a small ${formData.goal} project`}.\n3. Save proof of the work in a GitHub repository, live demo, design file, report, or clear project summary.\n4. Submit that evidence in Verified Tasks so I can help you improve it.\n\nDo not wait until you feel ready. Build a small version, get feedback, then improve it.`;
    }

    if (lowerQuestion.includes('tool') || lowerQuestion.includes('technology') || lowerQuestion.includes('stack')) {
      const tools = (roadmapData?.technologies || []).slice(0, 8).join(', ');
      return `Prioritize these tools for ${formData.goal}: ${tools || 'the tools listed in your roadmap'}.\n\nLearn them in this order: understand the core concept, follow one short guided example, build a small project without copying, and document what you learned. Avoid trying to learn every tool at once.`;
    }

    if (lowerQuestion.includes('resume') || lowerQuestion.includes('cv') || lowerQuestion.includes('job')) {
      return `For your ${formData.goal} resume, focus on evidence instead of a long skills list:\n\n1. Feature your strongest verified project near the top.\n2. Describe the problem, what you built, the tools used, and the measurable result.\n3. Link a working demo, repository, case study, or portfolio page.\n4. Keep the resume focused on the job description and remove unrelated beginner exercises.\n\nYou currently have ${verifiedCount} of ${allTasks.length || 0} roadmap tasks verified.`;
    }

    if (lowerQuestion.includes('project') || lowerQuestion.includes('portfolio')) {
      const projects = (roadmapData?.projects || []).slice(0, 3).map(project => project.title).join('; ');
      return `Build projects that prove job-ready ability, not just tutorial completion. Good options from your roadmap are: ${projects || `a practical ${formData.goal} project`}.\n\nFor each project, include a clear README, screenshots or demo, setup instructions, decisions you made, and one improvement you would make next.`;
    }

    return `I can help you make steady progress toward ${formData.goal}. Your next priority is the ${currentStage} task: ${nextTask?.title || 'choose one unfinished practical task'}.\n\nYour roadmap currently has ${verifiedCount} of ${allTasks.length || 0} tasks verified. Work on one small deliverable, record evidence, and submit it for verification. If you tell me what you have already built, I can suggest the next concrete improvement.`;
  };

  // AI Chat Assistant
  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim() || isChatTyping) return;

    const newMessages = [...chatMessages, { sender: 'user', text: textToSend }];
    setChatMessages(newMessages);
    if (!customPrompt) setChatInput('');
    setIsChatTyping(true);

    const systemPrompt = `
You are Puter AI, an empathetic and highly knowledgeable career mentor helping ${formData.name} achieve their goal of becoming a "${formData.goal}".
User Profile: Age ${formData.age}, Skill Level: ${formData.level}, Weekly Commitment: ${roadmapData?.hoursPerWeek || 10} hours.
Verified roadmap tasks: ${(roadmapData?.tasks || []).filter(task => verifiedSubmissions[task.id]?.status === 'verified').length}/${roadmapData?.tasks?.length || 0}
Next unfinished task: ${(roadmapData?.tasks || []).find(task => verifiedSubmissions[task.id]?.status !== 'verified')?.title || 'None'}
Relevant roadmap technologies: ${(roadmapData?.technologies || []).slice(0, 10).join(', ')}
Keep your answer specific to this roadmap, clear, encouraging, and actionable. Give a short plan with concrete next steps. Do not invent completed work, credentials, salaries, or job guarantees.
`;

    try {
      const isConnected = await ensurePuterConnection();
      if (!isConnected) throw new Error('Live AI connection was not completed.');
      const fullPrompt = `${systemPrompt}\nUser Question: ${textToSend}`;
      const reply = await callPuterAI(fullPrompt);
      setMentorConnection('online');
      setChatMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error("AI Mentor error:", err);
      setMentorConnection('offline');
      setChatMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `${buildMentorFallbackResponse(textToSend)}\n\n(Your roadmap coach answered locally because the live AI service is unavailable.)`
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  // Calculate Overall Verified Progress
  const calculateOverallProgress = () => {
    if (!roadmapData) return 0;
    let totalItems = 0;
    let verifiedCount = 0;

    // Count Verified Tasks
    if (roadmapData.tasks?.length) {
      roadmapData.tasks.forEach(t => {
        totalItems++;
        if (verifiedSubmissions[t.id]?.status === 'verified' || completedTasks[t.id]) verifiedCount++;
      });
    }

    // Count Real-World Logged Experiences
    if (roadmapData.realWorldExperience?.length) {
      roadmapData.realWorldExperience.forEach(exp => {
        totalItems++;
        if (loggedExperiences[exp.title]) verifiedCount++;
      });
    }

    // Count Micro Schedule Tasks
    if (roadmapData.micro?.length) {
      roadmapData.micro.forEach((d, dIdx) => {
        if (d.active) {
          d.tasks.forEach((_, tIdx) => {
            totalItems++;
            if (completedTasks[`${dIdx}-${tIdx}`]) verifiedCount++;
          });
        }
      });
    }

    return totalItems > 0 ? Math.round((verifiedCount / totalItems) * 100) : 0;
  };

  const deleteAccount = async () => {
    if (confirm("Delete your local account and all saved roadmap progress, evidence, courses, achievements, and profile data? This cannot be undone.")) {
      localStorage.removeItem('career_roadmap_puter_data');
      try {
        if (puter?.auth?.signOut && puter.authToken) await puter.auth.signOut();
      } catch (err) {
        console.warn('Puter logout during account deletion could not be completed:', err);
      }
      setRoadmapData(null);
      setCompletedTasks({});
      setVerifiedSubmissions({});
      setCompletedPhases({});
      setCompletedCourses({});
      setVerifiedCourses({});
      setActiveCourse(null);
      setCourseEvidence('');
      setCourseVerification(null);
      setCourseVerifyError('');
      setLoggedExperiences({});
      setDailyLogs([]);
      setScanResult(null);
      setScanInput('');
      setScanError('');
      setVerificationFeedback(null);
      setSubmissionInput('');
      setVerifyError('');
      setActiveVerifyTask(null);
      setChatMessages([]);
      setChatInput('');
      setIsChatTyping(false);
      setCourses(null);
      setProfileData({ displayName: '', email: '', avatar: '', provider: '' });
      setMentorConnection('unknown');
      setStep(0);
      setFormData({
        name: '', age: '', nationality: '', level: 'Beginner', goal: 'Web Developer', timeline: '1 Year', learningStyle: 'Hands-on Projects', schedule: {}
      });
    }
  };

  const exportRoadmapJSON = () => {
    if (!roadmapData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roadmapData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${formData.goal.replace(/\s+/g, '_')}_Roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPDF = () => {
    if (!roadmapData) return;
    exportRoadmapAsPDF(formData, roadmapData, completedTasks, completedPhases, dailyLogs, courses || roadmapData.courses, verifiedSubmissions);
  };

  const handleExportWord = async () => {
    if (!roadmapData) return;
    await exportRoadmapAsWord(formData, roadmapData, completedTasks, completedPhases, dailyLogs, courses || roadmapData.courses, verifiedSubmissions);
  };

  // --- DAILY TASK SCAN ---
  const runDailyScan = async () => {
    setScanError('');
    if (!scanInput.trim()) return setScanError('Please describe what you actually did today.');
    if (!roadmapData?.micro?.[scanDayIdx]) return;

    const dayPlan = roadmapData.micro[scanDayIdx];
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await scanDailyProgress(dayPlan, scanInput, formData);
      const taskCount = Array.isArray(dayPlan.tasks) ? dayPlan.tasks.length : 0;
      const normalizeIndexes = (indexes) => Array.from(new Set(
        (Array.isArray(indexes) ? indexes : [])
          .filter(idx => Number.isInteger(idx) && idx >= 0 && idx < taskCount)
      ));
      const matchedTaskIndexes = normalizeIndexes(result.matchedTaskIndexes);
      const missedTaskIndexes = normalizeIndexes(result.missedTaskIndexes);
      const normalizedResult = {
        ...result,
        status: ['on_track', 'partial', 'off_track'].includes(result.status) ? result.status : 'partial',
        matchedTaskIndexes,
        missedTaskIndexes
      };
      setScanResult(normalizedResult);

      setDailyLogs(prev => [
        {
          date: new Date().toISOString(),
          day: dayPlan.day,
          userInput: scanInput,
          status: normalizedResult.status,
          matchedTasks: matchedTaskIndexes,
          missedTasks: missedTaskIndexes,
          suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
          feedback: result.feedback || '',
          note: result.encouragement || ''
        },
        ...prev
      ]);

      setScanInput('');
    } catch (err) {
      setScanError(err.message || 'Something went wrong scanning your progress.');
    } finally {
      setIsScanning(false);
    }
  };

  // --- COURSE RECOMMENDATIONS ---
  const loadCourseRecommendations = async () => {
    if (!roadmapData) return;
    setIsLoadingCourses(true);
    try {
      const result = await fetchCourseRecommendationsAI(formData, roadmapData);
      setCourses(result);
    } catch (err) {
      console.error('Course fetch failed:', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Check if Job Ready Stage 4 condition met (requires at least 1 verified/logged experience)
  const isJobReadyEligible = Object.values(loggedExperiences).some(v => v === true);

  // --- RENDER STEPS ---
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="fade-enter" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="badge-puter">
                <Sparkles size={14} /> Evidence-Verified Career Roadmap
              </span>
            </div>
            <h1>
              Build Your Career with <span className="gradient-text">Verified Proof</span>
            </h1>
            <p style={{ maxWidth: '540px', margin: '0 auto 2rem auto' }}>
              Generate escalating non-repeating learning stages, evidence-based task verification, and real-world internship entry points tailored to your role.
            </p>
            <div className="form-actions form-actions--center">
              <button className="btn-primary" onClick={() => setStep(1)}>
                Build Your Roadmap <ArrowRight size={18} />
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="fade-enter">
            <span className="badge-puter" style={{ marginBottom: '1rem' }}>Step 1 of 5</span>
            <h2>What should we call you?</h2>
            <p>Your name allows Puter AI to customize your career roadmap & mentorship plan.</p>
            <div className="input-group">
              <label className="input-label">Full Name or Preferred Name</label>
              <input 
                type="text" 
                className="text-input" 
                placeholder="e.g. Alex Rivera" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                autoFocus 
                onKeyDown={e => e.key === 'Enter' && handleNext()} 
              />
              {error && <div className="error-msg"><AlertCircle size={14} /> {error}</div>}
            </div>
            <button className="btn-primary" onClick={handleNext}>
              Continue <ArrowRight size={18} />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="fade-enter">
            <span className="badge-puter" style={{ marginBottom: '1rem' }}>Step 2 of 5</span>
            <h2>Background & Experience Level</h2>
            <p>Tell us a bit about your current age and experience level.</p>

            <div className="input-group">
              <label className="input-label">Current Age</label>
              <input 
                type="number" 
                className="text-input" 
                placeholder="e.g. 21" 
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })} 
                autoFocus 
                onKeyDown={e => e.key === 'Enter' && handleNext()} 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Current Skill Level in Target Area</label>
              <div className="choice-grid choice-grid--three">
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    className={`btn-secondary ${formData.level === lvl ? 'active' : ''}`}
                    style={{
                      borderColor: formData.level === lvl ? 'var(--accent-primary)' : 'var(--glass-border)',
                      background: formData.level === lvl ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.2)'
                    }}
                    onClick={() => setFormData({ ...formData, level: lvl })}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}><AlertCircle size={14} /> {error}</div>}
            
            <div className="form-actions">
              <button className="btn-secondary" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleNext}>Continue <ArrowRight size={18} /></button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="fade-enter">
            <span className="badge-puter" style={{ marginBottom: '1rem' }}>Step 3 of 5</span>
            <h2>Location & Learning Preference</h2>
            <p>Select your location so we can show courses available there (global online + local options).</p>

            <div className="input-group">
              <label className="input-label">Location <span style={{ color: 'var(--accent-secondary)' }}>*</span></label>
              <select
                className="text-input"
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                autoFocus
              >
                <option value="">Select your location</option>
                {LEARNER_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
                {formData.nationality && !LEARNER_LOCATIONS.includes(formData.nationality) && (
                  <option value={formData.nationality}>{formData.nationality}</option>
                )}
              </select>
              {formData.nationality && (
                <p style={{ margin: '0.55rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Courses shown later will only include ones available for <strong style={{ color: 'var(--text-primary)' }}>{formData.nationality}</strong>.
                </p>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Preferred Learning Style</label>
              <select 
                className="text-input"
                value={formData.learningStyle}
                onChange={e => setFormData({ ...formData, learningStyle: e.target.value })}
              >
                <option value="Hands-on Projects">Hands-on Projects & Building</option>
                <option value="Video Courses & Tutorials">Structured Video Courses</option>
                <option value="Books & Documentation">Reading Books & Official Docs</option>
                <option value="Mentorship & Code Reviews">Mentorship & Peer Review</option>
              </select>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}><AlertCircle size={14} /> {error}</div>}

            <div className="form-actions">
              <button className="btn-secondary" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleNext}>Continue <ArrowRight size={18} /></button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="fade-enter">
            <span className="badge-puter" style={{ marginBottom: '1rem' }}>Step 4 of 5</span>
            <h2>Select or Enter Your Career Path</h2>
            <p>Pick a popular career path or type any custom role.</p>

            <div className="career-preset-grid">
              {careerPresets.map(cp => {
                const IconComp = cp.icon;
                const isSelected = formData.goal.toLowerCase().trim() === cp.title.toLowerCase().trim();
                return (
                  <div
                    key={cp.title}
                    className="glass-card"
                    style={{
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--glass-border)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(2, 6, 23, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setFormData({ ...formData, goal: cp.title })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                      <IconComp size={18} color={isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                        {cp.title}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{cp.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="input-group">
              <label className="input-label">Target Career / Role</label>
              <input 
                type="text" 
                className="text-input" 
                placeholder="e.g. Web Developer, Data Scientist, Product Manager, Software Engineer, Digital Marketer" 
                value={formData.goal}
                onChange={e => setFormData({ ...formData, goal: e.target.value })} 
                onKeyDown={e => e.key === 'Enter' && handleNext()} 
              />
            </div>

            <div className="input-group">
              <label className="input-label">Target Completion Timeline</label>
              <div className="choice-grid choice-grid--four">
                {['6 Months', '1 Year', '2 Years', '3+ Years'].map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`btn-secondary ${formData.timeline === t ? 'active' : ''}`}
                    style={{
                      padding: '0.65rem',
                      fontSize: '0.85rem',
                      borderColor: formData.timeline === t ? 'var(--accent-primary)' : 'var(--glass-border)',
                      background: formData.timeline === t ? 'rgba(99, 102, 241, 0.15)' : 'rgba(0,0,0,0.2)'
                    }}
                    onClick={() => setFormData({ ...formData, timeline: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}><AlertCircle size={14} /> {error}</div>}

            <div className="form-actions">
              <button className="btn-secondary" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleNext}>Continue <ArrowRight size={18} /></button>
            </div>
          </div>
        );

      case 5:
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return (
          <div className="fade-enter">
            <span className="badge-puter" style={{ marginBottom: '1rem' }}>Final Step</span>
            <h2>Weekly Learning Availability</h2>
            <p>Select the days you can dedicate to studying and specify your free hours.</p>

            <div className="availability-list">
              {days.map(day => {
                const isSelected = !!formData.schedule[day];
                return (
                  <div 
                    key={day} 
                    className="glass-card availability-card"
                    style={{
                      background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(2, 6, 23, 0.3)',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--glass-border)'
                    }}
                  >
                    <div className="availability-card__header" onClick={() => toggleDay(day)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: 22, height: 22, borderRadius: 6, 
                          border: '2px solid var(--text-muted)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isSelected ? 'var(--accent-primary)' : 'transparent',
                          borderColor: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'
                        }}>
                          {isSelected && <Check size={14} color="white" />}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{day}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                        {isSelected ? `${formData.schedule[day].hours} hrs (${formData.schedule[day].time})` : 'Unavailable'}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="fade-enter schedule-fields">
                        <div style={{ flex: 1 }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>Hours</label>
                          <input 
                            type="number" 
                            min="1" 
                            max="12" 
                            className="text-input" 
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                            value={formData.schedule[day].hours} 
                            onChange={(e) => updateDaySchedule(day, 'hours', e.target.value)} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="input-label" style={{ fontSize: '0.75rem' }}>Preferred Time</label>
                          <select 
                            className="text-input" 
                            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
                            value={formData.schedule[day].time}
                            onChange={(e) => updateDaySchedule(day, 'time', e.target.value)}
                          >
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Evening">Evening</option>
                            <option value="Late Night">Late Night</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}><AlertCircle size={14} /> {error}</div>}

            <div className="form-actions">
              <button className="btn-secondary" onClick={handleBack}><ArrowLeft size={18} /> Back</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleNext}>
                <Sparkles size={18} /> Generate Career Roadmap
              </button>
            </div>
          </div>
        );

      case 6:
        if (isProcessing) {
          return (
            <div className="fade-enter" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div className="animate-spin" style={{ 
                width: '54px', height: '54px', 
                border: '3px solid rgba(255,255,255,0.1)', 
                borderTopColor: 'var(--accent-primary)', 
                borderRadius: '50%', 
                margin: '0 auto 1.5rem auto' 
              }} />
              <h2 className="gradient-text">Synthesizing Verified Career Roadmap...</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Building escalating learning stages, real-world internship entry points, and verification rules for <strong>{formData.goal}</strong>...
              </p>
            </div>
          );
        }

        const overallProgress = calculateOverallProgress();
        const overview = roadmapData.careerOverview || {};
        const reqSkills = roadmapData.requiredSkills || {};
        const recs = roadmapData.recommendations || {};
        const verifiedTaskCount = (roadmapData.tasks || []).filter(task => verifiedSubmissions[task.id]?.status === 'verified').length;
        const verifiedCourseCount = Object.values(verifiedCourses).filter(course => course.status === 'verified').length;
        const verifiedExperienceCount = Object.values(loggedExperiences).filter(Boolean).length;
        const achievedCount = verifiedTaskCount + verifiedCourseCount + verifiedExperienceCount;
        const nextStudyTask = (roadmapData.tasks || []).find(task => verifiedSubmissions[task.id]?.status !== 'verified');
        const studyStage = nextStudyTask?.stage || 'Job Ready';

        return (
          <div className="fade-enter dashboard" style={{ width: '100%' }}>
            {/* HEADER DASHBOARD BAR */}
            <div className="dashboard-header" style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '1rem'
            }}>
              <div>
                <div className="dashboard-header__meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge-puter"><Sparkles size={12} /> Dynamic Career Roadmap</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {formData.nationality || 'Global'}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                  {formData.name}'s Portfolio Roadmap: <span className="gradient-text">{formData.goal}</span>
                </h2>
              </div>

              {/* QUICK CAREER SWITCHER DROPDOWN */}
              <div className="dashboard-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  className="text-input"
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                  value={formData.goal}
                  onChange={(e) => handleGenerateRoadmapForGoal(e.target.value)}
                >
                  {careerPresets.map(cp => (
                    <option key={cp.title} value={cp.title}>Switch: {cp.title}</option>
                  ))}
                </select>

                <button className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }} onClick={handleExportPDF} title="Export as PDF">
                  <FileDown size={14} /> PDF
                </button>
                <button className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }} onClick={handleExportWord} title="Export as Word">
                  <FileText size={14} /> Word
                </button>
                <button className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }} onClick={exportRoadmapJSON} title="Export Roadmap JSON">
                  <Download size={14} /> JSON
                </button>
                {profileData.provider && <button className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }} onClick={handleLogout} title="Log out">
                  <User size={14} /> Log out
                </button>}
                <button className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: 'var(--accent-rose)' }} onClick={deleteAccount} title="Delete account">
                  <Trash2 size={14} /> Delete Account
                </button>
              </div>
            </div>

            {/* OVERALL VERIFIED PROGRESS BAR */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Verified Portfolio Completion</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{overallProgress}% Verified</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            <div className="study-focus-card" style={{ marginBottom: '1.25rem' }}>
              <div>
                <span className="study-kicker">TODAY'S STUDY FOCUS</span>
                <h3 style={{ margin: '0.25rem 0 0.35rem' }}>{nextStudyTask ? nextStudyTask.title : 'Review your completed portfolio'}</h3>
                <p style={{ margin: 0 }}>{nextStudyTask ? `${studyStage} stage • ${nextStudyTask.estimatedTime || 'Work at your own pace'} • Submit proof when finished.` : 'You have verified every roadmap task. Keep your portfolio fresh and prepare for interviews.'}</p>
              </div>
              <button className="btn-primary" type="button" onClick={() => setActiveTab(nextStudyTask ? 'tasks' : 'profile')}>
                {nextStudyTask ? 'Open Study Task' : 'View Achievements'} <ArrowRight size={15} />
              </button>
            </div>

            {/* STAGE PROGRESSION TRACKER */}
            <div className="glass-card stage-tracker" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem' }}>
              <div className="stage-tracker__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Escalating Career Stage Progression
                </span>
                <span style={{ fontSize: '0.75rem', color: isJobReadyEligible ? 'var(--accent-emerald)' : '#f59e0b', fontWeight: 600 }}>
                  {isJobReadyEligible ? '✓ Job Ready Prerequisites Met' : '⚠️ Stage 4 Requires 1+ Real-World Experience'}
                </span>
              </div>

              <div className="stage-grid">
                {['Beginner', 'Intermediate', 'Advanced', 'Job Ready'].map((stg, i) => (
                  <div
                    key={stg}
                    onClick={() => handleStageSelect(stg)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: isStageUnlocked(stg) ? 'pointer' : 'not-allowed',
                      opacity: isStageUnlocked(stg) ? 1 : 0.55,
                      background: stageFilter === stg ? 'rgba(99, 102, 241, 0.2)' : 'rgba(2, 6, 23, 0.4)',
                      border: '1px solid',
                      borderColor: stageFilter === stg ? 'var(--accent-primary)' : 'var(--glass-border)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stage {i + 1}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: stageFilter === stg ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {isStageUnlocked(stg) ? stg : `${stg} (Locked)`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NAVIGATION TABS (5 MODULE SYSTEM) */}
            <div className="tab-container" style={{ gap: '0.4rem' }}>
              <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <User size={15} /> Profile
              </button>
              <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <Compass size={15} /> Overview & Skills
              </button>
              <button className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
                <Layers size={15} /> Learning Stages
              </button>
              <button className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
                <GraduationCap size={15} /> Courses
              </button>
              <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
                <CheckSquare size={15} /> Verified Tasks
              </button>
              <button className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>
                <Globe size={15} /> Experience & Internships
              </button>
              <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                <Briefcase size={15} /> Projects
              </button>
              <button className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`} onClick={() => setActiveTab('recommendations')}>
                <Award size={15} /> Recommendations
              </button>
              <button className={`tab-btn ${activeTab === 'micro' ? 'active' : ''}`} onClick={() => setActiveTab('micro')}>
                <Clock size={15} /> Weekly Schedule
              </button>
              <button className={`tab-btn ${activeTab === 'scan' ? 'active' : ''}`} onClick={() => setActiveTab('scan')}>
                <ClipboardCheck size={15} /> Daily Scan
              </button>
              <button className={`tab-btn ${activeTab === 'mentor' ? 'active' : ''}`} onClick={() => setActiveTab('mentor')}>
                <MessageSquare size={15} /> AI Mentor
              </button>
            </div>

            {/* TAB CONTENTS */}

            {/* PROFILE AND ACHIEVEMENTS */}
            {activeTab === 'profile' && (
              <div className="fade-enter">
                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Profile" style={{ width: '76px', height: '76px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                      ) : (
                        <div style={{ width: '76px', height: '76px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(99,102,241,0.2)', border: '2px solid var(--accent-primary)', fontSize: '1.6rem', fontWeight: 800 }}>
                          {(profileData.displayName || formData.name || 'L').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <button type="button" aria-label="Change profile picture" onClick={() => profileInputRef.current?.click()} style={{ position: 'absolute', right: '-0.2rem', bottom: '-0.2rem', borderRadius: '50%', padding: '0.35rem', background: 'var(--accent-primary)', color: 'white', border: '2px solid var(--bg-primary)', cursor: 'pointer' }}>
                        <Camera size={14} />
                      </button>
                      <input ref={profileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h3 style={{ margin: 0 }}>{profileData.displayName || formData.name || 'Your Career Profile'}</h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0' }}>{profileData.email || 'Connect an account to sync your identity'}</p>
                      <span className="badge-puter">{profileData.provider || 'Local profile'}</span>
                    </div>
                    {!profileData.provider && <button className="btn-primary" type="button" onClick={handleGoogleProfileLogin}>Continue with Google</button>}
                  </div>
                </div>

                <div className="grid-3" style={{ marginBottom: '1rem' }}>
                  <div className="glass-card"><strong>{achievedCount}</strong><p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Achievements earned</p></div>
                  <div className="glass-card"><strong>{verifiedTaskCount}/{roadmapData.tasks?.length || 0}</strong><p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Verified tasks</p></div>
                  <div className="glass-card"><strong>{verifiedCourseCount}</strong><p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>Courses verified</p></div>
                </div>

                <div className="glass-card">
                  <h3 style={{ marginTop: 0 }}>Achievement Record</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Only evidence approved by the roadmap scanners appears here.</p>
                  <div style={{ display: 'grid', gap: '0.6rem' }}>
                    {verifiedTaskCount > 0 && <div><CheckCircle2 size={15} color="var(--accent-emerald)" /> {verifiedTaskCount} roadmap task{verifiedTaskCount === 1 ? '' : 's'} verified</div>}
                    {verifiedCourseCount > 0 && <div><GraduationCap size={15} color="var(--accent-cyan)" /> {verifiedCourseCount} course{verifiedCourseCount === 1 ? '' : 's'} verified</div>}
                    {verifiedExperienceCount > 0 && <div><Globe size={15} color="var(--accent-primary)" /> {verifiedExperienceCount} real-world experience{verifiedExperienceCount === 1 ? '' : 's'} verified</div>}
                    {achievedCount === 0 && <p style={{ color: 'var(--text-muted)', margin: 0 }}>Complete a task and submit proof to earn your first achievement.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* 1. CAREER OVERVIEW & SKILLS */}
            {activeTab === 'overview' && (
              <div className="fade-enter">
                <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                    {overview.name || formData.goal}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
                    {overview.desc}
                  </p>

                  <div className="grid-2" style={{ gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        WHAT THE PROFESSIONAL DOES
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0' }}>
                        {overview.whatProfessionalDoes}
                      </p>
                    </div>

                    <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        WHERE IT IS USED
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.4rem 0 0 0' }}>
                        {overview.whereUsed}
                      </p>
                    </div>
                  </div>
                </div>

                {overview.expectedLevels && (
                  <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                      Expected Salary by Experience Level
                    </h4>
                    <div className="grid-3" style={{ gap: '0.75rem' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>BEGINNER</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                          {overview.expectedLevels.beginner}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>INTERMEDIATE</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                          {overview.expectedLevels.intermediate}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>ADVANCED</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                          {overview.expectedLevels.advanced}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {roadmapData.technologies?.length > 0 && (
                  <div className="glass-card" style={{ marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                      Technologies, Languages & Tools
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {roadmapData.technologies.map((tech, tIdx) => (
                        <span key={tIdx} style={{
                          fontSize: '0.8rem',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--accent-cyan)',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '999px',
                          fontWeight: 600,
                          border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-card">
                  <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Categorized Required Skills
                  </h4>

                  <div className="grid-2" style={{ gap: '1rem' }}>
                    {reqSkills.beginner?.length > 0 && (
                      <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>BEGINNER SKILLS</span>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {reqSkills.beginner.map((s, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {reqSkills.intermediate?.length > 0 && (
                      <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>INTERMEDIATE SKILLS</span>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {reqSkills.intermediate.map((s, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {reqSkills.advanced?.length > 0 && (
                      <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>ADVANCED SKILLS</span>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {reqSkills.advanced.map((s, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {reqSkills.softSkills?.length > 0 && (
                      <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>SOFT SKILLS</span>
                        <ul style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {reqSkills.softSkills.map((s, i) => <li key={i} style={{ marginBottom: '0.2rem' }}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. LEARNING ROADMAP STAGES */}
            {activeTab === 'roadmap' && (
              <div className="fade-enter">
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Escalating learning stage progression for <strong>{formData.goal}</strong> ({roadmapData.hoursPerWeek} hrs/week committed).
                </p>

                <div className="timeline">
                  {roadmapData.macro.map((phase) => {
                    const isDone = !!completedPhases[phase.id];
                    return (
                      <div className="timeline-item" key={phase.id}>
                        <div className={`timeline-dot ${isDone ? 'completed' : ''}`}>
                          {isDone ? <Check size={12} color="white" /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                        </div>

                        <div className="glass-card" style={{ borderColor: isDone ? 'var(--accent-emerald)' : 'var(--glass-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                                {phase.timeframe}
                              </span>
                              <h3 style={{ fontSize: '1.15rem', marginTop: '0.2rem', color: 'var(--text-primary)' }}>{phase.title}</h3>
                            </div>

                            <button 
                              className="btn-secondary" 
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.75rem',
                                background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                                color: isDone ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                              }}
                              onClick={() => togglePhase(phase)}
                            >
                              {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />} {isDone ? 'Completed' : 'Mark Stage Done'}
                            </button>
                          </div>

                          {phaseCompletionMessage?.phaseId === phase.id && (
                            <div role="alert" style={{ marginTop: '0.75rem', padding: '0.65rem 0.8rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#fbbf24', fontSize: '0.8rem' }}>
                              {phaseCompletionMessage.text}
                            </div>
                          )}

                          <p style={{ fontSize: '0.9rem', margin: '0.75rem 0', color: 'var(--text-secondary)' }}>{phase.desc}</p>

                          <div className="grid-2" style={{ marginTop: '1rem' }}>
                            {phase.objectives && phase.objectives.length > 0 && (
                              <div style={{ background: 'rgba(2, 6, 23, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>PREREQUISITE TOPICS & OBJECTIVES</span>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.4rem' }}>
                                  {phase.objectives.map((obj, i) => (
                                    <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                      <ChevronRight size={12} color="var(--accent-primary)" /> {obj}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {phase.projects && phase.projects.length > 0 && (
                              <div style={{ background: 'rgba(2, 6, 23, 0.3)', padding: '0.75rem', borderRadius: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>STAGE DELIVERABLES</span>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.4rem' }}>
                                  {phase.projects.map((proj, i) => (
                                    <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                                      <Briefcase size={12} color="var(--accent-secondary)" /> {proj}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. COURSES TO LEARN */}
            {activeTab === 'courses' && (
              <div className="fade-enter">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Courses for <strong>{formData.goal}</strong> available in <strong>{formData.nationality || 'Global (Online)'}</strong> (global online + local).
                  </p>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }} onClick={loadCourseRecommendations} disabled={isLoadingCourses}>
                    {isLoadingCourses
                      ? <><Sparkles size={14} className="animate-spin" /> Refreshing...</>
                      : <><Sparkles size={14} /> Fetch AI Recommendations</>}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(() => {
                    const locationCourses = ensureLiveCourseLinks(
                      filterCoursesByLocation(courses || roadmapData.courses || [], formData.nationality),
                      formData.goal,
                      formData.nationality
                    );
                    if (!locationCourses.length) {
                      return (
                        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                          <Globe size={22} color="var(--accent-cyan)" style={{ marginBottom: '0.5rem' }} />
                          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                            No courses available for <strong>{formData.nationality || 'your location'}</strong> yet. Try Global (Online) or refresh AI recommendations.
                          </p>
                        </div>
                      );
                    }
                    return locationCourses.map((course, idx) => {
                    const courseRecord = verifiedCourses[course.title];
                    const isDone = courseRecord?.status === 'verified';
                    const availabilityLabel = (course.availableLocations || ['Global (Online)']).includes(formData.nationality) && formData.nationality !== 'Global (Online)'
                      ? formData.nationality
                      : 'Global (Online)';
                    return (
                      <div key={idx} className="glass-card" style={{ borderColor: isDone ? 'var(--accent-emerald)' : 'var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px',
                                color: 'var(--accent-primary)',
                                background: 'rgba(99, 102, 241, 0.12)'
                              }}>
                                {formatCourseAccessLabel(course)}
                              </span>
                              <span style={{
                                fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px',
                                color: 'var(--accent-cyan)',
                                background: 'rgba(34, 211, 238, 0.12)'
                              }}>
                                Available: {availabilityLabel}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.difficulty || 'All Levels'} • {course.platform || 'Online'}</span>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>{course.title}</h4>
                          </div>

                          <button 
                            className="btn-secondary" 
                            style={{ 
                              padding: '0.3rem 0.65rem', 
                              fontSize: '0.75rem',
                              background: isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                              color: isDone ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                            }}
                            onClick={() => openCourseVerification(course)}
                          >
                            {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />} {isDone ? 'Verified / Review' : 'Verify Progress'}
                          </button>
                        </div>

                        {course.whyRequired && (
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0.6rem 0 0.4rem 0' }}>
                            <strong>Why Required:</strong> {course.whyRequired}
                          </p>
                        )}

                        {course.learnOutcome && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 0.6rem 0' }}>
                            <strong>What You Will Learn:</strong> {course.learnOutcome}
                          </p>
                        )}

                        {courseRecord?.feedback && (
                          <div style={{ marginTop: '0.5rem', padding: '0.6rem', borderRadius: '8px', background: courseRecord.status === 'verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: courseRecord.status === 'verified' ? 'var(--accent-emerald)' : '#fbbf24', fontSize: '0.8rem' }}>
                            <strong>{courseRecord.status === 'verified' ? 'AI Verified:' : 'AI Review:'}</strong> {courseRecord.feedback}
                        </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Prerequisites: {course.prerequisites || 'None'}
                          </span>
                          {course.url && (
                            <a href={course.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              View Course <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  });
                  })()}
                </div>
              </div>
            )}

            {/* 4. EVIDENCE-BASED VERIFIED TASKS */}
            {activeTab === 'tasks' && (
              <div className="fade-enter">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Tasks require proof of work (repo URL, code snippet, or summary) evaluated by Puter AI.
                    </p>
                    {stageAccessMessage && <div role="alert" className="study-lock-message"><Shield size={14} /> {stageAccessMessage}</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {['All', ...ROADMAP_STAGES].map(stg => (
                      <button
                        key={stg}
                        className="btn-secondary"
                        disabled={stg !== 'All' && !isStageUnlocked(stg)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.75rem',
                          background: stageFilter === stg ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                          color: stageFilter === stg ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                        }}
                        onClick={() => stg === 'All' ? (setStageAccessMessage(''), setStageFilter(stg)) : handleStageSelect(stg)}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {(roadmapData.tasks || [])
                    .filter(t => stageFilter === 'All' || (t.stage || '').toLowerCase() === stageFilter.toLowerCase())
                    .map((task) => {
                      const vData = verifiedSubmissions[task.id];
                      const isVerified = vData && vData.status === 'verified';
                      const isDone = completedTasks[task.id] || isVerified;

                      return (
                        <div 
                          key={task.id} 
                          className="glass-card" 
                          style={{
                            borderColor: isVerified ? 'var(--accent-emerald)' : (isDone ? 'rgba(99, 102, 241, 0.3)' : 'var(--glass-border)'),
                            background: isVerified ? 'rgba(16, 185, 129, 0.05)' : 'rgba(15, 23, 42, 0.6)'
                          }}
                        >
                        <div className="task-card__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div className="task-card__summary" style={{ display: 'flex', gap: '0.75rem' }}>
                              <div style={{ marginTop: '0.1rem' }}>
                                {isVerified ? (
                                  <CheckCircle2 size={20} color="var(--accent-emerald)" />
                                ) : isDone ? (
                                  <CheckCircle2 size={20} color="var(--accent-primary)" />
                                ) : (
                                  <Circle size={20} color="var(--text-muted)" />
                                )}
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(99, 102, 241, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                                    {task.stage || 'Beginner'}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {task.difficulty} • Est. {task.estimatedTime}
                                  </span>
                                  {isVerified && (
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                                      Verified ✅ (Score: {vData.score}%)
                                    </span>
                                  )}
                                </div>
                                <h4 style={{ fontSize: '1rem', margin: 0, color: isDone ? 'var(--text-primary)' : 'var(--text-primary)' }}>
                                  {task.title}
                                </h4>
                              </div>
                            </div>

                            <button 
                              className="btn-primary" 
                              style={{ 
                                padding: '0.35rem 0.75rem', 
                                fontSize: '0.75rem',
                                background: isVerified ? 'rgba(16, 185, 129, 0.2)' : 'var(--accent-primary)'
                              }}
                              onClick={() => openTaskVerificationModal(task)}
                            >
                              <Upload size={13} /> {isVerified ? 'View Evidence / Re-verify' : 'Submit Evidence'}
                            </button>
                          </div>

                          <p className="task-card__description" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.6rem 0 0.5rem 2rem' }}>
                            {task.description}
                          </p>

                          <div className="task-card__details" style={{ marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {task.prerequisites && <div><strong>Prerequisites:</strong> {task.prerequisites}</div>}
                            {task.expectedOutcome && <div><strong>Expected Deliverable:</strong> {task.expectedOutcome}</div>}
                            
                            {vData?.feedback && (
                              <div style={{ marginTop: '0.4rem', padding: '0.6rem', background: 'rgba(2, 6, 23, 0.5)', borderRadius: '8px', borderLeft: '3px solid var(--accent-emerald)' }}>
                                <strong style={{ color: 'var(--accent-emerald)' }}>AI Feedback:</strong> {vData.feedback}
                                {vData.resumeBullet && <div style={{ color: 'var(--accent-cyan)', marginTop: '0.2rem' }}><strong>Resume Point:</strong> "{vData.resumeBullet}"</div>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {!(roadmapData.tasks || []).some(task => stageFilter === 'All' || normalizeStageName(task.stage) === stageFilter) && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                      <CheckSquare size={28} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
                      <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.4rem' }}>No tasks in this stage yet</h3>
                      <p style={{ margin: 0 }}>Regenerate this roadmap to create practical {stageFilter} tasks, or choose another stage.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. REAL-WORLD EXPERIENCE & INTERNSHIPS (MODULE 5) */}
            {activeTab === 'experience' && (
              <div className="fade-enter">
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="badge-puter"><Globe size={14} /> Module 5: Real-World Experience & Internships</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Matched to {formData.goal} & {formData.nationality || 'Global'}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Connect learned skills to real-world opportunities (Internships, Open Source, Freelance Micro-Gigs, and Hackathons). Log at least 1 real-world experience to unlock <strong>Stage 4: Job Ready</strong> status.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(roadmapData.realWorldExperience || []).map((exp, idx) => {
                    const isLogged = !!loggedExperiences[exp.title];
                    return (
                      <div key={idx} className="glass-card" style={{ borderColor: isLogged ? 'var(--accent-emerald)' : 'var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(99, 102, 241, 0.15)', padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                                {exp.type || 'Experience'}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stage: {exp.stage || 'Intermediate'}</span>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>{exp.title}</h4>
                          </div>

                          <button 
                            className="btn-secondary" 
                            style={{ 
                              padding: '0.35rem 0.75rem', 
                              fontSize: '0.75rem',
                              background: isLogged ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                              color: isLogged ? 'var(--accent-emerald)' : 'var(--text-secondary)'
                            }}
                            onClick={() => openExperienceVerificationModal(exp)}
                          >
                            {isLogged ? <CheckCircle2 size={14} /> : <Circle size={14} />} {isLogged ? 'Verified / Review' : 'Submit Proof'}
                          </button>
                        </div>

                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0.6rem 0 0.5rem 0' }}>
                          {exp.description}
                        </p>

                        <div className="grid-2" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                          <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.65rem', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>RESUME HIGHLIGHT</span>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                              "{exp.resumeOutcome}"
                            </p>
                          </div>

                          <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.65rem', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>REAL-WORLD PLATFORMS</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                              {(exp.platforms || []).map((p, pIdx) => (
                                <span key={pIdx} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {exp.verificationTip && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <strong>Verification Method:</strong> {exp.verificationTip}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. CAREER PROJECTS */}
            {activeTab === 'projects' && (
              <div className="fade-enter">
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Career-specific portfolio projects ranging from beginner to production-level.
                </p>

                <div className="grid-2" style={{ gap: '1rem' }}>
                  {(roadmapData.projects || []).map((proj, idx) => (
                    <div key={idx} className="glass-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-secondary)', background: 'rgba(168, 85, 247, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '999px' }}>
                          {proj.level || 'Project'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', margin: '0.2rem 0 0.5rem 0', color: 'var(--text-primary)' }}>{proj.title}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{proj.description}</p>

                      {proj.keyFeatures?.length > 0 && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>KEY FEATURES</span>
                          <ul style={{ paddingLeft: '1.2rem', margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {proj.keyFeatures.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}

                      {proj.technologies?.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {proj.technologies.map((t, i) => (
                            <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CAREER RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <div className="fade-enter">
                <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="glass-card">
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={18} /> Recommended Certifications
                    </h4>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {(recs.certifications || []).map((c, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{c}</li>)}
                    </ul>
                  </div>

                  <div className="glass-card">
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} /> Key Resume Skills
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {(recs.resumeSkills || []).map((s, i) => (
                        <span key={i} style={{ fontSize: '0.78rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-cyan)', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="glass-card">
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HelpCircle size={18} /> Interview Prep Topics
                    </h4>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {(recs.interviewPrep || []).map((topic, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{topic}</li>)}
                    </ul>
                  </div>

                  <div className="glass-card">
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FolderGit2 size={18} /> GitHub & Portfolio Tips
                    </h4>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {(recs.githubIdeas || []).map((tip, i) => <li key={i} style={{ marginBottom: '0.4rem' }}>{tip}</li>)}
                    </ul>
                  </div>
                </div>

                {recs.nextCareerStep && (
                  <div className="glass-card" style={{ background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>RECOMMENDED NEXT CAREER STEP</span>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {recs.nextCareerStep}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 8. MICRO WEEKLY SCHEDULE */}
            {activeTab === 'micro' && (
              <div className="fade-enter">
                <p style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Interactive daily task list tailored specifically to <strong>{formData.goal}</strong>. Submit proof for each completed activity.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {roadmapData.micro.map((dayPlan, dIdx) => (
                    <div 
                      key={dIdx} 
                      className="glass-card"
                      style={{
                        background: dayPlan.active ? 'rgba(15, 23, 42, 0.6)' : 'rgba(2, 6, 23, 0.2)',
                        borderColor: dayPlan.active ? 'rgba(168, 85, 247, 0.3)' : 'var(--glass-border)',
                        opacity: dayPlan.active ? 1 : 0.6
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1rem', color: dayPlan.active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{dayPlan.day}</h4>
                          {dayPlan.active && (
                            <span style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                              {dayPlan.hoursAllocated} hrs • {dayPlan.timePref}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {dayPlan.tasks.map((task, tIdx) => {
                          const taskId = `${dIdx}-${tIdx}`;
                          const isDone = !!completedTasks[taskId];

                          return (
                            <div 
                              key={tIdx} 
                              onClick={() => dayPlan.active && openScheduleVerificationModal(task, taskId)}
                              style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem',
                                padding: '0.6rem 0.85rem',
                                background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(2, 6, 23, 0.4)',
                                borderRadius: '10px',
                                border: '1px solid',
                                borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)',
                                cursor: dayPlan.active ? 'pointer' : 'default',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {dayPlan.active ? (
                                isDone ? <CheckCircle2 size={16} color="var(--accent-emerald)" /> : <Circle size={16} color="var(--text-muted)" />
                              ) : (
                                <Clock size={16} color="var(--text-muted)" />
                              )}
                              <span style={{ 
                                fontSize: '0.88rem', 
                                color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                                textDecoration: isDone ? 'line-through' : 'none'
                              }}>
                                {task}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. DAILY TASK SCAN */}
            {activeTab === 'scan' && (
              <div className="fade-enter">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="badge-puter"><ClipboardCheck size={14} /> Daily Task Scan</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tell the AI what you actually did — it checks it against the plan.</span>
                </div>

                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <label className="input-label">Which day are you scanning?</label>
                  <select
                    className="text-input"
                    value={scanDayIdx}
                    onChange={e => { setScanDayIdx(parseInt(e.target.value)); setScanResult(null); setScanError(''); }}
                  >
                    {roadmapData.micro.map((d, idx) => (
                      <option key={idx} value={idx}>{d.day}{!d.active ? ' (Rest Day)' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="glass-card" style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                    Planned for {roadmapData.micro[scanDayIdx]?.day}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {roadmapData.micro[scanDayIdx]?.tasks.map((task, tIdx) => {
                      const taskId = `${scanDayIdx}-${tIdx}`;
                      const isDone = !!completedTasks[taskId];
                      return (
                        <div key={tIdx} style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.6rem 0.85rem',
                          background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(2, 6, 23, 0.4)',
                          borderRadius: '10px', border: '1px solid',
                          borderColor: isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border)'
                        }}>
                          {isDone ? <CheckCircle2 size={16} color="var(--accent-emerald)" /> : <Circle size={16} color="var(--text-muted)" />}
                          <span style={{ fontSize: '0.88rem', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none' }}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <label className="input-label">What did you actually do today?</label>
                  <textarea
                    className="text-input"
                    style={{ minHeight: '90px', resize: 'vertical', fontFamily: 'inherit' }}
                    placeholder="e.g. Worked 2 hours on task validation script, completed setup, but didn't finish API testing."
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    disabled={isScanning}
                  />
                  {scanError && <div className="error-msg"><AlertCircle size={14} /> {scanError}</div>}
                </div>

                <button className="btn-primary" onClick={runDailyScan} disabled={isScanning}>
                  {isScanning ? <><Sparkles size={16} className="animate-spin" /> Scanning...</> : <><Sparkles size={16} /> Scan My Progress</>}
                </button>

                {scanResult && (
                  <div className="glass-card fade-enter" style={{ marginTop: '1.25rem' }}>
                    {(() => {
                      const statusMap = {
                        on_track: { label: 'On Track', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)' },
                        partial: { label: 'Partial', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
                        off_track: { label: 'Off Track', color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.12)' }
                      };
                      const s = statusMap[scanResult.status] || statusMap.partial;
                      return (
                        <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 700, color: s.color, background: s.bg, padding: '0.25rem 0.75rem', borderRadius: '999px', marginBottom: '0.85rem' }}>
                          {s.label}
                        </span>
                      );
                    })()}

                    {scanResult.feedback && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>{scanResult.feedback}</p>
                    )}

                    {!!(scanResult.matchedTaskIndexes?.length) && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>✅ MATCHED TASKS</span>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.4rem' }}>
                          {scanResult.matchedTaskIndexes.map(i => (
                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                              {roadmapData.micro[scanDayIdx]?.tasks[i]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!(scanResult.missedTaskIndexes?.length) && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>⚠️ MISSED TASKS</span>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.4rem' }}>
                          {scanResult.missedTaskIndexes.map(i => (
                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                              {roadmapData.micro[scanDayIdx]?.tasks[i]}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!(scanResult.suggestions?.length) && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>💡 SUGGESTIONS</span>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.4rem' }}>
                          {scanResult.suggestions.map((sug, i) => (
                            <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {scanResult.encouragement && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontStyle: 'italic', margin: 0 }}>
                        {scanResult.encouragement}
                      </p>
                    )}
                  </div>
                )}

                {dailyLogs.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Past Scans History</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {dailyLogs.map((log, idx) => {
                        const statusMap = {
                          on_track: { label: 'On Track', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.12)' },
                          partial: { label: 'Partial', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
                          off_track: { label: 'Off Track', color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.12)' }
                        };
                        const s = statusMap[log.status] || statusMap.partial;
                        return (
                          <div key={idx} className="glass-card" style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {log.day} • {new Date(log.date).toLocaleDateString()}
                              </span>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: s.color, background: s.bg, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>
                                {s.label}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{log.feedback}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 10. AI CAREER MENTOR (PUTER.JS CHAT) */}
            {activeTab === 'mentor' && (
              <div className="fade-enter">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="badge-puter"><Sparkles size={14} /> {mentorConnection === 'online' ? 'Live Puter AI' : mentorConnection === 'offline' ? 'Offline Roadmap Coach' : mentorConnection === 'connecting' ? 'Connecting to Puter AI' : 'AI Mentor'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {mentorConnection === 'offline'
                      ? 'Live AI is unavailable; personalized roadmap guidance is still available.'
                      : `Ask questions about ${formData.goal}, task evidence, or resume preparation`}
                  </span>
                  {mentorConnection !== 'online' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ marginLeft: 'auto', padding: '0.4rem 0.7rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      onClick={ensurePuterConnection}
                      disabled={mentorConnection === 'connecting'}
                    >
                      {mentorConnection === 'connecting' ? 'Connecting...' : 'Connect Live AI'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.25rem' }}>
                  {[
                    `💡 How do I start learning ${formData.goal}?`,
                    `🛠️ What tools are essential for ${formData.goal}?`,
                    `💼 Resume tips for a ${formData.goal}`,
                    `🚀 Suggest 3 portfolio projects for ${formData.goal}`
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                      onClick={() => handleSendMessage(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="chat-container">
                  <div className="chat-messages">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`chat-bubble ${msg.sender}`}>
                        <div style={{ fontSize: '0.72rem', opacity: 0.7, marginBottom: '0.2rem', fontWeight: 600 }}>
                          {msg.sender === 'user' ? formData.name : 'Puter AI Mentor'}
                        </div>
                        <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                      </div>
                    ))}

                    {isChatTyping && (
                      <div className="chat-bubble ai">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                          <Sparkles size={14} className="animate-spin" /> Puter AI thinking...
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    style={{ display: 'flex', gap: '0.5rem' }}
                  >
                    <input 
                      type="text"
                      className="text-input"
                      placeholder={`Ask Puter AI anything about becoming a ${formData.goal}...`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isChatTyping}
                    />
                    <button className="btn-primary" type="submit" disabled={isChatTyping || !chatInput.trim()}>
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* COURSE PROGRESS VERIFICATION MODAL */}
            {activeCourse && (
              <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
                <div className="glass-card fade-enter mobile-modal" style={{ maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                    <div>
                      <span className="badge-puter" style={{ fontSize: '0.7rem' }}>Course Progress Scanner</span>
                      <h3 style={{ fontSize: '1.15rem', margin: '0.2rem 0 0 0', color: 'var(--text-primary)' }}>Verify: {activeCourse.title}</h3>
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setActiveCourse(null)}>
                      <X size={20} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Paste your certificate details, progress report, course completion URL, or describe the completion screenshot. AI will decide whether the course is complete or incomplete.
                  </p>
                  <textarea
                    className="text-input"
                    rows="7"
                    value={courseEvidence}
                    onChange={e => setCourseEvidence(e.target.value)}
                    placeholder="Example: Completed 100% of the course and passed the final assessment. Certificate URL: https://..."
                    disabled={isVerifyingCourse}
                    style={{ resize: 'vertical', minHeight: '130px', marginBottom: '0.75rem' }}
                  />
                  {courseVerifyError && <div role="alert" style={{ color: '#fca5a5', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{courseVerifyError}</div>}
                  {courseVerification && (
                    <div style={{ padding: '0.7rem', borderRadius: '8px', background: courseVerification.status === 'verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: courseVerification.status === 'verified' ? 'var(--accent-emerald)' : '#fbbf24', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                      <strong>{courseVerification.status === 'verified' ? 'Complete' : 'Incomplete / Needs More Proof'}</strong> ({courseVerification.score || 0}%)<br />
                      {courseVerification.feedback}
                    </div>
                  )}
                  <button className="btn-primary" onClick={handleVerifyCourse} disabled={isVerifyingCourse || !courseEvidence.trim()}>
                    {isVerifyingCourse ? <><Sparkles size={14} className="animate-spin" /> Scanning...</> : <><Sparkles size={14} /> Scan Progress</>}
                  </button>
                </div>
              </div>
            )}

            {/* TASK EVIDENCE VERIFICATION MODAL */}
            {activeVerifyTask && (
              <div className="modal-backdrop" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 9999, padding: '1rem'
              }}>
                <div className="glass-card fade-enter mobile-modal" style={{ maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
                    <div>
                      <span className="badge-puter" style={{ fontSize: '0.7rem' }}>
                        {activeVerificationType === 'experience' ? 'Experience Proof Scanner' : activeVerificationType === 'schedule' ? 'Schedule Proof Scanner' : 'Task Verification Engine'}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', margin: '0.2rem 0 0 0', color: 'var(--text-primary)' }}>
                        Verify: {activeVerifyTask.title}
                      </h3>
                    </div>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      onClick={() => setActiveVerifyTask(null)}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {activeVerificationType === 'experience'
                      ? 'Provide a certificate, project link, supervisor note, screenshot, or written record proving this experience was completed. Puter AI will review it.'
                      : activeVerificationType === 'schedule'
                        ? 'Provide a link, screenshot, notes, code, or other proof that you completed this scheduled activity. Puter AI will review it.'
                        : 'Paste your GitHub repo URL, code snippet, or a written summary of what you built for this task. Puter AI will evaluate your deliverable.'}
                  </p>

                  <div style={{ background: 'rgba(2, 6, 23, 0.4)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>EXPECTED OUTCOME</div>
                    <div style={{ color: 'var(--text-primary)' }}>{activeVerifyTask.expectedOutcome}</div>
                  </div>

                  <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label className="input-label">Your Proof / Evidence</label>
                    <textarea
                      className="text-input"
                      style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                      placeholder="Paste GitHub Repo URL (e.g. https://github.com/username/project) OR paste your code snippet / summary here..."
                      value={submissionInput}
                      onChange={e => setSubmissionInput(e.target.value)}
                      disabled={isVerifyingTask}
                    />
                    {verifyError && <div className="error-msg"><AlertCircle size={14} /> {verifyError}</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: verificationFeedback ? '1rem' : 0 }}>
                    <button className="btn-secondary" onClick={() => setActiveVerifyTask(null)}>Cancel</button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={handleVerifyTaskSubmission} disabled={isVerifyingTask}>
                      {isVerifyingTask ? <><Sparkles size={16} className="animate-spin" /> Evaluating Evidence...</> : <><Sparkles size={16} /> Submit Proof & Verify</>}
                    </button>
                  </div>

                  {/* Verification AI Result Feedback */}
                  {verificationFeedback && (
                    <div className="glass-card fade-enter" style={{ marginTop: '1rem', background: 'rgba(2, 6, 23, 0.6)', borderColor: verificationFeedback.status === 'verified' ? 'var(--accent-emerald)' : 'var(--glass-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '999px',
                          color: verificationFeedback.status === 'verified' ? 'var(--accent-emerald)' : '#f59e0b',
                          background: verificationFeedback.status === 'verified' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'
                        }}>
                          {verificationFeedback.status === 'verified' ? 'Verified ✅ (Score: ' + verificationFeedback.score + '%)' : 'Partial / Gaps Identified'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Evaluated by Puter AI
                        </span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                        {verificationFeedback.feedback}
                      </p>

                      {verificationFeedback.resumeBullet && (
                        <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '0.65rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)', marginBottom: '0.6rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>RESUME BULLET POINT GENERATED</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', margin: '0.2rem 0 0 0' }}>
                            "{verificationFeedback.resumeBullet}"
                          </p>
                        </div>
                      )}

                      {verificationFeedback.suggestions?.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>SUGGESTIONS</span>
                          <ul style={{ paddingLeft: '1.2rem', margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {verificationFeedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADJUST BUTTON */}
            <div className="form-actions form-actions--center" style={{ marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={() => setStep(4)}>
                <RefreshCw size={16} /> Change Target Career / Schedule
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="glass-container study-shell" 
      style={{ 
        maxWidth: step === 6 ? '1080px' : '640px', 
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: step === 0 ? 'center' : 'flex-start'
      }}
    >
      {renderStepContent()}
    </div>
  );
}
