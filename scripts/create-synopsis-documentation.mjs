import fs from 'node:fs';
import path from 'node:path';
import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

const root = process.cwd();
const output = path.join(root, 'AI_Career_Roadmap_Implementation_Documentation.docx');
const assets = path.join(root, 'report_assets');
const ink = '1F2937';
const navy = '1F4E79';
const gray = '667085';

const para = (text, opts = {}) => new Paragraph({
  spacing: { after: 140, line: 276 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: ink, ...opts })],
});
const heading = (text, level = HeadingLevel.HEADING_1) => new Paragraph({
  heading: level,
  spacing: { before: 260, after: 120 },
  children: [new TextRun({ text, font: 'Calibri', bold: true, color: '000000' })],
});
const bullet = text => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: ink })],
});
const page = () => new Paragraph({ children: [new PageBreak()] });
const cell = (text, header = false) => new TableCell({
  shading: { fill: header ? navy : 'FFFFFF' },
  margins: { top: 100, bottom: 100, left: 130, right: 130 },
  children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text, font: 'Calibri', size: 19, bold: header, color: header ? 'FFFFFF' : ink })] })],
});
const image = (name, caption) => [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 50 }, children: [new ImageRun({ data: fs.readFileSync(path.join(assets, name)), transformation: { width: 590, height: 332 }, type: 'png' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: caption, italics: true, font: 'Calibri', size: 18, color: gray })] }),
];

const architecture = new Table({
  width: { size: 9360, type: WidthType.DXA },
  rows: [
    new TableRow({ children: [cell('Layer', true), cell('Current implementation', true), cell('Purpose', true)] }),
    new TableRow({ children: [cell('Presentation'), cell('React and CSS'), cell('Responsive dashboard, onboarding, tabs, modals, profile, and progress views')] }),
    new TableRow({ children: [cell('Roadmap data'), cell('careerDatabase.js'), cell('Curated career profiles, fallback generation, stage tasks, courses, tools, projects, and experiences')] }),
    new TableRow({ children: [cell('AI services'), cell('Puter.js AI'), cell('Mentor responses, task evidence review, course progress review, and daily progress scanning')] }),
    new TableRow({ children: [cell('Persistence'), cell('Browser localStorage'), cell('Roadmap state, evidence, course status, daily logs, profile, and achievements')] }),
    new TableRow({ children: [cell('Exports'), cell('jsPDF and docx'), cell('User-facing PDF, Word, and JSON roadmap exports')] }),
  ],
});

