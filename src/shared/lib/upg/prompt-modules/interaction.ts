/**
 * Interaction & Animation Standards for UPG System Prompt
 *
 * Sources:
 * - threejs-interaction (S-tier 9.0): OrbitControls params, raycaster, coordinate conversion
 * - threejs-animation (A-tier 8.5): Spring physics, oscillation, Clock usage
 * - AetherViz SKILL.md: Button requirements, quiz panel, interaction feedback
 */

export function getInteractionPrompt(): string {
  return `
## INTERACTION STANDARDS

### Slider Requirements
- Use \`input\` event (real-time), NOT \`change\` event (only fires on release)
- Each slider MUST show: label + current numeric value + unit
- Slider change → simultaneously update: 3D scene + vectors + SVG overlay + KaTeX formulas
- Range should be scientifically meaningful (e.g., mass: 0.1-100 kg, not 0-1000)

### Required Buttons
1. **Play/Pause** — Toggle simulation running state
2. **Reset** — Return all parameters to initial values, clear trails, reset camera
3. **Random Experiment** — Randomize slider values within valid ranges, auto-play

### Quiz Panel (Collapsible)
- Default: visible in right/bottom area
- Must have close button (✕) in top-right corner
- When closed: show floating circular button in bottom-right (quiz icon)
- Click floating button → expand panel with transition: all 0.3s ease
- Panel size: 360px wide, max 380px tall
- Questions: 1-2 multiple-choice, instant color feedback (green correct / red wrong)

### OrbitControls Configuration
\`\`\`javascript
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI * 0.85; // prevent going fully underneath
controls.enablePan = true;
controls.panSpeed = 0.8;
// controls.update() MUST be called in animation loop when damping is enabled
\`\`\`

### Click-to-Highlight (Optional Enhancement)
\`\`\`javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickableObjects);
  if (hits.length > 0) {
    // Highlight: temporarily boost emissive
    const obj = hits[0].object;
    obj.material.emissive.set(0x444444);
    setTimeout(() => obj.material.emissive.set(0x000000), 500);
  }
});
\`\`\`

### Touch Support
- OrbitControls handles touch natively (rotate, pinch-zoom, two-finger pan)
- For custom touch events: use \`event.touches[0]\` with same NDC conversion as mouse
- Always call \`event.preventDefault()\` on touchstart/touchmove to prevent page scroll

### Animation Feel
- All parameter changes should feel smooth, not instant
- Use lerp for smooth transitions: \`value += (target - value) * 0.1\`
- Spring physics for bouncy feedback (stiffness: 100, damping: 10)
- 60fps target, use requestAnimationFrame via renderer.setAnimationLoop()
- Time-delta based: \`const dt = Math.min(clock.getDelta(), 0.05)\`
`;
}
