/**
 * Export resume preview directly as a clean, high-resolution A4 PDF
 */
export async function downloadResumePDF(resume, template = 'modern') {
  const element = document.getElementById('devtrack-resume-pdf-target');
  if (!element) {
    throw new Error('Resume preview target element not found in DOM.');
  }

  const html2pdfModule = await import('html2pdf.js');
  const html2pdf = html2pdfModule.default || html2pdfModule;

  const rawName = (resume?.personal?.name || 'Developer').trim();
  const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_DevTrack_Resume.pdf`;

  const opt = {
    margin: [8, 8, 8, 8],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return { success: true, filename };
  } catch (err) {
    console.error('PDF export failed:', err);
    throw err;
  }
}
