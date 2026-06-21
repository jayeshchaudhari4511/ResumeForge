/* ─────────────────────────────────────────────────────────────
   utils/downloadPdf.js
   Captures the #resume-paper DOM node with html2canvas,
   then wraps it in an A4 jsPDF document and triggers download.
───────────────────────────────────────────────────────────── */
import html2canvas from 'html2canvas'
import jsPDF       from 'jspdf'

/**
 * Capture the element with id="resume-paper" and save as PDF.
 *
 * @param {string} filename  - downloaded file name (default "resume.pdf")
 * @param {function} onStart - called right before capture begins
 * @param {function} onDone  - called after download triggers (success or error)
 */
export async function downloadResumePdf(
  filename = 'resume.pdf',
  onStart  = () => {},
  onDone   = () => {},
) {
  const element = document.getElementById('resume-paper')

  if (!element) {
    console.error('[downloadResumePdf] #resume-paper element not found.')
    onDone()
    return
  }

  try {
    onStart()

    /* ── 1. Capture the DOM node at 2× resolution for crisp PDF ── */
    const canvas = await html2canvas(element, {
      scale:           2,          // retina quality
      useCORS:         true,       // allow external fonts/images
      allowTaint:      true,
      backgroundColor: '#ffffff',  // force white background
      logging:         false,
      scrollX:         0,
      scrollY:         0,
      windowWidth:     element.scrollWidth,
      windowHeight:    element.scrollHeight,
    })

    /* ── 2. Calculate dimensions to fit A4 portrait ── */
    const A4_WIDTH_MM  = 210   // mm
    const A4_HEIGHT_MM = 297   // mm
    const PX_TO_MM     = 0.264583   // 1px = 0.264583 mm at 96dpi

    const imgWidthMM  = canvas.width  / 2 * PX_TO_MM   // divide by scale=2
    const imgHeightMM = canvas.height / 2 * PX_TO_MM

    // Scale image to fit A4 width, allow multi-page for tall resumes
    const ratio    = A4_WIDTH_MM / imgWidthMM
    const finalW   = A4_WIDTH_MM
    const finalH   = imgHeightMM * ratio

    /* ── 3. Build the PDF (add extra pages if resume is taller than A4) ── */
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit:        'mm',
      format:      'a4',
    })

    const imgData = canvas.toDataURL('image/png', 1.0)

    if (finalH <= A4_HEIGHT_MM) {
      // Fits on one page — center vertically
      pdf.addImage(imgData, 'PNG', 0, 0, finalW, finalH)
    } else {
      // Multi-page: slice canvas into A4-height segments
      const pageHeightPx = (A4_HEIGHT_MM / ratio) / PX_TO_MM * 2  // in canvas px (scale=2)
      let   renderedPx   = 0
      let   pageIndex    = 0

      while (renderedPx < canvas.height) {
        if (pageIndex > 0) pdf.addPage()

        // Slice canvas segment into a temp canvas
        const segH   = Math.min(pageHeightPx, canvas.height - renderedPx)
        const tmpCvs = document.createElement('canvas')
        tmpCvs.width  = canvas.width
        tmpCvs.height = segH
        tmpCvs.getContext('2d').drawImage(
          canvas,
          0, renderedPx,        // source x, y
          canvas.width, segH,   // source width, height
          0, 0,                 // dest x, y
          canvas.width, segH,   // dest width, height
        )

        const segData = tmpCvs.toDataURL('image/png', 1.0)
        const segHmm  = segH / 2 * PX_TO_MM * ratio

        pdf.addImage(segData, 'PNG', 0, 0, finalW, segHmm)
        renderedPx += segH
        pageIndex++
      }
    }

    /* ── 4. Trigger download ── */
    pdf.save(filename)
  } catch (err) {
    console.error('[downloadResumePdf] PDF generation failed:', err)
    alert('PDF generation failed. Please try again.')
  } finally {
    onDone()
  }
}
