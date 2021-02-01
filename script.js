import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "../examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "../examples/jsm/loaders/OBJLoader.js";

let scene,
	controlOrbit,
	camera,
	renderer,
	cloudParticles = [],
	flash,
	rain,
	rainGeo,
	rainCount = 15000;

var girl1, mixer;

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.x = -30;
	camera.position.y = -30;
	camera.position.z = -30;
	camera.rotation.x = 1.16;
	camera.rotation.y = -0.12;
	camera.rotation.z = 0.27;

	let ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);

	let directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0, 0, 1);
	scene.add(directionalLight);

	flash = new THREE.PointLight(0xf5f114, 30, 500, 1.7);
	flash.position.set(200, 300, 100);
	scene.add(flash);

	renderer = new THREE.WebGLRenderer();
	scene.fog = new THREE.FogExp2(0x11111f, 0.002);
	renderer.setClearColor(scene.fog.color);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// orbit controls
	controlOrbit = new OrbitControls(camera, renderer.domElement);
	controlOrbit.target.set(1.16, -0.12, 0.27);
	controlOrbit.update();

	rainGeo = new THREE.Geometry();
	for (let i = 0; i < rainCount; i++) {
		let rainDrop = new THREE.Vector3(
			Math.random() * 400 - 200,
			Math.random() * 500 - 250,
			Math.random() * 400 - 200
		);
		rainDrop.velocity = {};
		rainDrop.velocity = 0;
		rainGeo.vertices.push(rainDrop);
	}
	let rainMaterial = new THREE.PointsMaterial({
		color: 0xaaaaaa,
		size: 0.1,
		transparent: true,
	});
	rain = new THREE.Points(rainGeo, rainMaterial);
	scene.add(rain);

	// zombie girl

	let loader_girl = new FBXLoader();

	loader_girl.load("ZombiePunching.fbx", (object) => {
		// animation mixer
		mixer = new THREE.AnimationMixer(object);

		const action = mixer.clipAction(object.animations[0]);
		action.play();

		// make materials opaque
		object.traverse((child) => {
			if (child.isMesh) {
				child.material.transparent = false;
			}
		});

		object.scale.set(0.05, 0.05, 0.05);
		object.rotation.x = Math.PI;
		scene.add(object);

		girl1 = object;
	});

	let loader_girl2 = new FBXLoader();

	loader_girl2.load("ZombiePunching.fbx", (object) => {
		// animation mixer
		mixer = new THREE.AnimationMixer(object);

		const action = mixer.clipAction(object.animations[0]);
		action.play();

		// make materials opaque
		object.traverse((child) => {
			if (child.isMesh) {
				child.material.transparent = false;
			}
		});

		object.scale.set(0.05, 0.05, 0.05);
		object.rotation.x = Math.PI;
		object.position.x = -5;
		object.position.y = -5;
		scene.add(object);
	});

	let loader_girl3 = new FBXLoader();

	loader_girl3.load("ZombiePunching.fbx", (object) => {
		// animation mixer
		mixer = new THREE.AnimationMixer(object);

		const action = mixer.clipAction(object.animations[0]);
		action.play();

		// make materials opaque
		object.traverse((child) => {
			if (child.isMesh) {
				child.material.transparent = false;
			}
		});

		object.scale.set(0.05, 0.05, 0.05);
		object.rotation.x = Math.PI;
		object.position.x = -10;
		object.position.y = -10;
		scene.add(object);
	});

	let loader = new THREE.TextureLoader();
	loader.load("smoke.png", function (texture) {
		let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
		let cloudMaterial = new THREE.MeshLambertMaterial({
			map: texture,
			transparent: true,
		});
		for (let p = 0; p < 25; p++) {
			let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
			cloud.position.set(
				Math.random() * 800 - 400,
				500,
				Math.random() * 500 - 450
			);
			cloud.rotation.x = 1.16;
			cloud.rotation.y = -0.12;
			cloud.rotation.z = Math.random() * 360;
			cloud.material.opacity = 0.6;
			cloudParticles.push(cloud);
			scene.add(cloud);
		}
	});
}

function animate() {
	cloudParticles.forEach((p) => {
		p.rotation.z -= 0.002;
	});

	rainGeo.vertices.forEach((p) => {
		p.velocity -= 0.1 + Math.random() * 0.1;
		p.y += p.velocity;
		if (p.y < -200) {
			p.y = 200;
			p.velocity = 0;
		}
	});
	rainGeo.verticesNeedUpdate = true;
	rain.rotation.y += 0.002;

	girl1.rotation.y += 0.001;

	if (Math.random() > 0.93 || flash.power > 100) {
		if (flash.power < 100)
			flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);
		flash.power = 50 + Math.random() * 500;
	}

	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

init();
animate();

// https://lhbhb21c.tistory.com/88
