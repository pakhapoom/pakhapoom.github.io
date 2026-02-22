/**
 * form.js — Add Paper form, JSON + Markdown template export
 */

const MARKDOWN_TEMPLATE = `## Research Questions

What the paper investigates...

## Methodology

How the research was conducted...

## Discussion

Key findings and interpretations...

## Notes

Personal notes or takeaways...
`;

/**
 * Render the Add Paper form.
 * @param {HTMLElement} container
 */
export function renderForm(container) {
  const html = `
    <div class="fade-in">
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-xl);">
        Fill in the paper details below. This will generate two things:<br>
        1. A <strong>JSON entry</strong> to add to <code>data/papers.json</code><br>
        2. A <strong>Markdown template</strong> to save as <code>papers/&lt;id&gt;.md</code>
      </p>

      <form id="paper-form" autocomplete="off">
        <!-- Title -->
        <div class="form-group">
          <label for="field-title">Title *</label>
          <input type="text" id="field-title" class="input" placeholder="e.g. Attention Is All You Need" required>
        </div>

        <!-- Authors & Year -->
        <div class="form-row">
          <div class="form-group">
            <label for="field-authors">Authors *</label>
            <div class="hint">Comma-separated</div>
            <input type="text" id="field-authors" class="input" placeholder="e.g. Vaswani, Shazeer, Parmar" required>
          </div>
          <div class="form-group">
            <label for="field-year">Year *</label>
            <input type="number" id="field-year" class="input" placeholder="e.g. 2017" min="1900" max="2099" required>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-group">
          <label for="field-tags">Tags *</label>
          <div class="hint">Comma-separated, lowercase</div>
          <input type="text" id="field-tags" class="input" placeholder="e.g. transformer, attention, nlp" required>
        </div>

        <!-- URL -->
        <div class="form-group">
          <label for="field-url">Paper URL</label>
          <input type="url" id="field-url" class="input" placeholder="e.g. https://arxiv.org/abs/1706.03762">
        </div>

        <!-- Markdown Summary -->
        <h3 style="margin: var(--space-xl) 0 var(--space-sm);">Summary (Markdown)</h3>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-xs); margin-bottom: var(--space-sm);">
          Write your summary in Markdown. You can use any structure — the template below is just a suggestion.
          Reference images with <code>![alt](../assets/&lt;paper-id&gt;/image.png)</code>.
        </p>

        <div class="form-group">
          <textarea id="field-markdown" class="input" style="min-height: 280px; font-family: 'SF Mono', 'Fira Code', monospace; font-size: var(--font-size-xs); line-height: 1.5;">${escapeHtmlAttr(MARKDOWN_TEMPLATE)}</textarea>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
          <button type="submit" class="btn btn-primary">Generate</button>
          <button type="button" id="btn-clear" class="btn btn-danger">Clear Form</button>
        </div>
      </form>

      <!-- Output -->
      <div id="output-section" style="display: none; margin-top: var(--space-xl);">
        <!-- JSON Output -->
        <h3 style="margin-bottom: var(--space-sm);">1. JSON Entry</h3>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-xs); margin-bottom: var(--space-sm);">
          Add this to the array in <code>data/papers.json</code>
        </p>
        <div class="json-output">
          <div class="copy-overlay">
            <button id="btn-copy-json" class="btn" style="font-size: var(--font-size-xs); padding: 0.3rem 0.8rem;">
              📋 Copy
            </button>
          </div>
          <pre id="json-output" style="margin: 0; white-space: pre-wrap;"></pre>
        </div>

        <!-- Markdown Output -->
        <h3 style="margin-top: var(--space-xl); margin-bottom: var(--space-sm);">2. Markdown File</h3>
        <p id="md-file-path" style="color: var(--color-text-secondary); font-size: var(--font-size-xs); margin-bottom: var(--space-sm);"></p>
        <div class="json-output">
          <div class="copy-overlay">
            <button id="btn-copy-md" class="btn" style="font-size: var(--font-size-xs); padding: 0.3rem 0.8rem;">
              📋 Copy
            </button>
          </div>
          <pre id="md-output" style="margin: 0; white-space: pre-wrap;"></pre>
        </div>
      </div>
    </div>`;

  container.innerHTML = html;

  // -- Wire up events --
  const form = document.getElementById('paper-form');
  const clearBtn = document.getElementById('btn-clear');
  const copyJsonBtn = document.getElementById('btn-copy-json');
  const copyMdBtn = document.getElementById('btn-copy-md');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateOutput();
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    document.getElementById('field-markdown').value = MARKDOWN_TEMPLATE;
    document.getElementById('output-section').style.display = 'none';
  });

  copyJsonBtn.addEventListener('click', () => {
    const json = document.getElementById('json-output').textContent;
    copyToClipboard(json);
  });

  copyMdBtn.addEventListener('click', () => {
    const md = document.getElementById('md-output').textContent;
    copyToClipboard(md);
  });
}

/**
 * Generate JSON entry and markdown template from form fields.
 */
function generateOutput() {
  const title = document.getElementById('field-title').value.trim();
  const authorsStr = document.getElementById('field-authors').value.trim();
  const year = parseInt(document.getElementById('field-year').value, 10);
  const tagsStr = document.getElementById('field-tags').value.trim();
  const url = document.getElementById('field-url').value.trim();
  const markdown = document.getElementById('field-markdown').value;

  // Validate required fields
  if (!title || !authorsStr || !year || !tagsStr) {
    showToast('Please fill in all required fields.');
    return;
  }

  if (!markdown.trim()) {
    showToast('Please write at least some summary content.');
    return;
  }

  const authors = authorsStr.split(',').map(a => a.trim()).filter(Boolean);
  const tags = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  const id = slugify(title);
  const dateAdded = new Date().toISOString().split('T')[0];
  const summaryFile = `papers/${id}.md`;

  const paper = {
    id,
    title,
    authors,
    year,
    tags,
    ...(url && { url }),
    summaryFile,
    dateAdded
  };

  const jsonStr = JSON.stringify(paper, null, 2);

  document.getElementById('json-output').textContent = jsonStr;
  document.getElementById('md-output').textContent = markdown;
  document.getElementById('md-file-path').textContent = `Save this as ${summaryFile}`;
  document.getElementById('output-section').style.display = 'block';

  // Scroll to output
  document.getElementById('output-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Convert a title to a URL-friendly slug.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Copy text to clipboard with toast feedback.
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy — please select and copy manually.');
  });
}

/**
 * Escape HTML for use in attribute values (textarea default).
 */
function escapeHtmlAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Show a temporary toast notification.
 */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast success';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    toast.style.transition = 'all 300ms ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
