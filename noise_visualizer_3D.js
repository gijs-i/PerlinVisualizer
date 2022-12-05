// (c) gijs.i
// Gemaakt behulp van THREE.js

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerWidth, 0.1, 1000 );
const clock = new THREE.Clock();

const canvasSize = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( canvasSize,canvasSize );
document.body.appendChild( renderer.domElement );
createMouseEventListeners(renderer.domElement);

let noiseDimensions = 128;

let time = 0;

let noiseFreq = 0.025;
let noiseThreshhold = 0.28;
let noiseX = 0.0;
let noiseY = 0.0;

let noiseXSpeed = 0.0;
let noiseYSpeed = 0.0;
let rotationSpeed = 0;

let vertices = [];
let indices = [];
let normals = [];
let voxels = new Uint8Array(noiseDimensions*noiseDimensions*noiseDimensions);

let index = 0;

function setVoxel(x,y,z,value) {
    voxels[x + y*noiseDimensions + z*noiseDimensions*noiseDimensions] = value;
}

function getVoxel(x,y,z) {
    if(x < 0 || x >= noiseDimensions || y < 0 || y >= noiseDimensions || z < 0 || z >= noiseDimensions) return 0;
    return voxels[x + y*noiseDimensions + z*noiseDimensions*noiseDimensions];
}

function generateVoxels() {
    voxels = new Uint8Array(noiseDimensions*noiseDimensions*noiseDimensions);
    for(let x = 0;x < noiseDimensions;x++) {
        for(let y = 0;y < noiseDimensions;y++) {
            for(let z = 0;z < noiseDimensions;z++) {
                if(noise3D(x*noiseFreq,y*noiseFreq,z*noiseFreq) <= (noiseThreshhold-0.5)) setVoxel(x,y,z,1);
            }
        }
    }
}

function bottomPlane(x,y,z) {
    vertices.push(x + 0.0, y, z + 0.0);
    vertices.push(x + 1.0, y, z + 0.0);
    vertices.push(x + 1.0, y, z - 1.0);
    vertices.push(x + 0.0, y, z - 1.0);

    indices.push(index * 4);
    indices.push(index * 4 + 1);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 3);
    indices.push(index * 4);

    normals.push(0.0,-1.0,0.0);
    normals.push(0.0,-1.0,0.0);
    normals.push(0.0,-1.0,0.0);
    normals.push(0.0,-1.0,0.0);

    index++;
}

function topPlane(x,y,z) {
    vertices.push(x + 0.0, y+1, z + 0.0);
    vertices.push(x + 1.0, y+1, z + 0.0);
    vertices.push(x + 1.0, y+1, z - 1.0);
    vertices.push(x + 0.0, y+1, z - 1.0);

    indices.push(index * 4);
    indices.push(index * 4 + 3);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 1);
    indices.push(index * 4);

    normals.push(0.0,1.0,0.0)
    normals.push(0.0,1.0,0.0)
    normals.push(0.0,1.0,0.0)
    normals.push(0.0,1.0,0.0)

    index++;
}

function rightPlane(x,y,z) {
    vertices.push(x+1, y, z + 0.0);
    vertices.push(x+1, y, z - 1.0);
    vertices.push(x+1, y + 1.0, z - 1.0);
    vertices.push(x+1, y + 1.0, z);

    indices.push(index * 4);
    indices.push(index * 4 + 3);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 1);
    indices.push(index * 4);

    normals.push(1.0,0.0,0.0);
    normals.push(1.0,0.0,0.0);
    normals.push(1.0,0.0,0.0);
    normals.push(1.0,0.0,0.0);

    index++;
}

function leftPlane(x,y,z) {
    vertices.push(x, y, z - 1.0);
    vertices.push(x, y, z + 0.0);
    vertices.push(x, y + 1.0, z);
    vertices.push(x, y + 1.0, z - 1.0);

    indices.push(index * 4);
    indices.push(index * 4 + 3);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 1);
    indices.push(index * 4);

    normals.push(-1.0,0.0,0.0);
    normals.push(-1.0,0.0,0.0);
    normals.push(-1.0,0.0,0.0);
    normals.push(-1.0,0.0,0.0);

    index++;
}

function frontPlane(x,y,z) {
    vertices.push(x+1, y, z-1);
    vertices.push(x, y, z-1);
    vertices.push(x, y + 1.0, z-1);
    vertices.push(x+1, y + 1.0, z-1);

    indices.push(index * 4);
    indices.push(index * 4 + 3);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 1);
    indices.push(index * 4);

    normals.push(0.0,0.0,-1.0);
    normals.push(0.0,0.0,-1.0);
    normals.push(0.0,0.0,-1.0);
    normals.push(0.0,0.0,-1.0);

    index++;
}
function backPlane(x,y,z) {
    vertices.push(x, y, z);
    vertices.push(x+1, y, z);
    vertices.push(x+1, y + 1.0, z);
    vertices.push(x, y + 1.0, z);

    indices.push(index * 4);
    indices.push(index * 4 + 3);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 2);
    indices.push(index * 4 + 1);
    indices.push(index * 4);
    
    normals.push(0.0,0.0,1.0)
    normals.push(0.0,0.0,1.0)
    normals.push(0.0,0.0,1.0)
    normals.push(0.0,0.0,1.0)

    index++;
}

