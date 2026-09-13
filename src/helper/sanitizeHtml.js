import DOMPurify from 'dompurify'

const PREVIEW_SANITIZE_OPTIONS = {
  // Preserve legitimate embedded media while forbidding srcdoc, which can
  // contain an entire executable HTML document.
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  FORBID_ATTR: ['srcdoc'],
}

export const sanitizePreviewHtml = (html) =>
  DOMPurify.sanitize(html == null ? '' : String(html), PREVIEW_SANITIZE_OPTIONS)
