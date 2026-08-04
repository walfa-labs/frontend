import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../app/utils/markdown'

describe('renderMarkdown', () => {
  it('returns an empty string for empty input', () => {
    expect(renderMarkdown('')).toBe('')
  })

  it('renders headings without a paragraph wrapper', () => {
    expect(renderMarkdown('# Hello')).toBe('<h1>Hello</h1>')
    expect(renderMarkdown('## Sub')).toBe('<h2>Sub</h2>')
    expect(renderMarkdown('### Third')).toBe('<h3>Third</h3>')
  })

  it('renders bold and italic inside paragraphs', () => {
    expect(renderMarkdown('**bold**')).toBe('<p><strong>bold</strong></p>')
    expect(renderMarkdown('*em*')).toBe('<p><em>em</em></p>')
  })

  it('renders inline code and fenced code blocks', () => {
    expect(renderMarkdown('`const a = 1`')).toBe('<p><code>const a = 1</code></p>')
    expect(renderMarkdown('```ts\nconst a = 1\n```')).toBe('<pre><code>const a = 1\n</code></pre>')
  })

  it('renders lists', () => {
    expect(renderMarkdown('- a\n- b')).toBe('<ul><li>a</li>\n<li>b</li></ul>')
  })

  it('escapes raw HTML instead of rendering it', () => {
    const html = renderMarkdown('<b>hi</b>')
    expect(html).toContain('&lt;b&gt;')
    expect(html).not.toContain('<b>')
  })

  it('allows http(s), mailto and root-relative links', () => {
    expect(renderMarkdown('[site](https://example.com)')).toContain('href="https://example.com"')
    expect(renderMarkdown('[mail](mailto:a@b.c)')).toContain('href="mailto:a@b.c"')
    expect(renderMarkdown('[home](/about)')).toContain('href="/about"')
  })

  it('sanitizes disallowed link schemes to "#"', () => {
    const html = renderMarkdown('[click](javascript:evil)')
    expect(html).toContain('href="#"')
    expect(html).not.toContain('javascript:')
  })

  it('adds rel="noopener noreferrer" to links', () => {
    expect(renderMarkdown('[site](https://example.com)')).toContain('rel="noopener noreferrer"')
  })
})
