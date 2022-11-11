// (c) gijs.i
// Gemaakt behulp van THREE.js

// noise.seed(Math.random());

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerWidth, 0.1, 1000 );
const clock = new THREE.Clock();

const canvasSize = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( canvasSize,canvasSize );
document.body.appendChild( renderer.domElement );
createMouseEventListeners(renderer.domElement);

const DIMENSIONS = 32;

let time = 0;

let noiseFreq = 0.2;
let noiseHeight = 2.0;
let noiseX = 0.0;
let noiseY = 0.0;

let noiseXSpeed = 0.0;
let noiseYSpeed = 0.0;
let rotationSpeed = 0;

let vertices = [];
let indices = [];

let index = 0;

function addVertex(x,y,z) {
    vertices.push(x,y,z);
}

function plane(x,z) {
    let y1 = noise2D((x)*noiseFreq + noiseX*noiseFreq,(z)*noiseFreq + noiseY*noiseFreq) * noiseHeight;
    let y2 = noise2D((x+1)*noiseFreq + noiseX*noiseFreq,(z)*noiseFreq + noiseY*noiseFreq) * noiseHeight;
    let y3 = noise2D((x+1)*noiseFreq + noiseX*noiseFreq,(z-1)*noiseFreq + noiseY*noiseFreq) * noiseHeight;
    let y4 = noise2D((x)*noiseFreq + noiseX*noiseFreq,(z-1)*noiseFreq + noiseY*noiseFreq) * noiseHeight;

    vertices.push(x + 0.0, y1, z + 0.0);
    vertices.push(x + 1.0, y2, z + 0.0);
    vertices.push(x + 1.0, y3, z - 1.0);
    vertices.push(x + 0.0, y4, z - 1.0);

    indices.push(index * 4);
    indices.push(index * 4 + 1);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 3);
    indices.push(index * 4);

    index++;
}

function generateTerrainMesh() {
    vertices = [];
    indices = [];
    index = 0;
    for(let x = 0;x < DIMENSIONS;x++) {
        for(let z = 0;z < DIMENSIONS;z++) {
            plane(x,z);
        }
    }
}

function updateMesh() {
    generateTerrainMesh();
    terrainGeometry.setIndex(indices);
    terrainGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
}

const terrainGeometry = new THREE.BufferGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );

material.wireframe = true;

const terrain = new THREE.Mesh( terrainGeometry, material );

const light = new THREE.Light(0xFFFFFF, 5.0);

terrain.position.z = -DIMENSIONS/2;
terrain.position.x = -DIMENSIONS/2;
camera.position.y = DIMENSIONS/2;
camera.position.z = DIMENSIONS;

let pivotRotationXSpeed = 0;

let pivot = new THREE.Group();

scene.add(pivot);
pivot.add(terrain);

camera.lookAt(pivot.position);

let currentXRotation = 0;

function animate() {
    let deltaTime = clock.getDelta();
    pivot.rotateY(pivotRotationXSpeed * deltaTime);
    pivotRotationXSpeed += 0.05 * mouse.deltaX;
    pivotRotationXSpeed *= 0.92;
    noiseX = noiseX + noiseXSpeed;
    noiseY = noiseY + noiseYSpeed;
    time += deltaTime;
	requestAnimationFrame( animate );
    updateMesh();
	renderer.render( scene, camera );
}
animate();

//HTML elements
let frequencySlider;
let heightSlider;
let xPosSlider;
let yPosSlider;

document.addEventListener('DOMContentLoaded', () => {

    let dropdown = document.getElementById('dropdown');

    frequencySlider = document.getElementById("frequency");
    heightSlider = document.getElementById("height");
    xPosSlider = document.getElementById("xPos");
    yPosSlider = document.getElementById("yPos");

    freqOut = document.getElementById("freqOut");
    depthOut = document.getElementById("depthOut");
    xOut = document.getElementById("xOut");
    yOut = document.getElementById("yOut");

    dropdown.addEventListener('change', e => {
        if(dropdown.value = "3D") window.location.href = "noise3D";
    })

    frequencySlider.addEventListener('input',e => {
        noiseFreq = frequencySlider.value;
        freqOut.innerHTML = noiseFreq
    });

    heightSlider.addEventListener('input',e => {
        noiseHeight = heightSlider.value;
        depthOut.innerHTML = noiseHeight;
    });

    xPosSlider.addEventListener('input',e=> {
        noiseXSpeed = parseFloat(xPosSlider.value);
        xOut.innerHTML = noiseXSpeed;
    })

    yPosSlider.addEventListener('input',e=> {
        noiseYSpeed = parseFloat(yPosSlider.value);
        yOut.innerHTML = noiseYSpeed;
    })
})