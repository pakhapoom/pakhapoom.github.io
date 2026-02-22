/**
 * tags.js — Tag statistics and visualisation dashboard
 */

import { loadPapers, getAllTags } from './data.js';

let chartInstances = [];

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
  const papers = await loadPapers();
  const tagMap = await getAllTags();
  const totalPapers = papers.length;
  const totalTags = tagMap.size;

  // Sort tags by count descending
  const sortedTags = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);

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
          <div class="stat-icon">📄</div>
          <div class="stat-value">${totalPapers}</div>
          <div class="stat-label">Papers</div>
        </div>
        <div class="stat-card stat-card--blue">
          <div class="stat-icon">🏷️</div>
          <div class="stat-value">${totalTags}</div>
          <div class="stat-label">Unique Tags</div>
        </div>
        <div class="stat-card stat-card--teal">
          <div class="stat-icon">📊</div>
          <div class="stat-value">${avgTags}</div>
          <div class="stat-label">Avg Tags / Paper</div>
        </div>
        <div class="stat-card stat-card--purple">
          <div class="stat-icon">📅</div>
          <div class="stat-value">${minYear}–${maxYear}</div>
          <div class="stat-label">Year Range</div>
        </div>
      </div>

      <!-- Two-column layout: Timeline + Top Tags -->
      <div class="dashboard-row">
        <div class="dashboard-panel dashboard-panel--wide">
          <h3 class="panel-title">📈 Papers by Year</h3>
          <div class="chart-container chart-container--timeline">
            <canvas id="timeline-chart"></canvas>
          </div>
        </div>
        <div class="dashboard-panel">
          <h3 class="panel-title">🏆 Top Tags</h3>
          <div class="top-tags-list">
            ${top3.map(([tag, count], i) => {
    const pct = Math.round((count / totalPapers) * 100);
    const medals = ['🥇', '🥈', '🥉'];
    return `
                <a href="#papers?tag=${encodeURIComponent(tag)}" class="top-tag-item">
                  <span class="top-tag-rank">${medals[i]}</span>
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
        <h3 class="panel-title">📊 Tag Distribution</h3>
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
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { family: 'Inter', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          cornerRadius: 8,
          padding: 12,
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
      onClick: (event, elements) => {
        let tag = null;
        if (elements.length > 0) {
          tag = labels[elements[0].index];
        }
        if (tag) {
          window.location.hash = `#papers?tag=${encodeURIComponent(tag)}`;
        }
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { family: 'Inter', size: 13, weight: '600' },
          bodyFont: { family: 'Inter', size: 12 },
          cornerRadius: 8,
          padding: 12,
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

/**
 * Escape HTML entities.
 */
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
