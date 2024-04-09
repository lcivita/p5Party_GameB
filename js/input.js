function updateMyPos()
{
    let data = [parseInt(me.role_keeper.role), playerPos[0], playerPos[1]];
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
    
    return input;
}

function mousePressed()
{
    if (partyIsHost())
    {
        rectOrigin = [mouseX, mouseY];
        drawingRectangle = true;
    }
}

function mouseDragged() {
    if (drawingRectangle) {
        curRectX = mouseX - rectOrigin[0];
        curRectY = mouseY - rectOrigin[1];
    }
}

function mouseReleased()
{
    if (partyIsHost())
    {
        drawingRectangle = false;
        rectOffset = [0,0];
        curRectX = 0;
        curRectY = 0;
    }
}