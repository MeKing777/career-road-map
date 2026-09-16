// src/utils/exportDocuments.js
// Builds a proper, comprehensive, and readable PDF and Word (.docx) export of the career roadmap.
// Includes Career Overview, Required Skills, Stage Roadmap, Career Tasks, Projects, Recommendations,
// Real-World Experience & Internships, Task Verification Evidence Records, Weekly Schedule, Daily Scans,
// and Recommended Courses.
// PDF uses jspdf + jspdf-autotable. Word uses the `docx` package.
// Both run fully client-side (no backend / API keys required).

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow,
  TableCell, WidthType, ShadingType, PageBreak
} from 'docx';

// --- shared helpers ---

const ACCENT = [99, 102, 241];    // indigo  (--accent-primary)
const ACCENT_2 = [168, 85, 247];  // purple  (--accent-secondary)
const ACCENT_HEX = '6366F1';
const ACCENT_2_HEX = 'A855F7';
const MUTED = [110, 118, 140];

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function safeFileBase(formData) {
  return (formData?.goal || 'Career').trim().replace(/\s+/g, '_').replace(/[^\w-]/g, '');
}

function fmtDate(d) {
  try {
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d;
  }
}

function statusLabel(status) {
  if (status === 'on_track' || status === 'verified') return 'Verified ✅';
  if (status === 'partial') return 'Partial Gaps ⚠️';
  if (status === 'off_track' || status === 'needs_revision') return 'Needs Revision ❌';
  return status || 'Pending';
}

// ==========================================================================
// PDF EXPORT
// ==========================================================================

