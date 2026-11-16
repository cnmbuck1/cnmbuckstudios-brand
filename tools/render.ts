// Draws the reference PNGs in assets/ from the brand kit itself (run `npm run render`).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { drawOrbIcon } from '../orb/cnmbuck-orb';
import { addOrb, setUpRenderer, updateOrb } from '../examples/three-usage';
import { drawOrbWordmark } from '../examples/orb-wordmark';

const png = (c: HTMLCanvasElement) => c.toDataURL('image/png').split(',')[1];
function canvas(w: number, h = w) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

function orbIcon(size: number, halo = true) {
  const c = canvas(size);
  drawOrbIcon(c.getContext('2d')!, size, 0, 0, 0, halo);
  return c;
}

function wordmark() {
  const c = canvas(2400, 600);
  drawOrbWordmark(c.getContext('2d')!, 'GRAVIT', 'R', 1200, 300, 260);
  return c;
}


/** The Orb in 3D with its glow, lit the way Gravitor lights it, on Gravitor's void colour. */
function orb3d() {
  const c = canvas(1024);
  const renderer = setUpRenderer(c);
  renderer.setSize(1024, 1024, false);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#05070d');
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight('#6fa8ff', '#1a0f2e', 0.5));
  const key = new THREE.DirectionalLight('#ffffff', 1.2); key.position.set(2, 4, 3); scene.add(key);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.6, 3.2); camera.lookAt(0, 0, 0);
  const orb = addOrb(scene);
  // Turn the ball so the band runs across it as in the flat icon
  const turn = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, 1.55));
  updateOrb(orb, new THREE.Vector3(), turn, 0, null, 1 / 60, camera, renderer);
  renderer.render(scene, camera);
  return c;
}

(window as unknown as { assets: unknown }).assets = {
  'assets/orb/cnmbuck-orb-1024.png': png(orbIcon(1024)),
  'assets/orb/cnmbuck-orb-512.png': png(orbIcon(512)),
  'assets/orb/cnmbuck-orb-256.png': png(orbIcon(256)),
  'assets/orb/cnmbuck-orb-1024-no-halo.png': png(orbIcon(1024, false)),
  'assets/orb/cnmbuck-orb-3d.png': png(orb3d()),
  'assets/gravitor/wordmark-transparent.png': png(wordmark()),
};
