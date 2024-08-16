function createCircle(x, y, radius, color, ctx) {
    return {
        x,
        y,
        radius,
        color,
        ctx,
        speedX: 0,
        speedY: 0,
        accelerationX: 0,
        accelerationY: 0,
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedX*=0.993;
            this.speedY*=0.993;
            this.speedX += this.accelerationX;
            this.speedY += this.accelerationY;
        },
        draw() {
            const { ctx, color, x, y, radius } = this;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    };
}
function createRectangle(x, y, width, height, color, ctx) {
    return {
        x,
        y,
        width,
        height,
        color,
        ctx,
        draw() {
            const { ctx, color, x, y, width, height } = this;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
        }
    };
}

function createStickLine(firstObject, secondObject, color, size, ctx) {
    return {
        firstObject,
        secondObject,
        color,
        ctx,
        size,
        draw() {
            const { ctx, color, firstObject, secondObject, size } = this;
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(firstObject.x+firstObject.width/2, firstObject.y+firstObject.height/2);
            ctx.lineTo(secondObject.x, secondObject.y);
            ctx.closePath();
            ctx.stroke();
        }
    };
}

function createSpring(firstObject, secondObject, color, size, ctx) {
    let stickyLine = createStickLine(firstObject, secondObject, color, size, ctx);
    return {
        firstObject,
        secondObject,
        color,
        ctx,
        size,
        K: 0.0005,
        stickyLine,
        update() {
            let dx = this.secondObject.x - this.firstObject.x;
            let dy = this.secondObject.y - this.firstObject.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let force = this.K * (distance-100);
            this.secondObject.accelerationX -= (force * (dx / distance));
            this.secondObject.accelerationY -= (force * (dy / distance));
        },
        draw() {
            this.stickyLine.draw();
        }
    };
}

// create a template for objects in the game
function loadGame(){
    var canvas = document.getElementById("canvas1");
    var ctx = canvas.getContext("2d");
    let sceneObjects = [];
    let g = 9.81;
    let springs = [];
    // create a rectangle as a box in the center of the screen with color black
    let circle = createCircle(canvas.width/2, canvas.height/2+100, 15, "red", ctx);
    // circle.speedX = 3;
    for(let i = 0; i < 0; i++){
        for(let j = 0; j < 1; j++){ 
            let rectangle = createRectangle(canvas.width/2+(i*300)-175, 100+(j*50), 25, 25, "black", ctx);
            let spring = createSpring(rectangle, circle, "black", 2, ctx);
            sceneObjects.push(rectangle);
            sceneObjects.push(spring);
            springs.push(spring);
        }
    }

    sceneObjects.push(circle);
    console.log(sceneObjects);

    function drawCanvasBorders(){
        ctx.fillStyle = "white";
        // add border to canvas
        ctx.strokeRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "black";
        ctx.rect(0,0,canvas.width,canvas.height);
    }

    function updateBall(){
        circle.accelerationX = 0;
        circle.accelerationY = 0;

        // iterage over the springs
        for(let i = 0; i < springs.length; i++){
            springs[i].update();
            springs[i].draw();
        } 
        // circle.accelerationY+=0.1;
        if(circle.x >= 1300)
            circle.speedX *= circle.speedX > 0 ? -1 : 1;
        if(circle.x <= 0)
            circle.speedX *= circle.speedX > 0 ? 1 : -1;
        if(circle.y >= 800)
            circle.speedY *= circle.speedY > 0 ? -1 : 1;
        if(circle.y <= 0)
            circle.speedY *= circle.speedY > 0 ? 1 : -1;
        
        
        circle.update();
        circle.draw();
    }

    function drawSceneObjects(){
        for(let i = 0; i < sceneObjects.length; i++){
            if(typeof sceneObjects[i].draw === "function"){
                sceneObjects[i].draw();
            }
        }
    }
    

    function updateScene(){
        clearScene();
        drawCanvasBorders();
        for(let i = 0; i < sceneObjects.length; i++){
            if (typeof sceneObjects[i].accelerationX === "number") {
              sceneObjects[i].accelerationX = 0;
              sceneObjects[i].accelerationY = 0;
            }
        }
        updateBall();
        drawSceneObjects();  
        requestAnimationFrame(updateScene); 
    }

    function clearScene(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }
    window.onclick = (e) => {
        let mouseX = e.x - 9;
        let mouseY = e.y - 9;
        let rectangle = createRectangle(mouseX-12, mouseY-12, 25, 25, "black", ctx);
        let spring = createSpring(rectangle, circle, "black", 2, ctx);
        sceneObjects.push(rectangle);
        sceneObjects.push(spring);
        springs.push(spring);
    }
    updateScene();
    // setInterval(updateScene, 1);
}
window.onload = loadGame;