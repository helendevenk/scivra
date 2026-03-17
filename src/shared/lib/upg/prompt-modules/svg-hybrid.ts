/**
 * SVG + Three.js Hybrid Rendering for UPG System Prompt
 *
 * Source: AetherViz SKILL.md (SVG + Three.js fusion architecture)
 */

export function getSvgHybridPrompt(): string {
  return `
## SVG + THREE.JS HYBRID RENDERING

### When to Use Each Mode

Auto-detect based on topic:

| Topic Contains | Render Mode | Reason |
|---------------|-------------|--------|
| motion, particle, collision, rotation, celestial, molecule, force, magnetic field, electric field | Three.js pure 3D | Needs spatial depth |
| function, graph, curve, chart, statistics, proof, geometry, coordinates | SVG primary | 2D data visualization |
| Newton, wave, vibration, electromagnetic, energy, oscillation | Three.js + SVG hybrid | Both spatial and data |

### Hybrid Architecture

When using hybrid mode, layer SVG on top of Three.js canvas:

\`\`\`javascript
// 1. Three.js canvas (bottom layer)
const canvasContainer = document.getElementById('canvas-container');
// ... standard Three.js setup ...

// 2. SVG overlay (top layer, transparent, non-interactive)
const svgDiv = document.createElement('div');
svgDiv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
canvasContainer.style.position = 'relative';
canvasContainer.appendChild(svgDiv);

// Create SVG element
const svgNS = 'http://www.w3.org/2000/svg';
const svg = document.createElementNS(svgNS, 'svg');
svg.setAttribute('width', '100%');
svg.setAttribute('height', '100%');
svg.style.overflow = 'visible';
svgDiv.appendChild(svg);

// 3. Coordinate sync: 3D world → 2D screen
function project3Dto2D(worldPos) {
  const v = worldPos.clone().project(camera);
  return {
    x: (v.x * 0.5 + 0.5) * renderer.domElement.clientWidth,
    y: (-(v.y * 0.5) + 0.5) * renderer.domElement.clientHeight
  };
}
\`\`\`

### SVG Drawing Patterns

\`\`\`javascript
// Draw a function curve (e.g., sine wave)
function drawCurve(svg, points, color, strokeWidth) {
  let d = 'M ' + points[0].x + ' ' + points[0].y;
  for (let i = 1; i < points.length; i++) {
    d += ' L ' + points[i].x + ' ' + points[i].y;
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', strokeWidth);
  path.setAttribute('fill', 'none');
  path.setAttribute('opacity', '0.8');
  svg.appendChild(path);
  return path;
}

// Draw axis with labels
function drawAxis(svg, startX, startY, endX, endY, label, color) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', startX);
  line.setAttribute('y1', startY);
  line.setAttribute('x2', endX);
  line.setAttribute('y2', endY);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '1');
  svg.appendChild(line);

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', endX + 5);
  text.setAttribute('y', endY);
  text.setAttribute('fill', color);
  text.setAttribute('font-size', '12');
  text.textContent = label;
  svg.appendChild(text);
}
\`\`\`

### Sync Rule
When a slider changes a parameter:
1. Update Three.js objects (position, material, geometry)
2. Update SVG paths/labels (recalculate points, redraw)
3. Update KaTeX formulas (recalculate values)

All three must happen in the same slider event handler for synchronized feedback.
`;
}
