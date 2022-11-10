// (c) gijs.i
// Gemaakt behulp van THREE.js

//noise.seed(Math.random());

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerHeight / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerHeight,window.innerHeight );
document.body.appendChild( renderer.domElement );

const DIMENSIONS = 50;

let noiseFreq = 0.1;
let noiseHeight = 1.0;
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
    for(let x = 0;x < DIMENSIONS;x++) {
        for(let z = 0;z < DIMENSIONS;z++) {
            plane(x,z,noiseFreq,noiseHeight);
        }
    }
}

function updateMesh() {
    generateTerrainMesh();
    terrainGeometry.setIndex(indices);
    terrainGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
}

function updateValues() {
    noiseFreq = frequencySlider.value;
    noiseHeight = heightSlider.value;
    noiseXSpeed = parseFloat(xPosSlider.value);
    noiseYSpeed = parseFloat(yPosSlider.value);
    rotationSpeed = rotationSlider.value;
}

const terrainGeometry = new THREE.BufferGeometry();

const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

material.wireframe = true;

const terrain = new THREE.Mesh( terrainGeometry, material );

scene.add(terrain)

camera.position.z = 7;
camera.position.y = 2;

function animate() {
    terrain.rotateY(rotationSpeed * clock.getDelta());
    noiseX = noiseX + noiseXSpeed;
    noiseY = noiseY + noiseYSpeed;
	requestAnimationFrame( animate );
    updateMesh();
	renderer.render( scene, camera );
}
animate();

updateMesh();