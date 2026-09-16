import fs from 'node:fs';
import path from 'node:path';
import {
  AlignmentType, Document, Footer, Header, HeadingLevel, ImageRun, Packer,
  PageBreak, Paragraph, Table, TableCell, TableRow, TextRun, WidthType
} from 'docx';

const root = process.cwd();
const output = path.join(root, 'AI_Career_Roadmap_Academic_Project_Report.docx');
const assets = path.join(root, 'report_assets');
const ink = '1F2937';
const gray = '667085';
const navy = '1F4E79';

const paragraph = (text, options = {}) => new Paragraph({
  spacing: { after: 130, line: 276 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: ink, ...options })]
});
const heading = (text, level = HeadingLevel.HEADING_1) => new Paragraph({
  heading: level,
  spacing: { before: 260, after: 120 },
  children: [new TextRun({ text, font: 'Calibri', bold: true, color: '000000' })]
});
const bullet = text => new Paragraph({
  bullet: { level: 0 }, spacing: { after: 75 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: ink })]
});
const numbered = text => new Paragraph({
  numbering: { reference: 'report-numbering', level: 0 }, spacing: { after: 75 },
  children: [new TextRun({ text, font: 'Calibri', size: 22, color: ink })]
});
const page = () => new Paragraph({ children: [new PageBreak()] });
const tableCell = (text, header = false) => new TableCell({
  shading: { fill: header ? navy : 'FFFFFF' },
  margins: { top: 100, bottom: 100, left: 120, right: 120 },
  children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text, font: 'Calibri', size: 19, bold: header, color: header ? 'FFFFFF' : ink })] })]
});
const table = (headers, rows) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  rows: [new TableRow({ children: headers.map(h => tableCell(h, true)) }), ...rows.map(row => new TableRow({ children: row.map(c => tableCell(c)) }))]
});
const figure = (file, caption) => [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 50 }, children: [new ImageRun({ data: fs.readFileSync(path.join(assets, file)), transformation: { width: 590, height: 332 }, type: 'png' })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 150 }, children: [new TextRun({ text: caption, italics: true, font: 'Calibri', size: 18, color: gray })] })
];

const contents = [
  '1. Introduction', '2. Background and Problem Statement', '3. Objectives and Scope',
  '4. Existing and Proposed System', '5. Requirements Specification', '6. Feasibility Study',
  '7. Methodology', '8. System Design', '9. Implementation', '10. Testing and Validation',
  '11. Results and Discussion', '12. Limitations and Future Scope', '13. Conclusion', '14. References'
];