export function exportRoadmapAsPDF(formData, roadmapData, completedTasks, completedPhases, dailyLogs = [], courses = null, verifiedSubmissions = {}) {
  if (!roadmapData) return;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const sectionTitle = (text) => {
    ensureSpace(40);
    doc.setFillColor(...ACCENT);
    doc.rect(margin, y, 4, 18, 'F');
    doc.setTextColor(20, 20, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(text, margin + 12, y + 14);
    y += 30;
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'normal');
  };

  const bulletList = (items, opts = {}) => {
    doc.setFontSize(10);
    const indent = opts.indent || 14;
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`•  ${item}`, pageWidth - margin * 2 - indent);
      ensureSpace(lines.length * 13 + 4);
      doc.text(lines, margin + indent, y);
      y += lines.length * 13 + 2;
    });
  };

  const paragraph = (text, opts = {}) => {
    doc.setFontSize(opts.size || 10.5);
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    ensureSpace(lines.length * 14 + 6);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 6;
    doc.setFont('helvetica', 'normal');
  };

  // ---------- 1. TITLE PAGE / HEADER ----------
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageWidth, 110, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Career Roadmap & Portfolio Report', margin, 45);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text(`${formData.name || 'Learner'} → ${formData.goal || 'Career Goal'}`, margin, 68);
  doc.setFontSize(10);
  doc.text(`Timeline: ${formData.timeline || '-'}  |  Location: ${formData.nationality || '-'}  |  Generated: ${fmtDate(new Date())}`, margin, 88);

  y = 130;
  doc.setTextColor(40, 40, 40);

  // ---------- 2. SUMMARY & CAREER OVERVIEW ----------
  sectionTitle('Career Overview & Salary Projections');
  const overview = roadmapData.careerOverview;
  if (overview) {
    if (overview.desc) paragraph(overview.desc, { bold: true });
    if (overview.whatProfessionalDoes) paragraph(`What Professional Does: ${overview.whatProfessionalDoes}`);
    if (overview.whereUsed) paragraph(`Where Used: ${overview.whereUsed}`);
  }

  const summaryRows = [
    ['Total Hours Required', String(roadmapData.totalHoursRequired ?? 1200)],
    ['Weekly Commitment', `${roadmapData.hoursPerWeek ?? 10} hours / week`],
    ['Estimated Salary Range', String(roadmapData.estimatedSalary ?? '-')],
    ['Market Outlook', String(roadmapData.marketOutlook ?? '-')],
  ];
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: summaryRows,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold', textColor: [60, 60, 60], cellWidth: 170 } },
  });
  y = doc.lastAutoTable.finalY + 15;

  // ---------- 3. REQUIRED SKILLS & TECHNOLOGIES ----------
  ensureSpace(60);
  sectionTitle('Required Skills & Technologies');
  if (roadmapData.technologies?.length) {
    paragraph(`Technologies & Tools: ${roadmapData.technologies.join(' • ')}`);
  }

  const reqSkills = roadmapData.requiredSkills;
  if (reqSkills) {
    if (reqSkills.beginner?.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('Beginner Skills', margin, y); y += 14;
      bulletList(reqSkills.beginner);
    }
    if (reqSkills.intermediate?.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('Intermediate Skills', margin, y); y += 14;
      bulletList(reqSkills.intermediate);
    }
    if (reqSkills.advanced?.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('Advanced Skills', margin, y); y += 14;
      bulletList(reqSkills.advanced);
    }
  }

  // ---------- 4. LEARNING ROADMAP & VERIFIED TASKS ----------
  doc.addPage();
  y = margin;
  sectionTitle('Learning Stages & Practical Tasks');
  (roadmapData.macro || []).forEach((phase) => {
    ensureSpace(40);
    const done = !!completedPhases?.[phase.id];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...ACCENT_2);
    doc.text(`${phase.title}`, margin, y);
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(`${phase.timeframe}   ${done ? '\u2714 Stage Completed' : '\u25CB In Progress'}`, margin, y + 13);
    y += 26;
    doc.setTextColor(40, 40, 40);

    if (phase.desc) paragraph(phase.desc);

    if (phase.objectives?.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      ensureSpace(14); doc.text('Topics & Prerequisite Building:', margin, y); y += 14;
      bulletList(phase.objectives);
    }
  });

  // Tasks Evidence Table
  if (roadmapData.tasks?.length) {
    ensureSpace(60);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text('Practical Tasks & Verification Status:', margin, y); y += 14;

    const taskRows = roadmapData.tasks.map((task) => {
      const vData = verifiedSubmissions[task.id];
      const isVerified = vData && vData.status === 'verified';
      return [
        task.stage || 'General',
        task.title,
        task.difficulty || 'Medium',
        isVerified ? 'Verified ✅' : (completedTasks[task.id] ? 'Self-Reported' : 'Pending')
      ];
    });

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Stage', 'Task Title', 'Difficulty', 'Verification']],
      body: taskRows,
      theme: 'striped',
      headStyles: { fillColor: ACCENT, textColor: 255, fontSize: 9.5 },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 75 }, 1: { cellWidth: 230, fontStyle: 'bold' }, 3: { cellWidth: 85, halign: 'center' } }
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  // ---------- 5. REAL-WORLD EXPERIENCE & INTERNSHIPS ----------
  if (roadmapData.realWorldExperience?.length) {
    doc.addPage();
    y = margin;
    sectionTitle('Real-World Experience & Internships');
    paragraph(`Target Location: ${formData.nationality || 'Global'}  |  Required for Job Ready Status`, { bold: true });

    const expRows = roadmapData.realWorldExperience.map(exp => [
      exp.type || 'Experience',
      exp.title,
      exp.description || '',
      (exp.platforms || []).join(', ')
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Type', 'Opportunity Title', 'Description', 'Platforms / Networks']],
      body: expRows,
      theme: 'striped',
      headStyles: { fillColor: ACCENT_2, textColor: 255, fontSize: 9.5 },
      styles: { fontSize: 8.5, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 85, fontStyle: 'bold' }, 1: { cellWidth: 140, fontStyle: 'bold' } }
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  // ---------- 6. CAREER PROJECTS & RECOMMENDATIONS ----------
  if (roadmapData.projects?.length || roadmapData.recommendations) {
    ensureSpace(60);
    sectionTitle('Projects Showcase & Recommendations');

    if (roadmapData.projects?.length) {
      const projRows = roadmapData.projects.map(p => [
        p.level || 'Project',
        p.title,
        (p.technologies || []).join(', '),
        p.description || ''
      ]);

      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [['Level', 'Project Title', 'Technologies', 'Description']],
        body: projRows,
        theme: 'striped',
        headStyles: { fillColor: ACCENT, textColor: 255, fontSize: 9.5 },
        styles: { fontSize: 8.5, cellPadding: 5 },
        columnStyles: { 0: { cellWidth: 75, fontStyle: 'bold' }, 1: { cellWidth: 125, fontStyle: 'bold' } }
      });
      y = doc.lastAutoTable.finalY + 20;
    }

    const recs = roadmapData.recommendations;
    if (recs) {
      if (recs.certifications?.length) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('Certifications:', margin, y); y += 14;
        bulletList(recs.certifications);
      }
      if (recs.nextCareerStep) {
        paragraph(`Next Career Step: ${recs.nextCareerStep}`, { bold: true });
      }
    }
  }

  // ---------- 7. WEEKLY PLAN & DAILY SCAN HISTORY ----------
  doc.addPage();
  y = margin;
  sectionTitle('Weekly Schedule & Accountability');
  const weeklyRows = [];
  (roadmapData.micro || []).forEach((dayPlan, dIdx) => {
    if (!dayPlan.active) {
      weeklyRows.push([dayPlan.day, '-', '-', dayPlan.tasks?.[0] || 'Rest Day']);
      return;
    }
    dayPlan.tasks.forEach((task, tIdx) => {
      const done = !!completedTasks?.[`${dIdx}-${tIdx}`];
      weeklyRows.push([
        tIdx === 0 ? dayPlan.day : '',
        tIdx === 0 ? `${dayPlan.hoursAllocated}h (${dayPlan.timePref})` : '',
        done ? '\u2714' : '\u25CB',
        task,
      ]);
    });
  });
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Day', 'Allocation', 'Done', 'Task']],
    body: weeklyRows,
    theme: 'striped',
    headStyles: { fillColor: ACCENT, textColor: 255, fontSize: 9.5 },
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: { 0: { cellWidth: 65, fontStyle: 'bold' }, 1: { cellWidth: 90 }, 2: { cellWidth: 35, halign: 'center' } },
  });
  y = doc.lastAutoTable.finalY + 20;

  if (dailyLogs?.length) {
    ensureSpace(60);
    sectionTitle('Daily AI Accountability Logs');
    const logRows = dailyLogs.map((log) => [
      fmtDate(log.date), log.day || '', statusLabel(log.status), log.feedback || log.note || ''
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Date', 'Day', 'Status', 'Feedback Summary']],
      body: logRows,
      theme: 'striped',
      headStyles: { fillColor: ACCENT_2, textColor: 255, fontSize: 9.5 },
      styles: { fontSize: 8.5, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 75 }, 1: { cellWidth: 60 }, 2: { cellWidth: 75 } },
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  // ---------- 8. RECOMMENDED COURSES ----------
  const courseList = courses || roadmapData.courses;
  if (courseList?.length) {
    ensureSpace(60);
    sectionTitle('Recommended Courses');
    const courseRows = courseList.map(c => [
      c.title, c.platform || 'Online', c.type === 'free' ? 'Free' : (c.price || 'Paid'), c.level || 'All Levels', c.whyRequired || ''
    ]);
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['Course Title', 'Platform', 'Cost', 'Level', 'Why Required']],
      body: courseRows,
      theme: 'striped',
      headStyles: { fillColor: ACCENT, textColor: 255, fontSize: 9 },
      styles: { fontSize: 8.5, cellPadding: 5 },
      columnStyles: { 0: { cellWidth: 130, fontStyle: 'bold' }, 1: { cellWidth: 85 }, 2: { cellWidth: 45 }, 3: { cellWidth: 65 } }
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  // ---------- footer page numbers ----------
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 50, pageHeight - 20);
  }

  doc.save(`${safeFileBase(formData)}_Roadmap.pdf`);
}

