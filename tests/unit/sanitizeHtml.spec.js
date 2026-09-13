import { sanitizePreviewHtml } from '@/helper/sanitizeHtml'

describe('Vditor preview HTML sanitization', () => {
  it('blocks javascript form actions', () => {
    const result = sanitizePreviewHtml('<form action="javascript:alert(1)"><button>x</button></form>')
    expect(result.toLowerCase()).not.toContain('javascript:')
  })

  it('blocks javascript SVG xlink href values', () => {
    const result = sanitizePreviewHtml(
      '<svg xmlns="http://www.w3.org/2000/svg"><a xlink:href="javascript:alert(1)"><text>x</text></a></svg>',
    )
    expect(result.toLowerCase()).not.toContain('javascript:')
  })

  it('removes iframe srcdoc but preserves a safe iframe source', () => {
    const result = sanitizePreviewHtml(
      '<iframe src="https://www.youtube.com/embed/demo" srcdoc="<img src=x onerror=alert(1)>"></iframe>',
    )
    expect(result).toContain('<iframe')
    expect(result).toContain('https://www.youtube.com/embed/demo')
    expect(result.toLowerCase()).not.toContain('srcdoc')
    expect(result.toLowerCase()).not.toContain('onerror')
  })

  it('removes ordinary event-handler attributes', () => {
    const result = sanitizePreviewHtml('<img src="https://example.com/a.png" onerror="alert(1)">')
    expect(result.toLowerCase()).not.toContain('onerror')
    expect(result).toContain('https://example.com/a.png')
  })
})
