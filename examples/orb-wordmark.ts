// A game's name with the Cnmbuck Orb as its letter O, as on Gravitor's launch screen (GRAVIT(O)R).
// The drawing is Gravitor's launch wordmark, lifted unchanged from tools/ios-assets/draw.ts in
// cnmbuck1/gravity-shift, with the letters before and after the O made parameters.
import { drawOrbIcon } from '../orb/cnmbuck-orb';

/**
 * Draw `before` + Orb + `after` centred at (cx, cy). `fs` is the font size in pixels.
 * Gravitor's launch image: drawOrbWordmark(g, 'GRAVIT', 'R', size / 2, size / 2, size * 0.05) on a 2732 square.
 */
export function drawOrbWordmark(g: CanvasRenderingContext2D, before: string, after: string, cx: number, cy: number, fs: number) {
  g.save();
  g.font = `800 ${fs}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
  g.textBaseline = 'middle';
  const spacing = fs * 0.12;
  const measure = (s: string) => [...s].reduce((w, ch) => w + g.measureText(ch).width + spacing, 0);
  const orbBox = fs * 1.5; // drawOrbIcon fills ~0.76 of its box with the ball and glow
  const orbW = orbBox * 0.8;
  const total = measure(before) + orbW + measure(after) - spacing;
  let x = cx - total / 2;
  const text = (s: string) => {
    for (const ch of s) {
      g.shadowColor = '#0a8cff'; g.shadowBlur = fs * 0.35;
      g.fillStyle = '#eaf6ff'; g.fillText(ch, x, cy);
      g.shadowBlur = 0;
      x += g.measureText(ch).width + spacing;
    }
  };
  text(before);
  drawOrbIcon(g, orbBox, x + orbW / 2 - orbBox / 2, cy - orbBox / 2);
  x += orbW + spacing;
  text(after);
  g.restore();
}

/** Gravitor's full launch image: dark field, soft blue glow, wordmark in the middle. */
export function drawGravitorLaunch(g: CanvasRenderingContext2D, size: number) {
  g.fillStyle = '#05070d'; g.fillRect(0, 0, size, size);
  const glow = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.3);
  glow.addColorStop(0, 'rgba(10,30,80,0.9)'); glow.addColorStop(1, 'rgba(5,7,13,0)');
  g.fillStyle = glow; g.fillRect(0, 0, size, size);
  drawOrbWordmark(g, 'GRAVIT', 'R', size / 2, size / 2, size * 0.05);
}
