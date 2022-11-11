// Handle touch events
const mouse = {
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false
}

function handleMouseStart(mouseEvent) {
    mouse.oldX = mouseEvent.clientX;
    mouse.oldY = mouseEvent.clientY;
    mouse.x = mouseEvent.clientX;
    mouse.y = mouseEvent.clientY;
    mouse.deltaX = 0;
    mouse.deltaY = 0;
    mouse.down = true;
}

function handleMouseMove(mouseEvent) {
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = mouseEvent.clientX;
    mouse.y = mouseEvent.clientY;
    mouse.deltaX = mouse.x - mouse.oldX;
    mouse.deltaY = mouse.y - mouse.oldY;
}

function handleMouseUp() {
    mouse.down = false;
    mouse.deltaX = 0;
    mouse.deltaY = 0;
}

function createMouseEventListeners(domElement) {
    domElement.addEventListener('touchstart', (ev) => {
        ev.preventDefault();
        let currentTouch = ev.targetTouches[0];
        handleMouseStart(currentTouch);
    })
    
    domElement.addEventListener('touchmove', (ev) => {
        let currentTouch = ev.targetTouches[0];
        handleMouseMove(currentTouch);
    })
    
    domElement.addEventListener('touchcancel', (ev) => {
        handleMouseUp();
    })
    
    domElement.addEventListener('touchend', (ev) => {
        handleMouseUp();
    })

    domElement.addEventListener('mousedown', (ev) => {
        handleMouseStart(ev);
    })

    domElement.addEventListener('mousemove', (ev) => {
        if(mouse.down) {
            handleMouseMove(ev);
        }
    })

    document.body.addEventListener('mouseup', (ev) => {
        handleMouseUp();
    })
}