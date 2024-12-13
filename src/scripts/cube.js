import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

// test code from https://www.npmjs.com/package/three

const width = window.innerWidth,
  height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();

const cube = new THREE.Mesh(geometry, material);
cube.position.set(0, 0, -2);
scene.add(cube);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(width, height);
renderer.xr.enabled = true; // activer la xr
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer)); // ajouter bouton start AR

// animation

function animate(time) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  renderer.render(scene, camera);
}