function generateTerrainMesh() {
    vertices = [];
    indices = [];
    normals = [];
    index = 0;
    for(let x = 0;x < noiseDimensions;x++) {
        for(let y = 0;y < noiseDimensions;y++) {
            for(let z = 0;z < noiseDimensions;z++) {
                if(getVoxel(x,y,z)==0) continue;
                let airTop = getVoxel(x,y+1,z) == 0;
                let airBottom = getVoxel(x,y-1,z) == 0;
                let airLeft = getVoxel(x-1,y,z) == 0;
                let airRight = getVoxel(x+1,y,z) == 0;
                let airFront = getVoxel(x,y,z-1) == 0;
                let airBack = getVoxel(x,y,z+1) == 0;
                if(airTop) topPlane(x,y,z);
                if(airBottom) bottomPlane(x,y,z);
                if(airLeft) leftPlane(x,y,z);
                if(airRight) rightPlane(x,y,z);
                if(airFront) frontPlane(x,y,z);
                if(airBack) backPlane(x,y,z);
            }
        }
    }
}

function updateMesh() {
    generateTerrainMesh();
    terrainGeometry.setIndex(indices);
    terrainGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    terrainGeometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
    terrain.position.z = -noiseDimensions/2;
    terrain.position.y = -noiseDimensions/2;
    terrain.position.x = -noiseDimensions/2;
    camera.position.y = 0;
    camera.position.z = noiseDimensions*1.4;
}

const terrainGeometry = new THREE.BufferGeometry();
const material = new THREE.MeshPhongMaterial( {
    color: 0xa9a6ff, vertexColors: false, side: THREE.DoubleSide 
} );
//material.wireframe = true;

const terrain = new THREE.Mesh( terrainGeometry, material );

let pivotRotationXSpeed = 0;
let pivotRotationYSpeed = 0;

let pivot = new THREE.Group();

scene.add(pivot);
pivot.add(terrain);

const light1 = new THREE.PointLight( 0xf2a6ff, 1.0 );
light1.position.set( 0,noiseDimensions,0 );
scene.add( light1 );

const light2 = new THREE.AmbientLight(0x424242);
scene.add(light2);

camera.lookAt(pivot.position);

let pivotRotation = 0;

function animate() {
    let deltaTime = clock.getDelta();
    pivot.rotateY(pivotRotationXSpeed * deltaTime);
    pivot.rotateX(Math.cos(pivotRotation)*pivotRotationYSpeed * deltaTime);
    pivot.rotateZ(Math.sin(pivotRotation)*pivotRotationYSpeed * deltaTime);
    pivotRotation += pivotRotationXSpeed * deltaTime
    pivotRotationXSpeed += 0.05 * mouse.deltaX;
    pivotRotationXSpeed *= 0.92;
    pivotRotationYSpeed += 0.05 * mouse.deltaY;
    pivotRotationYSpeed *= 0.92;
    noiseX = noiseX + noiseXSpeed;
    noiseY = noiseY + noiseYSpeed;
    time += deltaTime;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
generateVoxels();
updateMesh();
animate();

//HTML elements
let frequencySlider;
let heightSlider;
let xPosSlider;
let yPosSlider;

document.addEventListener('DOMContentLoaded', () => {

    let loadingElement = document.getElementById('loading');

    let dropdown = document.getElementById('dropdown');

    let sliders = {
        frequencySlider: document.getElementById("frequency"),
        threshholdSlider: document.getElementById("threshhold"),
        dimensionsSlider: document.getElementById("dimensions")
    }

    freqOut = document.getElementById("freqOut");
    threshholdOut = document.getElementById("threshholdOut");
    dimensionsOut = document.getElementById("dimensionsOut");

    dropdown.addEventListener('change', e => {
        if(dropdown.value = "2D") window.location.href = "noise2D";
    })

    sliders.frequencySlider.addEventListener('input',e => {
        noiseFreq = parseFloat(sliders.frequencySlider.value);
        freqOut.innerHTML = noiseFreq
    });

    sliders.threshholdSlider.addEventListener('input',e => {
        noiseThreshhold = parseFloat(sliders.threshholdSlider.value);
        threshholdOut.innerHTML = Math.floor(noiseThreshhold*100) + "%";
    });

    sliders.dimensionsSlider.addEventListener('input',e=> {
        noiseDimensions = parseInt(sliders.dimensionsSlider.value);
        dimensionsOut.innerHTML = noiseDimensions;
    })

    for(const [key,value] of Object.entries(sliders)) {
        value.addEventListener('mouseup', (e) => {
            generateVoxels();
            updateMesh();
        });

        value.addEventListener('touchend', (e) => {
            generateVoxels();
            updateMesh();
        });
    }
})