// ==========================================================================
// WORD (.docx) EXPORT
// ==========================================================================

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, color: ACCENT_HEX, bold: true })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, color: ACCENT_2_HEX, bold: true })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, italics: !!opts.italics, bold: !!opts.bold })],
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: opts.header ? { type: ShadingType.CLEAR, fill: ACCENT_HEX } : undefined,
    children: [new Paragraph({
      children: [new TextRun({ text: String(text ?? ''), bold: !!opts.header, color: opts.header ? 'FFFFFF' : undefined })],
    })],
  });
}

export async function exportRoadmapAsWord(formData, roadmapData, completedTasks, completedPhases, dailyLogs = [], courses = null, verifiedSubmissions = {}) {
  if (!roadmapData) return;

  const children = [];

  // 1. Title page / header
  children.push(new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text: 'Career Roadmap & Portfolio Report', bold: true, size: 48, color: ACCENT_HEX })],
  }));
  children.push(new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: `${formData.name || 'Learner'} → ${formData.goal || 'Career Goal'}`, size: 28, bold: true })],
  }));
  children.push(new Paragraph({
    spacing: { after: 300 },
    children: [new TextRun({
      text: `Target Timeline: ${formData.timeline || '-'}   |   Location: ${formData.nationality || '-'}   |   Generated: ${fmtDate(new Date())}`,
      size: 20, color: '6E768C',
    })],
  }));

  // 2. Summary & Overview
  children.push(heading1('Career Overview & Outlook'));
  const overview = roadmapData.careerOverview;
  if (overview) {
    if (overview.desc) children.push(body(overview.desc, { bold: true }));
    if (overview.whatProfessionalDoes) children.push(body(`What Professional Does: ${overview.whatProfessionalDoes}`));
    if (overview.whereUsed) children.push(body(`Where Used: ${overview.whereUsed}`));
  }

  const summaryTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [cell('Total Hours Required', { width: 40 }), cell(roadmapData.totalHoursRequired ?? 1200)] }),
      new TableRow({ children: [cell('Weekly Commitment', { width: 40 }), cell(`${roadmapData.hoursPerWeek ?? 10} hours / week`)] }),
      new TableRow({ children: [cell('Estimated Salary Range', { width: 40 }), cell(roadmapData.estimatedSalary ?? '-')] }),
      new TableRow({ children: [cell('Market Outlook', { width: 40 }), cell(roadmapData.marketOutlook ?? '-')] }),
    ],
  });
  children.push(summaryTable);

  // 3. Required Skills
  children.push(heading1('Required Skills & Technologies'));
  if (roadmapData.technologies?.length) {
    children.push(body(`Technologies & Tools: ${roadmapData.technologies.join(', ')}`, { bold: true }));
  }

  // 4. Learning Stages & Tasks
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(heading1('Learning Stages & Practical Tasks'));
  (roadmapData.macro || []).forEach((phase) => {
    const done = !!completedPhases?.[phase.id];
    children.push(heading2(`${phase.title} ${done ? '(✔ Completed)' : '(○ In Progress)'}`));
    if (phase.desc) children.push(body(phase.desc));
  });

  if (roadmapData.tasks?.length) {
    children.push(heading2('Practical Tasks & Verification Status'));
    const taskRows = [
      new TableRow({
        children: [
          cell('Stage', { header: true, width: 20 }),
          cell('Task Title', { header: true, width: 45 }),
          cell('Difficulty', { header: true, width: 15 }),
          cell('Verification', { header: true, width: 20 }),
        ],
      }),
    ];
    roadmapData.tasks.forEach(task => {
      const vData = verifiedSubmissions[task.id];
      const isVerified = vData && vData.status === 'verified';
      taskRows.push(new TableRow({
        children: [
          cell(task.stage || 'General'),
          cell(task.title),
          cell(task.difficulty || 'Medium'),
          cell(isVerified ? 'Verified ✅' : (completedTasks[task.id] ? 'Self-Reported' : 'Pending')),
        ],
      }));
    });
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: taskRows }));
  }

  // 5. Real-World Experience & Internships
  if (roadmapData.realWorldExperience?.length) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(heading1('Real-World Experience & Internships'));
    children.push(body(`Target Location: ${formData.nationality || 'Global'} (Required for Stage 4 Job Ready Status)`, { italics: true }));
    
    const expRows = [
      new TableRow({
        children: [
          cell('Type', { header: true, width: 20 }),
          cell('Opportunity Title', { header: true, width: 35 }),
          cell('Description', { header: true, width: 45 }),
        ],
      }),
    ];
    roadmapData.realWorldExperience.forEach(exp => {
      expRows.push(new TableRow({
        children: [
          cell(exp.type || 'Experience'),
          cell(exp.title),
          cell(exp.description || ''),
        ],
      }));
    });
    children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: expRows }));
  }

  // 6. Projects & Recommendations
  if (roadmapData.projects?.length) {
    children.push(heading1('Career Projects Showcase'));
    roadmapData.projects.forEach(p => {
      children.push(heading2(`[${p.level || 'Project'}] ${p.title}`));
      if (p.description) children.push(body(p.description));
    });
  }

  // 7. Weekly Plan
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(heading1('Weekly Schedule'));
  const weeklyRows = [
    new TableRow({
      children: [cell('Day', { header: true, width: 20 }), cell('Allocation', { header: true, width: 25 }), cell('Done', { header: true, width: 10 }), cell('Task', { header: true, width: 45 })],
    }),
  ];
  (roadmapData.micro || []).forEach((dayPlan, dIdx) => {
    if (!dayPlan.active) {
      weeklyRows.push(new TableRow({ children: [cell(dayPlan.day), cell('-'), cell('-'), cell(dayPlan.tasks?.[0] || 'Rest Day')] }));
      return;
    }
    dayPlan.tasks.forEach((task, tIdx) => {
      const doneMark = completedTasks?.[`${dIdx}-${tIdx}`] ? '✔' : '○';
      weeklyRows.push(new TableRow({
        children: [
          cell(tIdx === 0 ? dayPlan.day : ''),
          cell(tIdx === 0 ? `${dayPlan.hoursAllocated}h (${dayPlan.timePref})` : ''),
          cell(doneMark),
          cell(task),
        ],
      }));
    });
  });
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: weeklyRows }));

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${safeFileBase(formData)}_Roadmap.docx`);
}
