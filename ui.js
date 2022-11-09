const checkboxes = document.getElementsByClassName("checkbox");

let frequencySlider;
let heightSlider;
let xPosSlider;
let yPosSlider;
let rotationSlider;

function toggleCheckbox(checkbox,animation) {
    checkbox.classList.toggle("enabled");
    if(checkbox.classList.contains("enabled")) {
        animation.playSegments([0,28],true);
    } else {
        animation.playSegments([28,48],true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    for(let i = 0;i < checkboxes.length;i++) {
        let checkbox = checkboxes[i];

        let animation = bodymovin.loadAnimation({
            container: checkbox,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'checkbox.json'
        });

        checkbox.addEventListener('click', e => {
            toggleCheckbox(checkbox,animation);
        })
    }

    frequencySlider = document.getElementById("frequency");
    heightSlider = document.getElementById("height");
    xPosSlider = document.getElementById("xPos");
    yPosSlider = document.getElementById("yPos");
    rotationSlider = document.getElementById("rotation");

    frequencySlider.addEventListener('input',e => {
        updateValues();
    });

    heightSlider.addEventListener('input',e => {
        updateValues();
    });

    xPosSlider.addEventListener('input',e=> {
        updateValues();
    })

    yPosSlider.addEventListener('input',e=> {
        updateValues();
    })

    rotationSlider.addEventListener('input',e=> {
        updateValues();
    })
})