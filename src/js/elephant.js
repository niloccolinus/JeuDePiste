import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const width = window.innerWidth;
const height = window.innerHeight;

let mixer; // variable globale pour gérer les animations

// Vérifie si l'étape est déverrouillée avant d'initialiser l'AR
function isStepUnlocked() {
    const page = document.body.getAttribute("data-page");
    const storageKey = `${page}-unlocked`;
    return localStorage.getItem(storageKey);
}

// initialise la caméra
function initializeCamera() {
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.5, 10);
    camera.position.set(0, 0, 3);
    return camera;
}

// initialise la scène et les lumières
function initializeScene() {
    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    return scene;
}

// charge et ajoute le modèle 3D (éléphant) à la scène
function loadModel(scene) {
    const loader = new GLTFLoader();

    loader.load(
        "/3dmodels/BabyElephant_GLB.glb",
        function (gltf) {
            const elephant = gltf.scene; // chargement du modèle
            scene.add(elephant);

            // Calculer les dimensions pour centrer le modèle
            const box = new THREE.Box3().setFromObject(elephant);
            const center = new THREE.Vector3();
            box.getCenter(center);

            elephant.position.set(-center.x + 1, -center.y, -2); // ajustement de la position
            elephant.scale.set(1, 1, 1);

            // Initialisation du mixer pour les animations
            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(elephant);
                const action = mixer.clipAction(gltf.animations[0]); // première animation
                action.setEffectiveTimeScale(1); // vitesse normale
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
}

// Vérifie la compatibilité AR et personanlise le bouton AR
function setupARButton(renderer, arSection) {
    const arButton = ARButton.createButton(renderer);
    arButton.removeAttribute("style"); // supprime les styles en ligne par défaut
    arButton.classList.add("custom-ar-button");

    // vérifie si l'AR est supportée
    if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
            if (!supported) {
                console.warn("AR non supportée.");
                disableARButton(arButton);
            }
        });
    } else {
        console.warn("WebXR API non disponible.");
        disableARButton(arButton);
    }

    arSection.appendChild(arButton);
}

// Désactive le bouton AR si l'AR n'est pas supportée
function disableARButton(arButton) {
    arButton.classList.add("disabled");
    arButton.disabled = true; // empêche toute interaction
}

// Initialise et configure le rendu
function initializeRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });

    renderer.setSize(width, height);
    renderer.xr.enabled = true;

    return renderer;
}

// Boucle d'animation
function setupAnimationLoop(renderer, scene, camera) {
    let previousTime = 0;

    renderer.setAnimationLoop((time) => {
        const delta = time - previousTime;
        previousTime = time;

        if (mixer) {
            mixer.update(delta * 0.001); // met à jour l'animation
        }

        renderer.render(scene, camera);
    });
}

// Vérifie si l'étape est déverrouillée et initialise l'AR
function initializeAR() {
    if (!isStepUnlocked()) {
        console.warn("L'étape n'est pas déverrouillée. AR non initialisée.");
        return;
    }

    console.log("Étape déverrouillée. Initialisation de l'AR...");

    const camera = initializeCamera();
    const scene = initializeScene();
    const renderer = initializeRenderer();

    // Charge le modèle dans la scène
    loadModel(scene);

    const arSection = document.getElementById("ar-section");
    setupARButton(renderer, arSection);

    document.body.appendChild(renderer.domElement);
    setupAnimationLoop(renderer, scene, camera);
}

// Appel principal pour initialiser l'AR
initializeAR();
