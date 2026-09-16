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
  Paragraph,
  PageBreak,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

const root = process.cwd();
const assets = path.join(root, 'report_assets');
const output = path.join(root, 'career_road_map_report.docx');

const blue = '2E74B5';
const dark = '1F2937';

const body = (text, options = {}) => new Paragraph({
  spacing: { after: 140, line: 276 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: dark, ...options })],
});

const bullet = (text) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: dark })],
});

const heading = (text, level = HeadingLevel.HEADING_1) => new Paragraph({
  heading: level,
  spacing: { before: 260, after: 120 },
  children: [new TextRun({ text, bold: true, font: 'Calibri', color: blue })],
});
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const imageParagraph = (filename, caption) => {
  const image = fs.readFileSync(path.join(assets, filename));
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({ data: image, transformation: { width: 600, height: 338 }, type: 'png' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [new TextRun({ text: caption, italics: true, font: 'Calibri', size: 18, color: '667085' })],
    }),
  ];
};

const cell = (text, bold = false) => new TableCell({
  shading: { fill: bold ? blue : 'FFFFFF' },
  children: [new Paragraph({
    spacing: { after: 0 },
    children: [new TextRun({ text, bold, font: 'Calibri', size: 19, color: bold ? 'FFFFFF' : dark })],
  })],
});

const testRows = [
  ['Production build', 'PASS', 'Vite production build completed successfully.'],
  ['Lint', 'PASS', 'Oxlint completed with 0 warnings and 0 errors.'],
  ['Dependency audit', 'PASS', 'npm audit --audit-level=high reported 0 high-severity vulnerabilities.'],
  ['Career coverage', 'PASS', '24 careers checked; each has Beginner, Intermediate, Advanced, and Job Ready content.'],
  ['Stage progression', 'PASS', 'Intermediate, Advanced, and Job Ready remain locked until prerequisites are met.'],
  ['Evidence workflows', 'PASS', 'Task, course, schedule, project, and experience completion require proof or an explicit verification flow.'],
  ['Profile controls', 'PASS', 'Profile view, Google/Puter login entry point, avatar change, logout, and Delete Account UI verified.'],
  ['Responsive layout', 'PASS', 'Desktop and mobile layouts were exercised during the UI review.'],
];

const testTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  rows: [
    new TableRow({ children: [cell('Area', true), cell('Result', true), cell('Evidence', true)] }),
    ...testRows.map(([a, r, e]) => new TableRow({ children: [cell(a), cell(r), cell(e)] })),
  ],
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22, color: dark } } },
    title: { run: { font: 'Calibri', size: 34, bold: true, color: blue } },
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Career Roadmap AI', size: 16, color: '667085' })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Project report | 6 September 2026', size: 16, color: '667085' })] })] }) },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Career Roadmap AI Website', bold: true, font: 'Calibri', size: 36, color: blue })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Project Report and Synopsis', bold: true, font: 'Calibri', size: 28, color: dark })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 360 }, children: [new TextRun({ text: 'Functional review, testing summary, and product synopsis | 6 September 2026', font: 'Calibri', size: 20, color: '667085' })] }),

      heading('Synopsis'),
      body('Career Roadmap AI is a study-first career planning website that turns a selected career into a structured, evidence-based learning journey. It adapts the roadmap, tasks, courses, experience guidance, projects, recommendations, and AI mentor context to the selected career instead of showing one generic template.'),
      body('The product is designed for learners who need a clear path from Beginner to Job Ready. Progress is intentional: later stages stay locked until the learner completes the required earlier work, and completion actions ask for evidence such as a repository link, project summary, certificate, screenshot, or other proof.'),

      pageBreak(),
      heading('Purpose and Intended Use'),
      body('The website is intended to be used as a personal career-learning dashboard, not as an official university, licensing body, employer, or certification authority. Its purpose is to help a learner decide what to study next, create practical evidence, reflect on progress, and prepare a credible portfolio.'),
      body('A learner selects a target career and enters a starting level, available weekly time, and timeline. The application then creates a roadmap that translates broad career goals into staged topics, courses, tasks, projects, experience opportunities, recommendations, and study routines.'),
      body('Teachers, mentors, and reviewers can use the roadmap as a discussion aid. They can inspect a learner’s evidence, identify gaps, and guide the learner toward more specific deliverables. The AI Mentor provides coaching language, but the learner remains responsible for the work and the authenticity of submitted evidence.'),
      heading('Primary User Flows', HeadingLevel.HEADING_2),
      bullet('Select a career, study schedule, and experience level.'),
      bullet('Review the Beginner stage and start the first practical task.'),
      bullet('Complete the work, prepare evidence, and submit it for verification.'),
      bullet('Unlock the next stage only after the required earlier tasks are verified.'),
      bullet('Track course progress, internships, projects, daily study, and achievements in the profile.'),

      pageBreak(),
      heading('Implemented Scope'),
      bullet('Career-specific roadmaps for 24 careers, including software, data, creative, business, gaming, and esports paths.'),
      bullet('Dedicated Esports Player content focused on competitive performance, game sense, replay review, communication, tournaments, and player development rather than game development.'),
      bullet('Beginner, Intermediate, Advanced, and Job Ready stages with prerequisite locking and stage-specific tasks.'),
      bullet('Proof-aware task and course completion flows, including progress report or certificate evidence for courses.'),
      bullet('AI Mentor with live Puter AI connection when available and a useful offline fallback when the service is unavailable.'),
      bullet('Profile achievements, avatar upload, Google/Puter login entry point, logout, and Delete Account for local roadmap data.'),
      bullet('Responsive study-oriented interface for desktop and mobile widths, with export options for PDF, Word, and JSON.'),
      heading('What the Website Is Not', HeadingLevel.HEADING_2),
      body('The website does not guarantee employment, validate a person’s identity, issue an accredited certificate, or replace expert instruction. External courses, salary information, job-market conditions, and provider policies must be checked by the learner before making important education or career decisions.'),

      pageBreak(),
      heading('System Design'),
      body('The application is a client-side React and Vite website. The user interface, roadmap state, evidence records, profile settings, and export actions run in the browser. Career definitions are stored in a structured JavaScript data module, while generated roadmap data is normalized so every career has all four stages.'),
      heading('Main Technologies', HeadingLevel.HEADING_2),
      bullet('React 19 for component-based interface rendering and state-driven interactions.'),
      bullet('Vite for development server operation and production bundling.'),
      bullet('Lucide React for consistent interface icons.'),
      bullet('Puter.js for optional live AI responses and authentication connection.'),
      bullet('LocalStorage for local persistence of roadmap progress, evidence, course records, daily logs, and profile data.'),
      bullet('jsPDF and docx for user-facing roadmap exports.'),
      heading('Important Data Boundaries', HeadingLevel.HEADING_2),
      body('LocalStorage is convenient for a prototype and preserves progress on the same browser profile, but it is not a secure cloud database. A production version should move personal profile records and evidence to a protected backend with authentication, authorization, backups, audit history, and a documented retention policy.'),

      pageBreak(),
      heading('Progress and Evidence Logic'),
      body('The completion model separates “I did something today” from “the application accepts this as verified evidence.” This distinction prevents a casual click, an unsupported claim, or a vague daily note from falsely unlocking a later stage.'),
      heading('Task Verification', HeadingLevel.HEADING_2),
      body('A learner opens a task, supplies a repository URL, code snippet, screenshot description, live demo, or written project summary, and submits it to the verification engine. Only a verified result marks the task complete. Partial or needs-revision results remain visible and do not unlock later stages.'),
      heading('Course Verification', HeadingLevel.HEADING_2),
      body('Courses use a separate scanner that asks for a certificate, progress report, course completion URL, or a description of a completion screenshot. Enrollment, intention, or partial progress must not be treated as completion. A verified course record is stored with evidence and feedback.'),
      heading('Daily Scan Correction', HeadingLevel.HEADING_2),
      body('The Daily Scan compares the learner’s written notes with the planned activities and reports matched and missed items. It is an accountability aid only. It no longer marks an activity complete automatically from text; the learner must open the scheduled activity and provide proof through the evidence workflow.'),
      heading('Stage Unlocking', HeadingLevel.HEADING_2),
      body('Intermediate requires all Beginner tasks to be verified. Advanced requires all Beginner and Intermediate tasks to be verified. Job Ready additionally requires real-world experience evidence. This creates a defensible progression path instead of allowing a learner to skip foundational work.'),

      pageBreak(),
      heading('Career Coverage Review'),
      body('The career database was reviewed for stage coverage and role relevance. Each career is required to expose non-empty Beginner, Intermediate, Advanced, and Job Ready tasks. The review also checked that gaming and esports options are not confused with software development roles.'),
      heading('Gaming and Esports Distinction', HeadingLevel.HEADING_2),
      bullet('Game Developer: programming, engine workflows, gameplay systems, debugging, optimization, and shipping.'),
      bullet('Game Designer: mechanics, level design, balancing, player experience, and design documentation.'),
      bullet('Esports Player: mechanics training, game sense, VOD review, communication, tournament readiness, and performance habits.'),
      bullet('Esports Coach: team systems, opponent analysis, practice design, feedback, and player development.'),
      heading('Generic Fallback Protection', HeadingLevel.HEADING_2),
      body('The generator includes career profiles and a stage-repair function. If a saved or generated roadmap lacks a stage, the application supplies a stage-specific practical deliverable rather than rendering an empty section. This protects older saved roadmaps and new career additions from empty Intermediate, Advanced, or Job Ready screens.'),

      pageBreak(),
      heading('Quality Review'),
      body('The following checks were completed against the current project. PASS means the local implementation behaved as expected in the available environment.'),
      testTable,
      heading('Test Interpretation', HeadingLevel.HEADING_2),
      body('Build and lint results show that the source compiles and passes the configured static checks. The career audit shows that the visible career selector is backed by structured data. Browser checks confirmed that the main dashboard, profile, courses, staged progression, evidence modals, mentor view, and responsive layout render without an empty-screen failure.'),

      pageBreak(),
      heading('Test Cases and Expected Outcomes'),
      bullet('Open the website: the dashboard loads with the selected career, current percentage, daily focus, and stage progression.'),
      bullet('Select a locked stage: the interface explains which earlier stage must be verified first and does not navigate into an unlocked workflow.'),
      bullet('Open an unfinished task: the learner sees the expected outcome, evidence instructions, and a proof submission control.'),
      bullet('Submit no evidence: the verification action remains blocked or displays a clear validation message.'),
      bullet('Submit weak evidence: the result is not treated as verified and the task remains incomplete.'),
      bullet('Submit verified evidence: the task becomes complete and contributes to stage progression.'),
      bullet('Open a course: the course displays progress-verification instructions and a provider link when configured.'),
      bullet('Run Daily Scan: the app reports matched/missed activity but does not award completion without proof.'),
      bullet('Open Profile: achievements, local profile status, avatar control, and login entry point are visible.'),
      bullet('Use Delete Account: a confirmation warning is shown before local data is removed.'),
      bullet('Resize to mobile: navigation and cards remain usable without relying on a desktop-only layout.'),

      pageBreak(),
      heading('Verified Learning Resources'),
      body('The esports pathway includes real provider links rather than placeholder course names:'),
      bullet('Aimlabs Academy: aimlabs.com, for aim and mechanics training.'),
      bullet('IESF Academy: academy.iesf.org, for esports player development and competitive education.'),
      body('External course availability and provider content can change independently of this application. The links are therefore presented as external resources, not copied course content.'),
      heading('Resource Governance Recommendation', HeadingLevel.HEADING_2),
      body('Before a public release, maintain a small resource registry with the provider name, direct URL, last-reviewed date, access type, intended stage, and replacement URL. A scheduled link checker should flag broken links, redirects, or pages that no longer contain the named course. This is especially important because course catalogs and pricing change frequently.'),

      pageBreak(),
      heading('Screenshots'),
      ...imageParagraph('dashboard.png', 'Figure 1. Dynamic Game Developer roadmap with staged progress and account control.'),
      ...imageParagraph('profile.png', 'Figure 2. Profile view with achievement tracking, avatar controls, and login entry point.'),
      ...imageParagraph('courses.png', 'Figure 3. Courses view for the selected career with progress and proof-oriented actions.'),

      pageBreak(),
      heading('Security, Privacy, and Account Lifecycle'),
      body('The current Delete Account action is intentionally explicit and local. It clears the application’s stored roadmap, evidence, course records, daily logs, achievements, and profile data after confirmation. Logout clears the local connected profile state while preserving the learner’s local roadmap, so a learner can leave and return without losing study work.'),
      body('The current login entry point connects to Puter and can retrieve the connected user profile. Google authorization is external and must be completed by the learner. The application should never collect a Google password, request an OTP in its own form, or claim that local account deletion removes the provider account.'),
      heading('Production Security Checklist', HeadingLevel.HEADING_2),
      bullet('Use a backend session model with secure, expiring tokens and server-side authorization.'),
      bullet('Encrypt sensitive evidence at rest and in transit.'),
      bullet('Add export, deletion, and retention policies in the privacy notice.'),
      bullet('Avoid sending private evidence to AI providers without clear consent.'),
      bullet('Add rate limits, input size limits, abuse monitoring, and error logging without storing unnecessary personal content.'),

      pageBreak(),
      heading('Accessibility and Teaching Quality'),
      body('The study-first layout groups one learning decision at a time: what to learn, why it matters, what to build, and what proof to submit. This supports novice learners better than a dashboard that only displays percentages.'),
      heading('Teaching Principles Used', HeadingLevel.HEADING_2),
      bullet('Scaffolded learning: foundational tasks appear before applied and advanced work.'),
      bullet('Authentic assessment: learners submit artifacts that resemble real workplace evidence.'),
      bullet('Feedback loops: verification results include feedback and suggested next actions.'),
      bullet('Visible progress: achievements, stage status, daily logs, and evidence history make progress concrete.'),
      bullet('Career relevance: each role’s tools, tasks, projects, and outcomes are adapted to the chosen occupation.'),
      heading('Recommended Accessibility Improvements', HeadingLevel.HEADING_2),
      body('Add automated keyboard navigation checks, visible focus states for every interactive control, semantic labels for icon-only buttons, high-contrast validation, reduced-motion support, and screen-reader announcements for verification status changes. These additions would improve the experience for learners using assistive technology.'),

      pageBreak(),
      heading('Limitations and Next Steps'),
      bullet('Google login requires the learner to complete the external Puter/Google authorization step. That sensitive authorization was not automated during testing.'),
      bullet('Delete Account currently deletes the application’s local profile, roadmap progress, evidence, courses, and achievements. It does not delete a Google or Puter provider account.'),
      bullet('The build remains functional but Vite reports a large main chunk warning. Dynamic imports and further code splitting can improve initial load performance.'),
      bullet('For a production release, add a backend identity layer, encrypted cloud persistence, provider account deletion guidance, automated end-to-end tests, and a scheduled review of external course links.'),
      heading('Recommended Release Gate', HeadingLevel.HEADING_2),
      body('Before calling the product production-ready, run an end-to-end suite in a clean browser profile, authorize a test account, verify logout and re-login, test account deletion against a disposable account, confirm that evidence cannot be bypassed through refresh or navigation, and validate every external course link. A teacher should also review the task difficulty and expected proof for each career family.'),

      pageBreak(),
      heading('Conclusion'),
      body('The current website is a functioning dynamic career-learning prototype with broad career coverage, meaningful stage progression, evidence-aware completion, profile controls, and a study-focused responsive interface. Local build, lint, security, data-coverage, and UI checks passed. The remaining production considerations are primarily external authentication, cloud account lifecycle, and performance hardening.'),
      heading('Synopsis for Presentation or Submission', HeadingLevel.HEADING_2),
      body('Career Roadmap AI is a dynamic web application that helps learners move from career interest to evidence-backed readiness. It creates role-specific learning plans, provides practical tasks and courses, checks proof of completion, prevents premature stage skipping, and records achievements in a learner profile. The system supports technical, creative, business, gaming, and esports careers. Its educational value comes from connecting study with demonstrable work rather than treating course enrollment or unchecked buttons as success.'),
      body('The application was reviewed as both a software product and a teaching tool. The current implementation is suitable for demonstration, academic submission, and continued development. A production release should add secure cloud persistence, formal identity management, stronger automated testing, and ongoing resource maintenance.'),

      heading('Implemented Scope'),
      bullet('Career-specific roadmaps for 24 careers, including software, data, creative, business, gaming, and esports paths.'),
      bullet('Dedicated Esports Player content focused on competitive performance, game sense, replay review, communication, tournaments, and player development rather than game development.'),
      bullet('Beginner, Intermediate, Advanced, and Job Ready stages with prerequisite locking and stage-specific tasks.'),
      bullet('Proof-aware task and course completion flows, including progress report or certificate evidence for courses.'),
      bullet('AI Mentor with live Puter AI connection when available and a useful offline fallback when the service is unavailable.'),
      bullet('Profile achievements, avatar upload, Google/Puter login entry point, logout, and Delete Account for local roadmap data.'),
      bullet('Responsive study-oriented interface for desktop and mobile widths, with export options for PDF, Word, and JSON.'),

      heading('Quality Review'),
      body('The following checks were completed against the current project. PASS means the local implementation behaved as expected in the available environment.'),
      testTable,

      heading('Verified Learning Resources'),
      body('The esports pathway includes real provider links rather than placeholder course names:'),
      bullet('Aimlabs Academy: aimlabs.com, for aim and mechanics training.'),
      bullet('IESF Academy: academy.iesf.org, for esports player development and competitive education.'),
      body('External course availability and provider content can change independently of this application. The links are therefore presented as external resources, not copied course content.'),

      heading('Screenshots'),
      ...imageParagraph('dashboard.png', 'Figure 1. Dynamic Game Developer roadmap with staged progress and account control.'),
      ...imageParagraph('profile.png', 'Figure 2. Profile view with achievement tracking, avatar controls, and login entry point.'),
      ...imageParagraph('courses.png', 'Figure 3. Courses view for the selected career with progress and proof-oriented actions.'),

      heading('Limitations and Next Steps'),
      bullet('Google login requires the learner to complete the external Puter/Google authorization step. That sensitive authorization was not automated during testing.'),
      bullet('Delete Account currently deletes the application’s local profile, roadmap progress, evidence, courses, and achievements. It does not delete a Google or Puter provider account.'),
      bullet('The build remains functional but Vite reports a large main chunk warning. Dynamic imports and further code splitting can improve initial load performance.'),
      bullet('For a production release, add a backend identity layer, encrypted cloud persistence, provider account deletion guidance, automated end-to-end tests, and a scheduled review of external course links.'),

      heading('Conclusion'),
      body('The current website is a functioning dynamic career-learning prototype with broad career coverage, meaningful stage progression, evidence-aware completion, profile controls, and a study-focused responsive interface. Local build, lint, security, data-coverage, and UI checks passed. The remaining production considerations are primarily external authentication, cloud account lifecycle, and performance hardening.'),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync(output, buffer);
console.log(output);