const doc = new Document({
  numbering: { config: [{ reference: 'report-numbering', levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  styles: { default: { document: { run: { font: 'Calibri', size: 22, color: ink } } } },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'AI Career Roadmap Generator', font: 'Calibri', size: 16, color: gray })] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Academic Project Report | 8 September 2026', font: 'Calibri', size: 16, color: gray })] })] }) },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 160, after: 120 }, children: [new TextRun({ text: 'AI CAREER ROADMAP GENERATOR', font: 'Calibri', bold: true, size: 34, color: '000000' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'Academic Project Report', font: 'Calibri', bold: true, size: 27, color: '000000' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: 'A dynamic AI-assisted learning and career planning web application', font: 'Calibri', size: 21, color: gray })] }),
      paragraph('Submitted by', { bold: true }),
      paragraph('Aifa and Abhishek', { bold: true }),
      paragraph('Project area: Artificial Intelligence, Career Guidance, Web Application Development, and Educational Technology'),
      paragraph('Academic year: 2026'),
      paragraph('Date: 8 September 2026'),
      heading('Abstract'),
      paragraph('The AI Career Roadmap Generator is a dynamic web application designed to help students, graduates, and career switchers plan a structured path toward a chosen career. The system converts a target role, current level, available study time, and timeline into a roadmap containing career-specific skills, learning stages, practical tasks, projects, courses, internships or experience activities, and job-readiness guidance.'),
      paragraph('The current implementation extends the original synopsis by adding evidence-based completion. Learners must submit proof such as a repository, project summary, certificate, progress report, screenshot description, or experience record before work is counted as verified. The application also includes stage locking, a live AI Mentor with an offline fallback, profile achievements, login and logout entry points, local account deletion, exports, and responsive layouts.'),
      paragraph('The project demonstrates how artificial intelligence and structured educational design can be combined to reduce random learning and encourage portfolio-based progress. The current version is a functional browser-based prototype. Production deployment would require secure cloud persistence, stronger identity management, maintained external resources, privacy controls, and automated end-to-end testing.'),
      page(),

      heading('Table of Contents'),
      ...contents.map((item, _i) => paragraph(`${item}`)),
      heading('List of Figures'),
      paragraph('Figure 1. Dynamic career dashboard'),
      paragraph('Figure 2. Profile and achievement view'),
      paragraph('Figure 3. Career-specific courses view'),
      heading('List of Tables'),
      paragraph('Table 1. Comparison of existing and proposed system'),
      paragraph('Table 2. Functional requirements'),
      paragraph('Table 3. Technology architecture'),
      paragraph('Table 4. Test results'),
      page(),

      heading('1. Introduction'),
      paragraph('Choosing a career is difficult when learners do not know which skills matter, which order to study them in, or how to prove that they can apply what they learned. Students may complete tutorials without building a portfolio, collect unrelated certificates, or switch between technologies without a measurable plan. The AI Career Roadmap Generator addresses this problem by organizing career preparation into a structured, interactive learning path.'),
      paragraph('The system accepts learner information and a target career. It uses career knowledge, roadmap generation, and optional AI services to recommend relevant skills, tasks, projects, courses, experience activities, timelines, and next steps. The website is intended to make career learning more specific, practical, and measurable.'),
      heading('1.1 Report Purpose', HeadingLevel.HEADING_2),
      paragraph('This report documents the project for academic review. It explains the problem, objectives, scope, requirements, feasibility, method, architecture, implementation, testing, results, limitations, and future development. It also clarifies the difference between the original synopsis technology proposal and the current website technology stack.'),
      heading('1.2 Project Identity', HeadingLevel.HEADING_2),
      table(['Item', 'Description'], [
        ['Project title', 'AI Career Roadmap Generator'],
        ['Project type', 'Dynamic AI-assisted educational web application'],
        ['Primary users', 'Students, graduates, professionals, and career switchers'],
        ['Main output', 'Career-specific learning roadmap with verified progress'],
        ['Current implementation', 'React and Vite browser application'],
      ]),
      page(),

      heading('2. Background and Problem Statement'),
      paragraph('Many learners begin a career journey with incomplete information. They may know the name of a desired role but not the tools, foundational concepts, practical projects, or evidence expected by employers. Search engines and video platforms provide large amounts of content, but they do not automatically create a coherent sequence for a particular learner.'),
      paragraph('The problem is therefore not only a lack of information. It is a lack of prioritization, sequencing, feedback, and accountability. A useful career-learning system must help the learner decide what to do next and explain how the activity contributes to the selected role.'),
      heading('2.1 Problem Statement', HeadingLevel.HEADING_2),
      paragraph('Students and early-career learners need a personalized and practical learning roadmap that connects career goals with skills, projects, courses, timelines, and credible evidence of completion. Without such guidance, they may follow random tutorials, skip foundations, misunderstand a career role, or believe they are job-ready without portfolio proof.'),
      heading('2.2 Motivation', HeadingLevel.HEADING_2),
      ...['Reduce confusion about what to learn next.', 'Encourage practical work instead of passive course consumption.', 'Help learners understand differences between related careers.', 'Make progress visible through verified tasks and achievements.', 'Provide useful guidance even when a live AI service is unavailable.'].map(bullet),
      page(),

      heading('3. Objectives and Scope'),
      heading('3.1 Objectives', HeadingLevel.HEADING_2),
      ...['Generate personalized learning roadmaps from a selected career and learner profile.', 'Recommend relevant skills, tools, projects, courses, internships, and experience activities.', 'Estimate study effort through weekly schedules and timeline guidance.', 'Require proof before tasks, courses, experiences, or stages count as completed.', 'Provide AI-assisted mentoring that is specific to the selected career.', 'Track verified progress through a learner profile and achievement view.', 'Provide a responsive interface for desktop and mobile users.'].map(bullet),
      heading('3.2 Scope', HeadingLevel.HEADING_2),
      paragraph('The application supports multiple career paths across software, data, cloud, cybersecurity, design, business, gaming, and esports. Each roadmap is organized into Beginner, Intermediate, Advanced, and Job Ready stages. The system includes onboarding, roadmap generation, task evidence, course progress review, experience proof, projects, recommendations, weekly scheduling, daily scan, AI Mentor, profile controls, and exports.'),
      heading('3.3 Out of Scope', HeadingLevel.HEADING_2),
      ...['The application does not guarantee employment or salary outcomes.', 'It does not issue an accredited academic certificate.', 'It does not replace a teacher, mentor, employer, or professional assessor.', 'It does not automatically delete a Google or Puter provider account.', 'It does not provide a secure cloud backup in its current localStorage-based prototype form.'].map(bullet),
      page(),

      heading('4. Existing and Proposed System'),
      ...constExisting(),
      heading('4.1 Proposed System', HeadingLevel.HEADING_2),
      paragraph('The proposed system is a dynamic career-learning dashboard. The learner chooses a career and profile information, then receives a structured roadmap. The system explains why a skill or task matters, gives a practical outcome, asks for proof, and updates the learner’s progress only after verification.'),
      table(['Area', 'Existing approach', 'Proposed approach'], [
        ['Learning plan', 'Random tutorials and disconnected lists', 'Career-specific staged roadmap'],
        ['Progress', 'Self-reported or unclear', 'Proof-based verification and achievements'],
        ['Career selection', 'Generic advice', 'Dedicated role data and dynamic fallback'],
        ['AI support', 'No contextual mentor', 'Live AI Mentor plus offline coach'],
        ['Account data', 'No profile lifecycle', 'Profile, login entry, logout, and local deletion'],
      ]),
      page(),

      heading('5. Requirements Specification'),
      heading('5.1 Functional Requirements', HeadingLevel.HEADING_2),
      table(['ID', 'Requirement'], [
        ['FR-01', 'The user shall select a target career from multiple career paths.'],
        ['FR-02', 'The system shall generate career-specific skills, tasks, courses, projects, and recommendations.'],
        ['FR-03', 'Each career shall contain Beginner, Intermediate, Advanced, and Job Ready stages.'],
        ['FR-04', 'Later stages shall remain locked until earlier required work is verified.'],
        ['FR-05', 'Completion actions shall require proof appropriate to the task or activity.'],
        ['FR-06', 'The system shall store verification status and feedback.'],
        ['FR-07', 'The Courses view shall support progress or certificate verification.'],
        ['FR-08', 'The AI Mentor shall use the selected career and current progress as context.'],
        ['FR-09', 'The system shall provide an offline fallback when live AI is unavailable.'],
        ['FR-10', 'The Profile view shall show achievements and progress.'],
        ['FR-11', 'The system shall provide login, logout, avatar change, and Delete Account controls.'],
        ['FR-12', 'The system shall support roadmap exports.'],
      ]),
      heading('5.2 Non-Functional Requirements', HeadingLevel.HEADING_2),
      ...['Usability: instructions and errors should be understandable to a beginner.', 'Responsiveness: core flows should work on desktop and mobile widths.', 'Reliability: AI or network failure should not create false completion.', 'Maintainability: career data should be separated from interface code.', 'Privacy: the application should not collect passwords or unnecessary sensitive data.', 'Performance: production bundles should be monitored and improved through code splitting.', 'Accessibility: controls should have labels, visible focus, readable contrast, and sensible keyboard behavior.'].map(bullet),
      page(),

      heading('6. Feasibility Study'),
      heading('6.1 Technical Feasibility', HeadingLevel.HEADING_2),
      paragraph('The project is technically feasible because the current implementation already runs as a Vite React application and uses structured career data. The browser can manage the interface, local persistence, exports, and evidence forms. Puter.js provides optional AI and authentication integration.'),
      heading('6.2 Operational Feasibility', HeadingLevel.HEADING_2),
      paragraph('The system is operationally feasible for learners because it presents one next action at a time and does not require advanced technical knowledge to begin. Teachers can use it as a planning and feedback aid. The main operational requirement is ongoing review of external course links and career content.'),
      heading('6.3 Economic Feasibility', HeadingLevel.HEADING_2),
      paragraph('The prototype uses open-source front-end libraries and browser storage, which keeps initial development cost low. A production version would require hosting, secure storage, authentication infrastructure, AI usage management, monitoring, backups, and ongoing maintenance.'),
      heading('6.4 Schedule Feasibility', HeadingLevel.HEADING_2),
      paragraph('The project can be developed incrementally: first career selection and roadmap generation, then stage progression, proof verification, courses, profile, AI Mentor, exports, and finally production security and cloud persistence.'),
      page(),

      heading('7. Methodology'),
      paragraph('The project follows an iterative development methodology. Requirements were translated into interface flows and career data structures. The system was then tested through source inspection, build and lint checks, data audits, browser interaction, and responsive review.'),
      heading('7.1 User Method', HeadingLevel.HEADING_2),
      ...['User enters profile information and target career.', 'System prepares a roadmap and initial study focus.', 'User studies the current stage and completes practical work.', 'User submits proof for review.', 'System records the verification result and feedback.', 'Verified work contributes to progress and unlocks the next stage.'].map(x => numbered(x)),
      heading('7.2 Evidence-Based Learning Method', HeadingLevel.HEADING_2),
      paragraph('The project treats learning as a cycle of study, application, evidence, feedback, and revision. This is intentionally different from a system that marks every checkbox as complete. The learner is encouraged to produce a reviewable artifact or explanation that demonstrates the expected outcome.'),
      heading('7.3 AI Method', HeadingLevel.HEADING_2),
      paragraph('Prompts provide the AI service with career, stage, task, skills, course, and evidence context. Responses are normalized into application statuses. If the service fails, the application uses a deterministic career-aware fallback rather than claiming a live AI response.'),
      page(),

      heading('8. System Design'),
      heading('8.1 High-Level Architecture', HeadingLevel.HEADING_2),
      paragraph('The system architecture is organized into presentation, career data, AI service, persistence, and export layers. This allows the interface to remain dynamic while keeping career definitions and output generation manageable.'),
      table(['Layer', 'Technology or module', 'Responsibility'], [
        ['Presentation', 'React, CSS, Lucide React', 'Renders onboarding, dashboard, tabs, forms, modals, and responsive views.'],
        ['Career data', 'src/data/careerDatabase.js', 'Stores curated profiles and creates fallback roadmaps.'],
        ['AI integration', '@heyputer/puter.js', 'Mentor, task review, course review, and daily scan.'],
        ['Persistence', 'localStorage', 'Saves roadmap, evidence, progress, logs, and profile data locally.'],
        ['Export', 'jsPDF and docx', 'Creates user-facing roadmap documents.'],
      ]),
      heading('8.2 Main Data Entities', HeadingLevel.HEADING_2),
      ...['Form data: name, location, career goal, level, timeline, and schedule.', 'Roadmap data: overview, skills, technologies, courses, stages, tasks, projects, experiences, and micro plans.', 'Verified submissions: evidence text, status, score, feedback, suggestions, and verification date.', 'Course records: evidence, status, feedback, and verification date.', 'Profile data: display name, email, avatar, and provider.', 'Daily logs: planned day, user input, matched tasks, missed tasks, feedback, and encouragement.'].map(bullet),
      page(),

      heading('9. Implementation'),
      heading('9.1 Technology Stack', HeadingLevel.HEADING_2),
      table(['Technology', 'Use in project'], [
        ['React', 'Component-based interface and state-driven rendering.'],
        ['Vite', 'Development server and production build tool.'],
        ['JavaScript', 'Application logic and career data generation.'],
        ['CSS', 'Dark study-focused theme and responsive layout.'],
        ['Puter.js', 'Optional live AI and authentication integration.'],
        ['Lucide React', 'Consistent icons for controls and statuses.'],
        ['localStorage', 'Browser persistence for prototype data.'],
        ['jsPDF and docx', 'PDF, Word, and roadmap export support.'],
      ]),
      heading('9.2 Career Data Strategy', HeadingLevel.HEADING_2),
      paragraph('Curated career profiles are used for common and specialized roles. The data contains professional responsibilities, work settings, salary descriptions where available, tools, skill categories, course names and platforms, topics, projects, tasks, experiences, and outcomes. A fallback builder creates role-specific content for new career names and a stage repair function prevents empty stages in saved roadmaps.'),
      heading('9.3 Gaming and Esports Specialization', HeadingLevel.HEADING_2),
      ...['Game Developer: gameplay systems, engines, debugging, optimization, testing, and shipping.', 'Game Designer: mechanics, level design, balance, player experience, and design documentation.', 'Esports Player: mechanics practice, game sense, VOD review, teamwork, competition, tournament readiness, and recovery habits.', 'Esports Coach: opponent analysis, team strategy, practice plans, feedback, and player development.'].map(bullet),
      page(),

      heading('10. Testing and Validation'),
      paragraph('Testing was performed through static checks, data checks, browser checks, and negative-flow review. The goal was to verify both technical operation and educational trust.'),
      table(['Test area', 'Expected result', 'Observed result'], [
        ['Lint', 'No source warnings or errors', 'Passed'],
        ['Production build', 'Application bundles successfully', 'Passed with non-blocking third-party and chunk-size warnings'],
        ['Dependency audit', 'No high-severity vulnerabilities', '0 high-severity vulnerabilities'],
        ['Career coverage', 'Every career has four stages', 'Passed'],
        ['Stage locking', 'Later stages require verified earlier work', 'Passed'],
        ['Daily Scan', 'Reports progress without bypassing proof', 'Corrected and passed review'],
        ['Profile controls', 'Profile, login entry, avatar, logout, and Delete Account visible', 'Passed'],
        ['Responsive layout', 'Core controls usable on small screens', 'Passed during UI review'],
      ]),
      heading('10.1 Negative Tests', HeadingLevel.HEADING_2),
      ...['Submit an empty task proof: validation message appears and verification does not start.', 'Submit incomplete course evidence: course remains incomplete or needs revision.', 'Try to select a locked stage: access message explains the missing prerequisite.', 'Run Daily Scan without proof: matched text does not unlock a stage.', 'Delete Account: warning appears before local records are removed.', 'Live AI unavailable: offline roadmap coach remains available and is labeled honestly.'].map(bullet),
      page(),

      heading('11. Results and Discussion'),
      paragraph('The resulting website is more than a static roadmap generator. It behaves as an interactive learning companion. The selected career controls the content, the learner’s verified work controls stage progression, and the profile summarizes achievement. This creates a stronger connection between planning and evidence than the original high-level synopsis alone describes.'),
      paragraph('The project successfully addresses the main problem statement by reducing the number of decisions a learner must make at the beginning of a career journey. It does not remove the need for effort or judgment; instead, it makes the next step clearer and helps the learner produce proof that can be reviewed.'),
      heading('11.1 Strengths', HeadingLevel.HEADING_2),
      ...['Dynamic career-specific content.', 'Clear Beginner-to-Job Ready progression.', 'Proof-based completion instead of unchecked progress.', 'Live AI plus honest offline fallback.', 'Profile achievements and local account controls.', 'Responsive study-focused interface.', 'Broad coverage including gaming and esports careers.'].map(bullet),
      heading('11.2 Current Risks', HeadingLevel.HEADING_2),
      ...['LocalStorage is not a secure cloud account system.', 'External course links and job-market information require maintenance.', 'Live AI quality depends on the external provider and prompt response.', 'The production bundle is large and should be split for faster loading.', 'Google/Puter authentication requires user-controlled external authorization.'].map(bullet),
      page(),

      heading('12. Limitations and Future Scope'),
      heading('12.1 Limitations', HeadingLevel.HEADING_2),
      paragraph('The application is currently a client-side prototype. Local browser persistence does not provide synchronization, backups, multi-device access, or server-side security. AI responses are dependent on an external service. Course and career information can become outdated. Salary and market descriptions should be treated as guidance rather than guarantees.'),
      heading('12.2 Future Enhancements', HeadingLevel.HEADING_2),
      ...['Resume analysis and skill-gap comparison.', 'LinkedIn or portfolio integration with explicit consent.', 'Real-time job-market analysis with source freshness and region filters.', 'Interview preparation and role-specific mock interviews.', 'Internship and job recommendations.', 'Secure backend accounts and cross-device synchronization.', 'Teacher dashboard and mentor review workflow.', 'Automated link checking for external courses.', 'Automated browser tests and accessibility testing.', 'Progressive Web App or native mobile application.'].map(bullet),
      page(),

      heading('13. Screenshots'),
      ...figure('dashboard.png', 'Figure 1. Dynamic dashboard showing career roadmap, daily focus, and stage progression.'),
      ...figure('profile.png', 'Figure 2. Profile view showing achievements and account connection entry point.'),
      ...figure('courses.png', 'Figure 3. Courses view showing career-specific course information and verification flow.'),
      page(),

      heading('14. Conclusion'),
      paragraph('The AI Career Roadmap Generator is a practical AI-assisted educational web application that helps learners plan and demonstrate career progress. It transforms a desired career into a staged learning path with skills, tools, projects, courses, experience activities, schedules, AI mentoring, and evidence verification.'),
      paragraph('The current implementation fulfills the central idea of the submitted synopsis while extending it with a stronger progress model. The most important quality improvement is that a learner cannot unlock later progress by simply clicking a button or writing an unsupported claim. Verified evidence is required, and the system clearly separates live AI responses from offline guidance.'),
      paragraph('The project is suitable for academic demonstration and continued development. For production use, the next priorities are secure cloud persistence, formal authentication, ongoing external-resource maintenance, automated end-to-end testing, accessibility validation, and performance optimization.'),
      page(),

      heading('References'),
      paragraph('1. React Documentation. https://react.dev/'),
      paragraph('2. Vite Documentation. https://vite.dev/'),
      paragraph('3. MDN Web Docs. Web APIs and browser storage. https://developer.mozilla.org/'),
      paragraph('4. Puter.js Documentation. https://docs.puter.com/'),
      paragraph('5. jsPDF Documentation. https://github.com/parallax/jsPDF'),
      paragraph('6. Aimlabs. Esports and aim training resource. https://aimlabs.com/'),
      paragraph('7. International Esports Federation Academy. https://academy.iesf.org/'),
      paragraph('8. Submitted project synopsis: AI Career Roadmap Generator Complete Synopsis, provided by the project authors.'),
      paragraph('References accessed or reviewed: September 2026.', { italics: true, color: gray }),
    ],
  }],
});

function constExisting() {
  return [
    heading('4.1 Existing System', HeadingLevel.HEADING_2),
    paragraph('In the existing informal learning process, learners commonly search for tutorials, courses, and job descriptions separately. Progress is often measured by completed videos or personal confidence, while the connection between a resource and a portfolio outcome remains unclear.'),
    ...['No single personalized sequence.', 'Difficulty comparing career options.', 'Limited accountability for practical work.', 'No consistent evidence standard.', 'Risk of generic advice being applied to specialized careers.'].map(bullet)
  ];
}

fs.writeFileSync(output, await Packer.toBuffer(doc));
console.log(output);
