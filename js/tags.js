/**
 * tags.js — Tag statistics and visualisation dashboard
 */

import { loadPapers, getAllTags } from './data.js';
import { escapeHtml, showLoading } from './utils.js';

let chartInstances = [];

const BASE_TOOLTIP = {
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  titleFont: { family: 'Inter', size: 13, weight: '600' },
  bodyFont: { family: 'Inter', size: 12 },
  cornerRadius: 8,
  padding: 12,
};

/**
 * Destroy all previous chart instances.
 */
function destroyCharts() {
  chartInstances.forEach(c => c.destroy());
  chartInstances = [];
}

/**
 * Render the tags statistics dashboard.
 * @param {HTMLElement} container
 */
export async function renderTags(container) {
  showLoading(container);
  const papers = await loadPapers();
  const tagMap = await getAllTags();
  const totalPapers = papers.length;
  const totalTags = tagMap.size;

  // Sort tags by count descending
  const sortedTags = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);

  if (totalPapers === 0) {
    container.innerHTML = '<p class="empty-state">No papers found.</p>';
    return;
  }

  // Year stats
  const years = papers.map(p => p.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // Average tags per paper
  const avgTags = (papers.reduce((sum, p) => sum + p.tags.length, 0) / totalPapers).toFixed(1);

  // Papers per year
  const yearCounts = {};
  papers.forEach(p => { yearCounts[p.year] = (yearCounts[p.year] || 0) + 1; });
  const allYears = [];
  for (let y = minYear; y <= maxYear; y++) allYears.push(y);

  // Top 3 tags
  const top3 = sortedTags.slice(0, 3);

  // Tag co-occurrence (which tags appear together most often)
  const cooccurrence = {};
  papers.forEach(p => {
    for (let i = 0; i < p.tags.length; i++) {
      for (let j = i + 1; j < p.tags.length; j++) {
        const key = [p.tags[i], p.tags[j]].sort().join(' + ');
        cooccurrence[key] = (cooccurrence[key] || 0) + 1;
      }
    }
  });
  const topPairs = Object.entries(cooccurrence)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  let html = `
    <div class="fade-in">
      <!-- Hero Stats Row -->
      <div class="stats-grid">
        <div class="stat-card stat-card--accent">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
          <div class="stat-value">${totalPapers}</div>
          <div class="stat-label">Papers</div>
        </div>
        <div class="stat-card stat-card--blue">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></div>
          <div class="stat-value">${totalTags}</div>
          <div class="stat-label">Unique Tags</div>
        </div>
        <div class="stat-card stat-card--teal">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
          <div class="stat-value">${avgTags}</div>
          <div class="stat-label">Avg Tags / Paper</div>
        </div>
        <div class="stat-card stat-card--purple">
          <div class="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div class="stat-value">${minYear}–${maxYear}</div>
          <div class="stat-label">Year Range</div>
        </div>
      </div>

      <!-- Two-column layout: Timeline + Top Tags -->
      <div class="dashboard-row">
        <div class="dashboard-panel dashboard-panel--wide">
          <h3 class="panel-title"><svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Papers by Year</h3>
          <div class="chart-container chart-container--timeline">
            <canvas id="timeline-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-panel">
          <h3 class="panel-title"><svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> Top Tags</h3>
          <div class="top-tags-list">
            ${top3.map(([tag, count], i) => {
    const pct = Math.round((count / totalPapers) * 100);
    return `
                <a href="#papers?tag=${encodeURIComponent(tag)}" class="top-tag-item">
                  <span class="top-tag-rank">${i + 1}</span>
                  <div class="top-tag-info">
                    <span class="top-tag-name">${escapeHtml(tag)}</span>
                    <div class="top-tag-bar-track">
                      <div class="top-tag-bar-fill" style="width: ${pct}%"></div>
                    </div>
                  </div>
                  <span class="top-tag-count">${count} <span class="top-tag-pct">(${pct}%)</span></span>
                </a>`;
  }).join('')}
          </div>
        </div>
      </div>

      <!-- Tag Distribution (full width) -->
      <div class="dashboard-panel">
        <h3 class="panel-title"><svg class="panel-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Tag Distribution</h3>
        <div class="chart-container chart-container--bar">
          <canvas id="tags-chart"></canvas>
        </div>
      </div>
    </div>`;


  container.innerHTML = html;
  destroyCharts();
  renderTimelineChart(allYears, yearCounts);
  renderBarChart(sortedTags);
}

/**
 * Render the papers-by-year timeline chart.
 */
function renderTimelineChart(allYears, yearCounts) {
  const canvas = document.getElementById('timeline-chart');
  if (!canvas) return;

  const data = allYears.map(y => yearCounts[y] || 0);

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.parentElement.clientHeight || 200);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: allYears.map(String),
      datasets: [{
        label: 'Papers',
        data,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...BASE_TOOLTIP,
          callbacks: {
            label: ctx => `${ctx.parsed.y} paper${ctx.parsed.y !== 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 12 }, color: '#6b7280' }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: { family: 'Inter', size: 11 },
            color: '#9ca3af'
          },
          grid: { color: 'rgba(0, 0, 0, 0.04)' }
        }
      }
    }
  });
  chartInstances.push(chart);
}

/**
 * Render the tag distribution bar chart.
 */
function renderBarChart(sortedTags) {
  const canvas = document.getElementById('tags-chart');
  if (!canvas) return;

  const labels = sortedTags.map(([tag]) => tag);
  const data = sortedTags.map(([, count]) => count);

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Papers',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.65)',
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 24
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      onClick: (_event, elements) => {
        if (elements.length > 0) {
          const tag = labels[elements[0].index];
          window.location.hash = `#papers?tag=${encodeURIComponent(tag)}`;
        }
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...BASE_TOOLTIP,
          callbacks: {
            label: ctx => `${ctx.parsed.x} paper${ctx.parsed.x !== 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: { family: 'Inter', size: 11 },
            color: '#9ca3af'
          },
          grid: { color: 'rgba(0, 0, 0, 0.04)' }
        },
        y: {
          ticks: {
            font: { family: 'Inter', size: 12, weight: '500' },
            color: 'rgb(99, 102, 241)'
          },
          grid: { display: false }
        }
      }
    }
  });
  chartInstances.push(chart);
}

