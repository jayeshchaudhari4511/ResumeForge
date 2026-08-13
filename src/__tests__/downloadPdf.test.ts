import { describe, it, expect, vi, beforeEach } from 'vitest'
import { downloadResumePdf } from '../utils/downloadPdf'

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    width: 800,
    height: 1000,
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,fake'),
  }),
}))

vi.mock('jspdf', () => {
  const saveMock = vi.fn()
  const addImageMock = vi.fn()
  const addPageMock = vi.fn()
  return {
    default: vi.fn().mockImplementation(() => ({
      save: saveMock,
      addImage: addImageMock,
      addPage: addPageMock,
    })),
  }
})

describe('downloadResumePdf utility', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('calls onDone immediately if #resume-paper element is missing', async () => {
    const onDone = vi.fn()
    const onStart = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await downloadResumePdf('test.pdf', onStart, onDone)

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('#resume-paper element not found'))
    expect(onStart).not.toHaveBeenCalled()
    expect(onDone).toHaveBeenCalledOnce()
  })

  it('executes PDF generation flow when #resume-paper element exists', async () => {
    const paper = document.createElement('div')
    paper.id = 'resume-paper'
    document.body.appendChild(paper)

    const onStart = vi.fn()
    const onDone = vi.fn()

    await downloadResumePdf('my-resume.pdf', onStart, onDone)

    expect(onStart).toHaveBeenCalledOnce()
    expect(onDone).toHaveBeenCalledOnce()
  })
})
