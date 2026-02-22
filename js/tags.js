/**
 * tags.js — Tag statistics and visualisation
 */

import { loadPapers, getAllTags } from './data.js';

let chartInstance = null;

/**
 * Render the tags statistics view.
 * @param {HTMLElement} container
 */
export async function renderTags(container) {
    const papers = await loadPapers();
    const tagMap = await getAllTags();
    const totalPapers = papers.length;
    const totalTags = tagMap.size;

    // Sort tags by count descending
    const sortedTags = [...tagMap.entries()].sort((a, b) => b[1] - a[1]);

    // Year range
    const years = papers.map(p => p.year);
    const yearRange = years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : 'N/A';

    let html = `
    <div class="fade-in">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${totalPapers}</div>
          <div class="stat-label">Papers</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${totalTags}</div>
          <div class="stat-label">Unique Tags</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${yearRange}</div>
          <div class="stat-label">Year Range</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${sortedTags.length > 0 ? sortedTags[0][0] : '—'}</div>
          <div class="stat-label">Top Tag</div>
        </div>
      </div>

      <!-- Tags Cloud -->
      <h3 style="margin-bottom: var(--space-md);">All Tags</h3>
      <div class="tags-cloud">
        ${sortedTags.map(([tag, count]) => `
          <a href="#papers?tag=${encodeURIComponent(tag)}" class="tag-badge">
            ${escapeHtml(tag)}
            <span class="tag-count">${count}</span>
          </a>
        `).join('')}
      </div>

      <!-- Chart -->
      <h3 style="margin-bottom: var(--space-md);">Tag Distribution</h3>
      <div class="chart-container">
        <canvas id="tags-chart"></canvas>
      </div>
    </div>`;

    container.innerHTML = html;

    // Render Chart.js bar chart
    renderChart(sortedTags);
}

/**
 * Render a horizontal bar chart of tag counts using Chart.js.
 */
function renderChart(sortedTags) {
    const canvas = document.getElementById('tags-chart');
    if (!canvas) return;

    // Destroy previous instance
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const labels = sortedTags.map(([tag]) => tag);
    const data = sortedTags.map(([, count]) => count);

    // Generate accent-derived colors
    const colors = sortedTags.map((_, i) => {
        const hue = 230 + (i * 25) % 60; // range around blue/violet
        const sat = 65 + (i * 5) % 20;
        return `hsl(${hue}, ${sat}%, 62%)`;
    });

    chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Papers',
                data,
                backgroundColor: colors,
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 28
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1d23',
                    titleFont: { family: 'Inter', size: 12 },
                    bodyFont: { family: 'Inter', size: 12 },
                    cornerRadius: 8,
                    padding: 10
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { family: 'Inter', size: 11 },
                        color: '#9aa3b1'
                    },
                    grid: { color: 'rgba(0,0,0,0.04)' }
                },
                y: {
                    ticks: {
                        font: { family: 'Inter', size: 12, weight: 500 },
                        color: '#5f6878'
                    },
                    grid: { display: false }
                }
            }
        }
    });
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
