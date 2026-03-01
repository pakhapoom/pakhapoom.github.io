/**
 * background.js — Animated neural-network canvas background
 * Draws floating nodes connected by proximity lines.
 * Includes a subtle mouse-repel interaction.
 */

const NODE_COUNT = 55;
const CONNECTION_DIST = 150;
const MOUSE_REPEL_DIST = 120;
const MOUSE_REPEL_FORCE = 0.8;

let canvas, ctx, nodes, mouse, animId, running;

class Node {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 1;
        this.baseAlpha = Math.random() * 0.3 + 0.15;
    }

    update(w, h) {
        // Mouse repel
        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_REPEL_DIST && dist > 0) {
                const force = (1 - dist / MOUSE_REPEL_DIST) * MOUSE_REPEL_FORCE;
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }
        }

        // Dampen velocity
        this.vx *= 0.98;
        this.vy *= 0.98;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < -10) this.x = w + 10;
        if (this.x > w + 10) this.x = -10;
        if (this.y < -10) this.y = h + 10;
        if (this.y > h + 10) this.y = -10;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${this.baseAlpha})`;
        ctx.fill();
    }
}

function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_DIST) {
                const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (!running) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (const node of nodes) {
        node.update(w, h);
        node.draw(ctx);
    }
    drawConnections();

    animId = requestAnimationFrame(animate);
}

function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
}

function handleVisibility() {
    if (document.hidden) {
        running = false;
        cancelAnimationFrame(animId);
    } else {
        running = true;
        animate();
    }
}

/**
 * Initialize the neural-network background animation.
 * @param {HTMLCanvasElement} canvasEl - The canvas element to draw on
 */
export function initBackground(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    mouse = { x: null, y: null };
    running = true;

    resize();
    nodes = Array.from({ length: NODE_COUNT }, () => new Node(window.innerWidth, window.innerHeight));

    window.addEventListener('resize', () => {
        resize();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    document.addEventListener('visibilitychange', handleVisibility);

    animate();
}

/**
 * Stop the background animation and clean up.
 */
export function destroyBackground() {
    running = false;
    cancelAnimationFrame(animId);
    document.removeEventListener('visibilitychange', handleVisibility);
}
