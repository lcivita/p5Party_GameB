function mod(n, m) {
    return ((n % m) + m) % m;
  }

function updateMyPos()
{
    let data = [parseInt(me.role_keeper.role), mod(playerPos[0], canvasWidth), mod(playerPos[1], canvasHeight)];
    partyEmit("filePosUpdate", data);
}

const W = 87;
const A = 65;
const S = 83;
const D = 68;

function moveInput()
{
    let input = [0,0];
    
    if (keyIsDown(W)) input[1]--; // UP
    if (keyIsDown(S)) input[1]++; // DOWN
    if (keyIsDown(D)) input[0]++; // RIGHT
    if (keyIsDown(A)) input[0]--; // LEFT

    // Normalize the input vector
    let magnitude = Math.sqrt(input[0] * input[0] + input[1] * input[1]);
    if (magnitude !== 0) {
        input[0] /= magnitude;
        input[1] /= magnitude;
    }
    
    if(keyIsDown(SHIFT)) {
        input[0] *= 5.0;
        input[1] *= 5.0;
    }

    return input;
}

function mousePressed()
{
    if(mouseButton === LEFT) {
        if(rightClicking == true) {
            if(Math.sqrt(Math.pow(mouseX - rightClickPosition[0],2) + Math.pow(mouseY - rightClickPosition[1], 2)) < 20) {
                deleting = true;
            } 
            rightClicking = false;
        }
    }
    if (partyIsHost() && !cageActive && mouseButton===LEFT)
    {
        rectOrigin = [mouseX, mouseY];
        drawingRectangle = true;
        console.log("drawing rectangle = " + drawingRectangle);
    }

    if (partyIsHost() && cageActive && mouseButton===RIGHT)
    {
        rightClicking = true;
        let randomAngle = Math.PI * 2 * Math.random()
        rightClickPosition = [mouseX + 100 * Math.cos(randomAngle), mouseY + 100 * sin(randomAngle)]
    }
}

function mouseDragged() {
    if (drawingRectangle) {
        curRectX = constrain(mouseX - rectOrigin[0], -width/3, width/3);
        curRectY = constrain(mouseY - rectOrigin[1], -width/3, width/3);
    }
}

function mouseReleased()
{
    if (partyIsHost() && drawingRectangle)
    {
        createCage();
        drawingRectangle = false;
        curRectX = 0;
        curRectY = 0;
    }
}