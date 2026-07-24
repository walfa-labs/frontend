// Shared markdown → HTML renderer used by both the editor preview and
// the public ContentMarkdownView component. Kept in sync by being one function.

const ALLOWED_SCHEMES = ['http://', 'https://', 'mailto:', '/']

function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  if (ALLOWED_SCHEMES.some(s => trimmed.startsWith(s))) {
    return trimmed
  }
  return '#'
}

export function renderMarkdown(md: string): string {
  if (!md) return ''
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // Links — sanitize URL scheme
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text: string, url: string) =>
    `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`)
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>')
  html = `<p>${html}</p>`
  html = html.replace(/<p><\/p>/g, '')
  html = html.replace(/<p>(<(?:h[123]|ul|ol|pre|blockquote))/g, '$1')
  html = html.replace(/(<\/(?:h[123]|ul|ol|pre|blockquote)>)<\/p>/g, '$1')
  return html
}
