import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const width = window.innerWidth,
  height = window.innerHeight;

// caméra
const camera = new THREE.PerspectiveCamera(70, width / height, 0.5, 10);
camera.position.set(0, 0, 3);

const scene = new THREE.Scene();

// lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

let elephant;
let mixer; // Pour gérer les animations

// GLTFLoader est utilisé pour charger le modèle 3D en .glb
const loader = new GLTFLoader();

loader.load(
  "/3dmodels/BabyElephant_GLB.glb",
  function (gltf) {
    // console.log(gltf);

    elephant = gltf.scene; // Chargement du modèle
    scene.add(elephant);

    // Calculer les dimensions pour centrer le modèle
    const box = new THREE.Box3().setFromObject(elephant);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    elephant.position.set(-center.x + 1, -center.y, -2); // ajustement de la position
    elephant.scale.set(1, 1, 1);

    // Initialisation du mixer pour les animations
    mixer = new THREE.AnimationMixer(elephant);

    // Charger les animations à partir du fichier GLTF
    if (gltf.animations.length > 0) {
      const action = mixer.clipAction(gltf.animations[0]); // première animation
      action.setEffectiveTimeScale(1); // Vitesse normale
      action.play();
    } else {
      console.warn("Aucune animation trouvée dans le fichier GLTF.");
    }
  },
  undefined,
  function (error) {
    console.error("Erreur lors du chargement du modèle :", error);
  }
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(width, height);
renderer.xr.enabled = true;

const mainElement = document.querySelector("main");

function createARButton(enabled) {
  if (enabled) {
    const arSection = document.getElementById("ar-section");
    const arButton = ARButton.createButton(renderer);
    arButton.removeAttribute("style"); // Supprime les styles en ligne par défaut
    arButton.classList.add("custom-ar-button");
    arSection.appendChild(arButton);
  }
}

/*
arSection.appendChild(arButton);
mainElement.appendChild(renderer.domElement);
*/

// Vérifie si le navigateur supporte la XR
if (navigator.xr) {
  // Vérifie la disponibilité du mode immersive-ar
  navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
    createARButton(supported); // crée un bouton de réalité augmentée si la fonctionnalité est disponible
    mainElement.appendChild(renderer.domElement); // Ajoute le canvas avec la scène 3D à l'élément main sinon
  });
} else {
  mainElement.appendChild(renderer.domElement); // Ajoute le canvas avec la scène 3D à l'élément main si la XR n'est pas prise en charge
}

// Boucle d'animation
let previousTime = 0;

renderer.setAnimationLoop((time) => {
  const delta = time - previousTime;
  previousTime = time; // Mettre à jour le temps précédent

  if (mixer) {
    mixer.update(delta * 0.001); // Mettre à jour l'animation
  }

  renderer.render(scene, camera);
});
