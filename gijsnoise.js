//Needs to be replaced with my own random number generator. Math.random() doesn't support seeds.
let seed = Math.random();

//Create an a*b matrix with random values between 0 and 1
let noiseMatrix = [];
for(let y = 0;y < 128;y++) {
    noiseMatrix[y] = [];
    for(let x = 0;x < 128;x++) {
        noiseMatrix[y][x] = Math.random();
    }
}

//Get a value from the noise matrix.
function getNoiseMatrixValue(x,y) {
    if(x < 0 || x > noiseMatrix[0].length || y < 0 || y > noiseMatrix.length) return 0;
    return noiseMatrix[x][y];
}

//Return a value between 0 and 1 based on x, corresponding to the smootherstep function (a smoothstep function on the second degree S2(x))
function smootherstep(x) {
    if(x < 0) return 0;
    if(x > 1) return 1;
    return x * x * x * (x * (x * 6 - 15) + 10);
}

//Interpolate between values a and b using the smootherstep function
function interpolate(a,b,x) {
    return a + (b - a) * smootherstep(x);
}


//1D noise function
function noise(x) {
    //Get the first y value from the noise matrix using the left side of the noise grid
    let y1 = getNoiseMatrixValue(0,
        Math.floor(x)
    )

    //Get the second y value from the noise matrix using the right side of the noise grid
    let y2 = getNoiseMatrixValue(0,
        Math.floor(x) + 1
    )

    //Normalize x to make sure it is between 0 and 1
    let normalizedX = x - Math.floor(x);

    return interpolate(y1,y2,normalizedX);
}

function noise2D(x,y) {
    //Top left y-value
    let yTopLeft = getNoiseMatrixValue(
        Math.floor(y),
        Math.floor(x)
    );

    //Top right y-value
    let yTopRight = getNoiseMatrixValue(
        Math.floor(y),
        Math.floor(x) + 1
    )

    //Bottom left y-value
    let yBottomLeft = getNoiseMatrixValue(
        Math.floor(y) + 1,
        Math.floor(x)
    );

    //Bottom right y-value
    let yBottomRight = getNoiseMatrixValue(
        Math.floor(y) + 1,
        Math.floor(x) + 1
    )

    //Normalize x and y to stay on a range from 0 to 1
    let normalizedX = x - Math.floor(x);
    let normalizedY = y - Math.floor(y);

    //Interpolate the 4 y values on the x-axis
    let y1 = interpolate(yTopLeft,yTopRight,normalizedX);
    let y2 = interpolate(yBottomLeft,yBottomRight,normalizedX);

    //Return the final interpolated value on the y-axis
    return interpolate(y1,y2,normalizedY);
}