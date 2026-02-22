/**
 * form.js — Add Paper form and JSON export
 */

/**
 * Render the Add Paper form.
 * @param {HTMLElement} container
 */
export function renderForm(container) {
    const html = `
    <div class="fade-in">
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-xl);">
        Fill in the paper details below, then generate the JSON to add to your <code>papers.json</code> file.
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

        <!-- Summary Sections -->
        <h3 style="margin: var(--space-xl) 0 var(--space-md);">Summary</h3>

        <div class="form-group">
          <label for="field-rq">Research Questions</label>
          <textarea id="field-rq" class="input" placeholder="What the paper investigates..."></textarea>
        </div>

        <div class="form-group">
          <label for="field-method">Methodology</label>
          <textarea id="field-method" class="input" placeholder="How the research was conducted..."></textarea>
        </div>

        <div class="form-group">
          <label for="field-discussion">Discussion</label>
          <textarea id="field-discussion" class="input" placeholder="Key findings and interpretations..."></textarea>
        </div>

        <div class="form-group">
          <label for="field-notes">Notes</label>
          <textarea id="field-notes" class="input" placeholder="Personal notes or takeaways..."></textarea>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
          <button type="submit" class="btn btn-primary">Generate JSON</button>
          <button type="button" id="btn-clear" class="btn btn-danger">Clear Form</button>
        </div>
      </form>

      <!-- JSON Output -->
      <div id="json-output-section" style="display: none; margin-top: var(--space-xl);">
        <h3 style="margin-bottom: var(--space-md);">Generated JSON</h3>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">
          Copy this and add it to the array in <code>data/papers.json</code>.
        </p>
        <div class="json-output">
          <div class="copy-overlay">
            <button id="btn-copy" class="btn" style="font-size: var(--font-size-xs); padding: 0.3rem 0.8rem;">
              📋 Copy
            </button>
          </div>
          <pre id="json-output" style="margin: 0; white-space: pre-wrap;"></pre>
        </div>
      </div>
    </div>`;

    container.innerHTML = html;

    // -- Wire up events --
    const form = document.getElementById('paper-form');
    const clearBtn = document.getElementById('btn-clear');
    const copyBtn = document.getElementById('btn-copy');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generateJSON();
    });

    clearBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('json-output-section').style.display = 'none';
    });

    copyBtn.addEventListener('click', () => {
        const json = document.getElementById('json-output').textContent;
        navigator.clipboard.writeText(json).then(() => {
            showToast('Copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy — please select and copy manually.');
        });
    });
}

/**
 * Generate JSON from form fields.
 */
function generateJSON() {
    const title = document.getElementById('field-title').value.trim();
    const authorsStr = document.getElementById('field-authors').value.trim();
    const year = parseInt(document.getElementById('field-year').value, 10);
    const tagsStr = document.getElementById('field-tags').value.trim();
    const url = document.getElementById('field-url').value.trim();
    const rq = document.getElementById('field-rq').value.trim();
    const method = document.getElementById('field-method').value.trim();
    const discussion = document.getElementById('field-discussion').value.trim();
    const notes = document.getElementById('field-notes').value.trim();

    // Validate required fields
    if (!title || !authorsStr || !year || !tagsStr) {
        showToast('Please fill in all required fields.');
        return;
    }

    // Validate at least one summary field
    if (!rq && !method && !discussion && !notes) {
        showToast('Please fill in at least one summary section.');
        return;
    }

    const authors = authorsStr.split(',').map(a => a.trim()).filter(Boolean);
    const tags = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    const id = slugify(title);
    const dateAdded = new Date().toISOString().split('T')[0];

    const paper = {
        id,
        title,
        authors,
        year,
        tags,
        ...(url && { url }),
        summary: {
            ...(rq && { researchQuestions: rq }),
            ...(method && { methodology: method }),
            ...(discussion && { discussion }),
            ...(notes && { notes })
        },
        dateAdded
    };

    const jsonStr = JSON.stringify(paper, null, 2);

    document.getElementById('json-output').textContent = jsonStr;
    document.getElementById('json-output-section').style.display = 'block';

    // Scroll to output
    document.getElementById('json-output-section').scrollIntoView({ behavior: 'smooth' });
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
 * Show a temporary toast notification.
 */
function showToast(message) {
    // Remove existing toast
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
