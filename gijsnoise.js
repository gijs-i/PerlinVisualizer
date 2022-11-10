// Perlin Noise
// Amount of permutations
const PERMUTATIONS = 512;

permutationTable = generatePermutationTable();

// Vector class
class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    dot(vector) {
        return this.x*vector.x + this.y*vector.y;
    }
}

function generatePermutationTable() {
    let permutationTable = [];

    // Generate permutations [0,PERMUTATIONS]
    for(let i = 0; i < PERMUTATIONS;i++) {
        permutationTable[i] = i;
    }

    // Shuffle permutations
    permutationTable.sort(() => Math.random() - 0.5);

    for(let i = 0;i < PERMUTATIONS;i++) {
        permutationTable[PERMUTATIONS + i] = permutationTable[i];
    }
    return permutationTable;
}

// General smoothstep function
function smoothstep(x) {
    if(x <= 0) return 0;
    if(x >= 1) return 1;
    return x * x * x * (x * (x * 6 - 15) + 10);
}

// Final interpolation function
function interpolate(a,b,x) {
    return a + (b-a)*smoothstep(x);
}

// Return the corresponding gradient for a permutation
function generateGradient(permutation) {
    let p = permutation % 4;
    switch(p) {
        case 0:
            return new Vector(1,1);
        case 1:
            return new Vector(-1,1);
        case 2:
            return new Vector(-1,-1);
        case 3:
            return new Vector(1,-1);
    }
}

function noise2D(x,y) {
    // Generate vector gradients for each of the four corners

    let flooredX = Math.floor(x) % PERMUTATIONS;
    let flooredY = Math.floor(y) % PERMUTATIONS;

    let topLeftGradient = generateGradient(permutationTable[permutationTable[flooredX] + flooredY + 1]);
    let topRightGradient = generateGradient(permutationTable[permutationTable[flooredX + 1] + flooredY + 1]);
    let bottomLeftGradient = generateGradient(permutationTable[permutationTable[flooredX] + flooredY]);
    let bottomRightGradient = generateGradient(permutationTable[permutationTable[flooredX + 1] + flooredY]);

    // Calculate the decimals of x and y in [0,1]
    let normalizedX = x - Math.floor(x);
    let normalizedY = y - Math.floor(y);

    // Obtain vectors pointing to (x,y)
    let vectorTopLeft = new Vector(normalizedX, normalizedY - 1);
    let vectorTopRight = new Vector(normalizedX - 1, normalizedY - 1);
    let vectorBottomLeft = new Vector(normalizedX, normalizedY);
    let vectorBottomRight = new Vector(normalizedX - 1, normalizedY);

    // Calculate the dot product of the pointing vector and gradient vector
    let topLeftValue = vectorTopLeft.dot(topLeftGradient);
    let topRightValue = vectorTopRight.dot(topRightGradient);
    let bottomLeftValue = vectorBottomLeft.dot(bottomLeftGradient);
    let bottomRightValue = vectorBottomRight.dot(bottomRightGradient);

    // Obtain both the top and bottom values
    let topValue = interpolate(topLeftValue,topRightValue,normalizedX);
    let bottomValue = interpolate(bottomLeftValue,bottomRightValue,normalizedX);
    
    // Return the final interpolation between the top and bottom values
    return interpolate(bottomValue,topValue,normalizedY);
}