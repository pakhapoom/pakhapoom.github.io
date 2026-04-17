/**
 * graph.js — Knowledge graph: paper connections via shared specific tags
 */

import { loadPapers } from './data.js';
import { escapeHtml, showLoading } from './utils.js';

// Design-system colours
const YEAR_PALETTE  = ['#6366f1', '#8b5cf6', '#a78bfa', '#7c3aed', '#4f46e5'];
const EDGE_DEFAULT  = 'rgba(99, 102, 241, 0.28)';
const EDGE_ACTIVE   = 'rgba(129, 140, 248, 0.95)';
const EDGE_FAINT    = 'rgba(99, 102, 241, 0.05)';
const LABEL_DEFAULT = 'rgba(148, 163, 184, 0.55)';
const LABEL_FAINT   = 'rgba(148, 163, 184, 0.12)';
const NODE_R        = 22;

let _sim = null;

function stopSim() {
  if (_sim) { _sim.stop(); _sim = null; }
}

/**
 * Render the knowledge-graph page into container.
 * @param {HTMLElement} container
 */
export async function renderGraph(container) {
  showLoading(container);
  stopSim();

  const papers = await loadPapers();

  if (papers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔗</div>
        <h3>No papers to graph</h3>
        <p>Add papers to see their connections.</p>
      </div>`;
    return;
  }

  // Tag frequencies
  const tagFreq = new Map();
  for (const p of papers) {
    for (const t of p.tags) tagFreq.set(t, (tagFreq.get(t) || 0) + 1);
  }

  const maxFreq      = Math.max(...tagFreq.values());
  const years        = [...new Set(papers.map(p => p.year))].sort();
  const yearColor    = Object.fromEntries(years.map((y, i) => [y, YEAR_PALETTE[i % YEAR_PALETTE.length]]));
  const defaultThresh = Math.min(maxFreq, Math.max(2, Math.round(papers.length / 2)));

  container.innerHTML = `
    <div class="graph-page fade-in">

      <div class="dashboard-panel graph-controls-panel">
        <div class="graph-controls-top">
          <div class="graph-slider-group">
            <span class="graph-control-label">
              Ignore tags appearing in ≥ <strong id="graph-thresh-val">${defaultThresh}</strong> papers
            </span>
            <div class="graph-slider-track">
              <span class="graph-slider-end">2</span>
              <input type="range" id="graph-threshold" class="graph-slider"
                min="2" max="${maxFreq + 1}" value="${defaultThresh}" step="1">
              <span class="graph-slider-end">${maxFreq + 1}+</span>
            </div>
          </div>
          <div class="graph-year-legend">
            ${years.map(y => `
              <div class="graph-legend-item">
                <span class="graph-legend-dot" style="background:${yearColor[y]}"></span>
                <span>${y}</span>
              </div>`).join('')}
          </div>
        </div>
        <div class="graph-filtered-tags" id="graph-filtered-tags">
          ${filteredTagsHtml(tagFreq, defaultThresh)}
        </div>
      </div>

      <div class="graph-canvas-wrapper" id="graph-wrapper">
        <svg id="graph-svg" style="width:100%;height:100%"></svg>
        <div id="graph-tooltip" class="graph-tooltip"></div>
        <span class="graph-hint">Drag · Scroll to zoom · Click to open paper</span>
      </div>

    </div>`;

  drawGraph(papers, tagFreq, yearColor, defaultThresh);

  // Wire slider
  const slider   = container.querySelector('#graph-threshold');
  const threshEl = container.querySelector('#graph-thresh-val');
  const tagsEl   = container.querySelector('#graph-filtered-tags');

  slider.addEventListener('input', () => {
    const t = parseInt(slider.value);
    threshEl.textContent = t;
    tagsEl.innerHTML     = filteredTagsHtml(tagFreq, t);
    stopSim();
    drawGraph(papers, tagFreq, yearColor, t);
  });
}

// ---- Helpers ----------------------------------------------------------------

function filteredTagsHtml(tagFreq, threshold) {
  const filtered = [...tagFreq.entries()]
    .filter(([, c]) => c >= threshold)
    .sort((a, b) => b[1] - a[1]);
  if (filtered.length === 0) {
    return '<em class="graph-no-filter">No tags filtered — all connections shown</em>';
  }
  return `<span class="graph-filter-label">Filtered out:</span> ${
    filtered.map(([t, c]) =>
      `<span class="tag-badge graph-filtered-badge">${escapeHtml(t)}<span class="tag-count">${c}</span></span>`
    ).join('')}`;
}

function truncate(str, n) {
  return str.length <= n ? str : str.slice(0, n - 1) + '…';
}

// ---- D3 force graph ---------------------------------------------------------

function drawGraph(papers, tagFreq, yearColor, threshold) {
  const d3 = window.d3;
  if (!d3) { console.error('[graph] D3.js not loaded'); return; }

  const broad = new Set(
    [...tagFreq.entries()].filter(([, c]) => c >= threshold).map(([t]) => t)
  );

  // Graph data
  const nodes = papers.map(p => ({
    id:       p.id,
    title:    p.title,
    year:     p.year,
    tags:     p.tags,
    specific: p.tags.filter(t => !broad.has(t)),
    color:    yearColor[p.year] || YEAR_PALETTE[0]
  }));

  const links = [];
  for (let i = 0; i < papers.length; i++) {
    for (let j = i + 1; j < papers.length; j++) {
      const shared = papers[i].tags.filter(t => !broad.has(t) && papers[j].tags.includes(t));
      if (shared.length) {
        links.push({ source: papers[i].id, target: papers[j].id, shared, w: shared.length });
      }
    }
  }

  // SVG dimensions
  const wrapper = document.getElementById('graph-wrapper');
  if (!wrapper) return;
  const W = wrapper.clientWidth  || 800;
  const H = wrapper.clientHeight || 500;

  const svg = d3.select('#graph-svg').attr('width', W).attr('height', H);
  svg.selectAll('*').remove();

  // Defs — glow filter
  const defs = svg.append('defs');
  const filt = defs.append('filter').attr('id', 'node-glow')
    .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  filt.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', 5).attr('result', 'blur');
  const fm = filt.append('feMerge');
  fm.append('feMergeNode').attr('in', 'blur');
  fm.append('feMergeNode').attr('in', 'SourceGraphic');

  // Root group (target for zoom/pan)
  const root = svg.append('g');
  svg.call(
    d3.zoom().scaleExtent([0.2, 4]).on('zoom', e => root.attr('transform', e.transform))
  ).on('dblclick.zoom', null);

  // No-connections overlay
  if (links.length === 0) {
    svg.append('text')
      .attr('x', W / 2).attr('y', H / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#475569')
      .attr('font-family', 'Inter, sans-serif')
      .attr('font-size', 13)
      .text('No connections at this threshold — move the slider right');
  }

  // Tooltip
  const tip = document.getElementById('graph-tooltip');
  const showTip = (html, cx, cy) => {
    tip.innerHTML = html;
    tip.style.display = 'block';
    // Clamp so tooltip stays within viewport
    const tw = 280, th = 100;
    tip.style.left = Math.min(cx + 16, window.innerWidth  - tw) + 'px';
    tip.style.top  = Math.max(cy -  8, 0)                       + 'px';
  };
  const hideTip = () => { tip.style.display = 'none'; };

  // Layer order (bottom → top): vis links → edge labels → hit areas → nodes
  const visLinkG  = root.append('g').attr('class', 'g-vis-links');
  const edgeLblG  = root.append('g').attr('class', 'g-edge-labels').attr('pointer-events', 'none');
  const hitLinkG  = root.append('g').attr('class', 'g-hit-links');
  const nodeG     = root.append('g').attr('class', 'g-nodes');

  // Visible link lines
  const linkLines = visLinkG.selectAll('line').data(links).enter().append('line')
    .attr('stroke', EDGE_DEFAULT)
    .attr('stroke-width', d => 1 + d.w * 0.6);

  // Edge labels (shared tag names)
  const edgeLabels = edgeLblG.selectAll('text').data(links).enter().append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', LABEL_DEFAULT)
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-size', 9)
    .text(d => d.shared.join(', '));

  // Transparent hit areas (wider stroke for easy hover)
  hitLinkG.selectAll('line').data(links).enter().append('line')
    .attr('stroke', 'transparent')
    .attr('stroke-width', 14)
    .style('cursor', 'default')
    .on('mouseover', (evt, d) => {
      linkLines.filter(l => l === d)
        .attr('stroke', EDGE_ACTIVE)
        .attr('stroke-width', d.w + 2.5);
      showTip(
        `<div class="graph-tt-row"><strong>Shared:</strong>&nbsp;${
          d.shared.map(t => `<span class="tag-badge" style="font-size:10px;padding:1px 6px">${escapeHtml(t)}</span>`).join(' ')
        }</div>`,
        evt.clientX, evt.clientY
      );
    })
    .on('mouseout', (evt, d) => {
      linkLines.filter(l => l === d)
        .attr('stroke', EDGE_DEFAULT)
        .attr('stroke-width', 1 + d.w * 0.6);
      hideTip();
    });

  // Node groups
  const nodeGroups = nodeG.selectAll('g').data(nodes).enter().append('g')
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    )
    .on('click', (e, d) => { e.stopPropagation(); window.location.hash = `#paper/${d.id}`; })
    .on('mouseover', (evt, d) => {
      // Find connected node IDs
      const conn = new Set([d.id]);
      links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        if (s === d.id) conn.add(t);
        if (t === d.id) conn.add(s);
      });

      nodeGroups.select('.n-halo').attr('fill-opacity', nd => conn.has(nd.id) ? 0.18 : 0);
      nodeGroups.select('.n-circle')
        .attr('fill-opacity',   nd => conn.has(nd.id) ? 0.95 : 0.18)
        .attr('stroke-opacity', nd => conn.has(nd.id) ? 1    : 0.15);
      nodeGroups.select('.n-label')
        .attr('fill', nd => conn.has(nd.id) ? '#e2e8f0' : 'rgba(226,232,240,0.2)');

      linkLines.attr('stroke', l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return (s === d.id || t === d.id) ? EDGE_ACTIVE : EDGE_FAINT;
      }).attr('stroke-width', l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return (s === d.id || t === d.id) ? l.w + 2.5 : 0.5;
      });

      edgeLabels.attr('fill', l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return (s === d.id || t === d.id) ? LABEL_DEFAULT : LABEL_FAINT;
      });

      showTip(`
        <div class="graph-tt-title">${escapeHtml(d.title)}</div>
        <div class="graph-tt-meta">${d.year}</div>
        ${d.specific.length
          ? `<div class="graph-tt-tags">${d.specific.map(t =>
              `<span class="tag-badge" style="font-size:10px;padding:1px 6px">${escapeHtml(t)}</span>`
            ).join(' ')}</div>`
          : ''}
      `, evt.clientX, evt.clientY);
    })
    .on('mouseout', () => {
      nodeGroups.select('.n-halo').attr('fill-opacity', 0.1);
      nodeGroups.select('.n-circle').attr('fill-opacity', 0.9).attr('stroke-opacity', 0.7);
      nodeGroups.select('.n-label').attr('fill', '#e2e8f0');
      linkLines.attr('stroke', EDGE_DEFAULT).attr('stroke-width', d => 1 + d.w * 0.6);
      edgeLabels.attr('fill', LABEL_DEFAULT);
      hideTip();
    });

  // Halo (soft glow ring)
  nodeGroups.append('circle').attr('class', 'n-halo')
    .attr('r', NODE_R + 10)
    .attr('fill', d => d.color)
    .attr('fill-opacity', 0.1)
    .attr('stroke', 'none');

  // Main circle
  nodeGroups.append('circle').attr('class', 'n-circle')
    .attr('r', NODE_R)
    .attr('fill', d => d.color)
    .attr('fill-opacity', 0.9)
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .attr('stroke-opacity', 0.7)
    .attr('filter', 'url(#node-glow)');

  // Label below node
  nodeGroups.append('text').attr('class', 'n-label')
    .attr('text-anchor', 'middle')
    .attr('dy', NODE_R + 15)
    .attr('fill', '#e2e8f0')
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-size', 11)
    .attr('font-weight', 500)
    .attr('pointer-events', 'none')
    .text(d => truncate(d.title, 24));

  // Force simulation
  const sim = d3.forceSimulation(nodes)
    .force('link',    d3.forceLink(links).id(d => d.id).distance(170).strength(0.7))
    .force('charge',  d3.forceManyBody().strength(-450))
    .force('center',  d3.forceCenter(W / 2, H / 2))
    .force('collide', d3.forceCollide(NODE_R + 28))
    .on('tick', () => {
      const pos = (sel) => sel
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      pos(linkLines);
      pos(hitLinkG.selectAll('line'));
      edgeLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 6);
      nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);
    });

  _sim = sim;
}