const traceability = new Table({
  width: { size: 9360, type: WidthType.DXA },
  rows: [
    new TableRow({ children: [cell('Synopsis requirement', true), cell('Implemented website interpretation', true), cell('Status', true)] }),
    new TableRow({ children: [cell('Personalized roadmap'), cell('Career selection, level, timeline, and schedule generate roadmap content.'), cell('Implemented')] }),
    new TableRow({ children: [cell('Skill gap guidance'), cell('Career skills are grouped by Beginner, Intermediate, Advanced, and soft skills.'), cell('Implemented')] }),
    new TableRow({ children: [cell('Projects and courses'), cell('Career-specific projects, courses, provider links, outcomes, and proof workflows.'), cell('Implemented')] }),
    new TableRow({ children: [cell('Estimated timeline'), cell('Timeline and weekly hours are used in roadmap and study focus guidance.'), cell('Implemented')] }),
    new TableRow({ children: [cell('AI recommendations'), cell('Live Puter AI plus career-specific offline fallback coach.'), cell('Implemented with fallback')] }),
    new TableRow({ children: [cell('Progress tracking'), cell('Verified tasks, course records, experience records, daily logs, achievements, and profile.'), cell('Implemented')] }),
    new TableRow({ children: [cell('Future enhancements'), cell('Resume analysis, job-market connections, and mobile app remain future scope.'), cell('Planned')] }),
  ],
});

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 22, color: ink } } } },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Career Roadmap Generator', font: 'Calibri', size: 16, color: gray })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Implementation documentation | 8 September 2026', font: 'Calibri', size: 16, color: gray })] })] }) },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 90 }, children: [new TextRun({ text: 'AI Career Roadmap Generator', font: 'Calibri', bold: true, size: 34, color: '000000' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 90 }, children: [new TextRun({ text: 'Synopsis Understanding and Implementation Documentation', font: 'Calibri', bold: true, size: 25, color: '000000' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 350 }, children: [new TextRun({ text: 'Prepared from the submitted synopsis and the current website implementation', font: 'Calibri', size: 20, color: gray })] }),
      para('Prepared for the AI Career Roadmap project by Aifa and Abhishek', { bold: true }),
      para('Document date: 8 September 2026'),
      para('Document purpose: Explain what the synopsis means, how the current website implements it, what users can do, and what remains for future development.'),
      page(),

      heading('1. Executive Understanding'),
      para('The project is an AI-assisted career planning and learning application. A student, fresh graduate, professional, or career changer selects a target career, describes their current position, and receives a structured learning roadmap. The roadmap is intended to reduce confusion caused by random tutorials by showing what to learn, what to build, which resources to use, how long the journey may take, and what evidence demonstrates progress.'),
      para('The current website expands the original synopsis into an interactive study dashboard. Instead of displaying only a generated list, it provides staged learning progression, task verification, course completion review, experience evidence, projects, daily study plans, an AI Mentor, profile achievements, export options, and responsive views.'),
      heading('1.1 Main Project Value', HeadingLevel.HEADING_2),
      ...['Converts a broad career ambition into specific next actions.', 'Connects learning with practical proof such as projects, repositories, certificates, and reports.', 'Prevents later-stage access before foundational work is verified.', 'Shows career-specific content rather than one generic roadmap for every user.', 'Supports learners even when the live AI service is unavailable through an offline roadmap coach.'].map(bullet),
      page(),

      heading('2. Source Synopsis Restatement'),
      para('The submitted synopsis describes a Data Science based application that analyzes a user’s current skills and desired career role. It proposes personalized roadmaps, skill recommendations, projects, online courses, and estimated timelines. Its stated problem is that students often do not know which skills to learn after a degree or course and waste time following unrelated tutorials.'),
      heading('2.1 Synopsis Objectives', HeadingLevel.HEADING_2),
      ...['Generate personalized learning roadmaps.', 'Recommend skills based on career goals.', 'Suggest practical projects.', 'Recommend online courses.', 'Estimate the learning timeline.', 'Help students plan a career effectively.'].map(bullet),
      heading('2.2 Intended Scope', HeadingLevel.HEADING_2),
      para('The synopsis names students, graduates, and career switchers as users. It identifies multiple career paths such as Data Scientist, Software Developer, Web Developer, AI Engineer, Cloud Engineer, and Cybersecurity Analyst. The current implementation extends this scope with gaming, esports, design, business, data, and creative careers.'),
      page(),

      heading('3. Current Implementation Compared with the Synopsis'),
      para('The synopsis describes the original concept. The live project has evolved beyond the technology choices listed in the synopsis. This distinction is important for an academic submission: the Word documentation should describe the system that actually exists, while the synopsis can remain the original proposal if the project history requires it.'),
      traceability,
      heading('3.1 Technology Alignment Note', HeadingLevel.HEADING_2),
      para('The source synopsis lists Python, Pandas, NumPy, Scikit-learn, OpenAI API, Streamlit or Flask, and SQLite or MySQL as possible technologies. The current website source instead uses React, Vite, CSS, Lucide icons, Puter.js AI, browser localStorage, jsPDF, and docx export. The current system is therefore best described as a React web application with an AI service integration, not as a Python Streamlit Data Science application.'),
      page(),

      heading('4. Users and User Journey'),
      heading('4.1 Onboarding', HeadingLevel.HEADING_2),
      para('The learner enters their name, location, target career, current level, available time, and timeline. The system uses these inputs to produce a roadmap and study focus. The career selector is the main dynamic control: changing the career changes the role description, skills, tools, tasks, projects, courses, experience guidance, and mentor context.'),
      heading('4.2 Learning Journey', HeadingLevel.HEADING_2),
      ...['Start with Beginner foundations and the first practical task.', 'Submit proof when work is finished.', 'Review verification feedback and revise when necessary.', 'Complete all required Beginner work before Intermediate becomes available.', 'Progress through Intermediate and Advanced with increasingly realistic deliverables.', 'Use experience, internship-style work, and portfolio projects to reach Job Ready.', 'Use the Profile view to see achievements and verified progress.'].map(bullet),
      heading('4.3 Teacher or Reviewer Journey', HeadingLevel.HEADING_2),
      para('A teacher or reviewer can use the roadmap as a structured discussion aid. They can ask the learner to show evidence, inspect the expected outcomes, identify missing skills, and suggest improvements. The application supports this process but does not replace professional teaching or employer assessment.'),
      page(),

      heading('5. Functional Modules'),
      heading('5.1 Career Roadmap', HeadingLevel.HEADING_2),
      para('The roadmap is the central module. It displays a career overview, professional responsibilities, work settings, expected salary information where configured, technology and tool tags, categorized skills, stage progression, tasks, projects, and course recommendations.'),
      heading('5.2 Learning Stages', HeadingLevel.HEADING_2),
      para('The application uses four stages: Beginner, Intermediate, Advanced, and Job Ready. A stage is not simply a visual label. The stage controls access to tasks and is connected to verified evidence. If required tasks are incomplete, the learner receives a clear explanation instead of entering an empty or misleading stage.'),
      heading('5.3 Verified Tasks', HeadingLevel.HEADING_2),
      para('Tasks require evidence such as a repository URL, code snippet, project summary, screenshots, or a live demo. The AI evaluation returns a status and feedback. Only verified evidence contributes to completion and progression. Partial or needs-revision evidence is stored but does not unlock the next stage.'),
      heading('5.4 Courses', HeadingLevel.HEADING_2),
      para('Courses are linked to a career and learning level. The learner can open a course provider link and later submit a certificate, progress report, completion URL, or screenshot description. The course scanner returns a completion decision rather than trusting enrollment or a claim without supporting information.'),
      page(),

      heading('6. Experience, Projects, and Daily Study'),
      heading('6.1 Experience and Internships', HeadingLevel.HEADING_2),
      para('The Experience and Internships module provides role-relevant experience or internship-style deliverables. It is designed to help learners create evidence of workplace-like practice, such as tickets, reports, case studies, team work, tournament records, or supervised deliverables.'),
      heading('6.2 Projects', HeadingLevel.HEADING_2),
      para('Projects convert learning into portfolio evidence. A useful project should explain the problem, the learner’s responsibilities, tools used, decisions made, result achieved, and improvements planned. This is more meaningful than listing a tutorial title alone.'),
      heading('6.3 Weekly Schedule and Daily Scan', HeadingLevel.HEADING_2),
      para('The schedule provides manageable daily activities based on the learner’s plan. Daily Scan compares what the learner says they completed with the planned tasks and reports matched, missed, or partial progress. It is an accountability feature, not a replacement for evidence verification. A recent correction ensures that the Daily Scan cannot mark a task complete by itself.'),
      page(),

      heading('7. AI Mentor and Verification'),
      heading('7.1 Live AI', HeadingLevel.HEADING_2),
      para('When connected, Puter AI provides mentor responses, task evidence review, course progress review, and daily progress scanning. The prompt includes career context and learner progress so that the response can be more specific than a generic chatbot answer.'),
      heading('7.2 Offline Roadmap Coach', HeadingLevel.HEADING_2),
      para('If the live service is unavailable or times out, the website provides a roadmap-based fallback. The interface identifies the fallback state as Offline Roadmap Coach instead of claiming that a live AI model answered. This keeps the product usable while maintaining honesty about the service state.'),
      heading('7.3 Evidence Evaluation', HeadingLevel.HEADING_2),
      ...['Task evidence is evaluated against the expected outcome and required skills.', 'Course evidence is checked for completion signals such as a certificate, 100 percent progress, a final assessment, or a platform record.', 'Experience evidence is checked for a certificate, supervisor note, project link, or written record.', 'AI failure does not create a false completion; the result remains incomplete or needs revision.'].map(bullet),
      page(),

      heading('8. System Architecture'),
      para('The current implementation follows a browser-based React architecture. Career knowledge and roadmap generation are handled in a data module. UI state is held in React state and saved locally. External AI and authentication are optional service integrations.'),
      architecture,
      heading('8.1 Data Lifecycle', HeadingLevel.HEADING_2),
      ...['Onboarding inputs are used to create the roadmap.', 'Roadmap and progress state are saved in localStorage for the current browser profile.', 'Evidence records are associated with tasks, courses, experiences, or scheduled activities.', 'Changing the target career clears incompatible completion state before generating the new roadmap.', 'Delete Account removes local profile, roadmap, evidence, course, daily log, and achievement records after confirmation.'].map(bullet),
      page(),

      heading('9. Career Data and Dynamic Coverage'),
      para('The application supports a broad career selector and contains dedicated career profiles for common or specialized roles. The generator also has a safe fallback that creates meaningful stage content for a new career rather than showing an empty page.'),
      heading('9.1 Esports and Gaming Accuracy', HeadingLevel.HEADING_2),
      ...['Game Developer focuses on engines, gameplay programming, debugging, optimization, testing, and shipping.', 'Game Designer focuses on mechanics, level design, balancing, player experience, and design documentation.', 'Esports Player focuses on mechanics, game sense, replay review, team communication, performance routines, competitions, and tournament readiness.', 'Esports Coach focuses on team strategy, opponent analysis, practice design, feedback, and player development.'].map(bullet),
      heading('9.2 Resource Handling', HeadingLevel.HEADING_2),
      para('Course names and provider links should be periodically reviewed because external catalogs, pricing, access rules, and URLs change. The website should present provider links as external resources and should not imply that the app owns or guarantees those courses.'),
      page(),

      heading('10. Profile and Account Management'),
      para('The Profile view shows the learner identity, local profile status, avatar control, achievements, and progress. The current account model is designed for a client-side prototype. Puter authentication can connect the profile, while local roadmap records remain in the browser.'),
      heading('10.1 Login and Logout', HeadingLevel.HEADING_2),
      para('The login control starts the configured Google/Puter authorization flow. The learner must complete the external authorization themselves. Logout disconnects the local connected profile state while preserving the local roadmap unless the learner chooses Delete Account.'),
      heading('10.2 Delete Account', HeadingLevel.HEADING_2),
      para('Delete Account replaces the earlier Reset action. It displays a warning and removes local application data after confirmation. It does not delete a Google or Puter provider account. That distinction must remain clear in any public release.'),
      page(),

      heading('11. Testing and Quality Review'),
      para('The current project has been checked through source inspection, build and lint execution, dependency audit, career data checks, and browser UI verification. The key quality rule is that displayed completion should represent credible evidence, not just a click.'),
      ...['Build: Vite production build completes successfully.', 'Lint: Oxlint completes without warnings or errors after the Daily Scan correction.', 'Security audit: npm audit reports zero high-severity vulnerabilities in the current dependency tree.', 'Career coverage: all configured careers and the custom fallback expose all four roadmap stages.', 'Stage locking: later stages remain unavailable until earlier requirements are verified.', 'Profile and account controls: Profile, login entry point, logout state, avatar control, and Delete Account are present.', 'Responsive behavior: the study dashboard and evidence flows are designed for desktop and mobile widths.'].map(bullet),
      heading('11.1 Known Limitations', HeadingLevel.HEADING_2),
      ...['The original synopsis lists a Python and Streamlit technology stack, but the current implementation uses React and Vite.', 'Puter and Google authorization requires an external user-controlled login step.', 'Browser localStorage is not a secure cloud database or backup system.', 'The main production JavaScript bundle is large and can be improved through code splitting.', 'External course availability and job-market data require ongoing review.'].map(bullet),
      page(),

      heading('12. Future Enhancements'),
      ...['Resume analysis that compares a CV with the selected career roadmap.', 'LinkedIn or portfolio integration with explicit user consent.', 'Real-time job-market analysis using a maintained and verifiable data source.', 'Interview preparation with role-specific practice questions and feedback.', 'Internship and job recommendations with location, eligibility, and freshness checks.', 'Backend synchronization across devices with secure authentication and authorization.', 'Teacher or mentor dashboards for reviewing evidence and giving comments.', 'Native or progressive mobile application support.', 'Automated end-to-end tests for onboarding, stage locking, evidence, account, and mobile flows.', 'Accessibility testing for keyboard navigation, focus visibility, contrast, labels, and reduced motion.'].map(bullet),
      heading('12.1 Academic Submission Recommendation', HeadingLevel.HEADING_2),
      para('For an academic submission, present the original synopsis as the proposal and this document as the implementation report. Explain the technology-stack change directly: the project began as an AI and Data Science concept but was implemented as an interactive React web application with a live AI integration. This is a valid evolution as long as the report accurately describes what was built.'),
      page(),

      heading('13. Screenshots of the Current Implementation'),
      ...image('dashboard.png', 'Figure 1. Dynamic career dashboard with staged progression and study focus.'),
      ...image('profile.png', 'Figure 2. Profile view with achievements and Google/Puter connection entry point.'),
      ...image('courses.png', 'Figure 3. Course view with career-specific resources and proof-oriented completion.'),
      page(),

      heading('14. Conclusion'),
      para('The synopsis describes a system that reduces career-learning confusion by turning a target role into a structured plan. The current website implements that idea as a dynamic, evidence-based learning dashboard. It combines career-specific content, staged progression, task and course verification, daily study support, AI guidance, profile achievements, account controls, and responsive presentation.'),
      para('The most important implementation decision is the separation between claiming progress and verifying progress. This makes the roadmap more credible for learners, teachers, reviewers, and future employers. The next major development step is to move from a local browser prototype toward secure cloud persistence, stronger automated testing, maintained external resources, and production-grade authentication.'),
      para('This document represents the understanding of the submitted synopsis and the current website implementation.', { italics: true, color: gray }),
    ],
  }],
});

fs.writeFileSync(output, await Packer.toBuffer(doc));
console.log(output);
