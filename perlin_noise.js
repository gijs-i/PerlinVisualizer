// Perlin Noise algorithm made for my PWS
// Amount of permutations
const PERMUTATIONS = 256;

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

class Vector3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    dot(vector) {
        return this.x*vector.x + this.y*vector.y + this.z*vector.z;
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

function generateGradient3(permutation) {
    let p = permutation % 8;
    switch(p) {
        case 0:
            return new Vector3(1,1,1);
        case 1:
            return new Vector3(-1,1,1);
        case 2:
            return new Vector3(-1,-1,1);
        case 3:
            return new Vector3(1,-1,1);
        case 4:
            return new Vector3(1,1,-1);
        case 5:
            return new Vector3(-1,1,-1);
        case 6:
            return new Vector3(-1,-1,-1);
        case 7:
            return new Vector3(1,-1,-1);
    }
}

function noise2D(x,y) {
    // Generate vector gradients for each of the four corners, make x absolute to support negative noise values in the visualizer
    let X = Math.floor(Math.abs(x)) % PERMUTATIONS;
    let Y = Math.floor(Math.abs(y)) % PERMUTATIONS;

    let topLeftGradient = generateGradient(permutationTable[permutationTable[X] + Y + 1]);
    let topRightGradient = generateGradient(permutationTable[permutationTable[X + 1] + Y + 1]);
    let bottomLeftGradient = generateGradient(permutationTable[permutationTable[X] + Y]);
    let bottomRightGradient = generateGradient(permutationTable[permutationTable[X + 1] + Y]);

    // Calculate the decimals of x and y in [0,1], also accounting for negative noise values
    let normalizedX = x >= 0 ? x - Math.floor(x) : Math.ceil(x) - x;
    let normalizedY = y >= 0 ? y - Math.floor(y) : Math.ceil(y) - y;

    // Calculate vectors pointing to (x,y)
    let vectorTopLeft = new Vector(normalizedX, normalizedY - 1);
    let vectorTopRight = new Vector(normalizedX - 1, normalizedY - 1);
    let vectorBottomLeft = new Vector(normalizedX, normalizedY);
    let vectorBottomRight = new Vector(normalizedX - 1, normalizedY);

    // Calculate the dot product of the pointing vector and gradient vector
    let topLeftValue = vectorTopLeft.dot(topLeftGradient);
    let topRightValue = vectorTopRight.dot(topRightGradient);
    let bottomLeftValue = vectorBottomLeft.dot(bottomLeftGradient);
    let bottomRightValue = vectorBottomRight.dot(bottomRightGradient);

    // Calculate both the top and bottom values
    let topValue = interpolate(topLeftValue,topRightValue,normalizedX);
    let bottomValue = interpolate(bottomLeftValue,bottomRightValue,normalizedX);
    
    // Return the final interpolation between the top and bottom values
    return interpolate(bottomValue,topValue,normalizedY);
}

function noise3D(x,y,z) {
    // Make sure x,y,z fit in the array
    let X = Math.floor(x) % PERMUTATIONS;
    let Y = Math.floor(y) % PERMUTATIONS;
    let Z = Math.floor(z) % PERMUTATIONS;

    // Generate gradients for the lower z-axis
    let lowerTopLeftGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X] + Y + 1] + Z]);
    let lowerTopRightGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X + 1] + Y + 1] + Z]);
    let lowerBottomLeftGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X] + Y] + Z]);
    let lowerBottomRightGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X + 1] + Y] + Z]);

    // Generate gradients for the upper z-axis
    let upperTopLeftGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X] + Y + 1] + Z + 1]);
    let upperTopRightGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X + 1] + Y + 1] + Z + 1]);
    let upperBottomLeftGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X] + Y] + Z + 1]);
    let upperBottomRightGradient = generateGradient3(permutationTable[permutationTable[permutationTable[X + 1] + Y] + Z + 1]);

    // Calculate the decimals of x,y,z in [0,1]
    let normalizedX = x - Math.floor(x);
    let normalizedY = y - Math.floor(y);
    let normalizedZ = z - Math.floor(z);

    // Calculate vectors pointing to (x,y,z) on the lower z-axis
    let vectorLowerTopLeft = new Vector(normalizedX, normalizedY - 1, normalizedZ);
    let vectorLowerTopRight = new Vector(normalizedX - 1, normalizedY - 1, normalizedZ);
    let vectorLowerBottomLeft = new Vector(normalizedX, normalizedY, normalizedZ);
    let vectorLowerBottomRight = new Vector(normalizedX - 1, normalizedY, normalizedZ);

    // Calculate vectors pointing to (x,y,z) on the upper z-axis
    let vectorUpperTopLeft = new Vector(normalizedX, normalizedY - 1, normalizedZ - 1);
    let vectorUpperTopRight = new Vector(normalizedX - 1, normalizedY - 1, normalizedZ - 1);
    let vectorUpperBottomLeft = new Vector(normalizedX, normalizedY, normalizedZ - 1);
    let vectorUpperBottomRight = new Vector(normalizedX - 1, normalizedY, normalizedZ - 1);

    // Dot product on the lower z-axis
    let lowerTopLeftValue = vectorLowerTopLeft.dot(lowerTopLeftGradient);
    let lowerTopRightValue = vectorLowerTopRight.dot(lowerTopRightGradient);
    let lowerBottomLeftValue = vectorLowerBottomLeft.dot(lowerBottomLeftGradient);
    let lowerBottomRightValue = vectorLowerBottomRight.dot(lowerBottomRightGradient);

    // Dot product on the upper z-axis
    let upperTopLeftValue = vectorUpperTopLeft.dot(upperTopLeftGradient);
    let upperTopRightValue = vectorUpperTopRight.dot(upperTopRightGradient);
    let upperBottomLeftValue = vectorUpperBottomLeft.dot(upperBottomLeftGradient);
    let upperBottomRightValue = vectorUpperBottomRight.dot(upperBottomRightGradient);

    let lowerTopValue = interpolate(lowerTopLeftValue,lowerTopRightValue,normalizedX);
    let lowerBottomValue = interpolate(lowerBottomLeftValue,lowerBottomRightValue,normalizedX);
    let lowerValue = interpolate(lowerBottomValue,lowerTopValue,normalizedY);

    let upperTopValue = interpolate(upperTopLeftValue,upperTopRightValue,normalizedX);
    let upperBottomValue = interpolate(upperBottomLeftValue,upperBottomRightValue,normalizedX);
    let upperValue = interpolate(upperBottomValue,upperTopValue,normalizedY);

    return interpolate(lowerValue,upperValue,normalizedZ);
}