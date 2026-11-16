// How Gravitor puts the Orb in a three.js game (from src/game/BallController.ts and
// src/render/SceneRenderer.ts in cnmbuck1/gravity-shift). Copy the pattern; never edit cnmbuck-orb.ts.
import * as THREE from 'three';
import { createOrbMaterial, OrbFx } from '../orb/cnmbuck-orb';

export const BALL_RADIUS = 0.5; // Gravitor's ball is 1 m across

export function setUpRenderer(canvas: HTMLCanvasElement) {
  // The Orb's colours were tuned under these settings: keep them in any game that shows the Orb.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  return renderer;
}

export function addOrb(scene: THREE.Scene) {
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BALL_RADIUS, 48, 32), createOrbMaterial());
  ball.castShadow = true;
  scene.add(ball);
  // Gravitor turns the ground glow off because its "down" can be any wall; a flat game can leave it on.
  const fx = new OrbFx(BALL_RADIUS, { groundGlow: false });
  fx.on = true;
  scene.add(fx.group);
  return { ball, fx };
}

/** Every frame, after physics: roll the mesh with the body, then let the extras follow its centre. */
export function updateOrb(
  orb: { ball: THREE.Mesh; fx: OrbFx },
  pos: THREE.Vector3, rot: THREE.Quaternion, speed: number, groundY: number | null,
  dt: number, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer,
) {
  orb.ball.position.copy(pos);
  orb.ball.quaternion.copy(rot);
  orb.fx.update(pos, groundY, speed > 0.4, orb.ball.visible, dt, camera, renderer);
}
