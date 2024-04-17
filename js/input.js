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
    let speed = 0.2;

    let boost = 2.0;
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

    input[0] *= speed;
    input[1] *= speed;

    
    if(keyIsDown(SHIFT) && millis() > shared.boostAvailable[parseInt(me.role_keeper.role)] + 5000) {


        
        input[0] *= boost;
        input[1] *= boost;
        /*
        if(millis() - shared.boostAvailable[parseInt(me.role_keeper.role)]  > 3000) {
            shared.boostAvailable[parseInt(me.role_keeper.role)] = millis()

        }
        */
    }


    return input;
}

function mousePressed()
{
    if (!connected) {
        return;
    }
    
    if(mouseButton === LEFT) {
        if(rightClicking == true) {
            /*
            if(Math.sqrt(Math.pow(mouseX - rightClickPosition[0],2) + Math.pow(mouseY - rightClickPosition[1], 2)) < 20) {
                deleting = true;
            } 
            */

            currentlyHovering = menuOptions[getHoveredOption(mouseX, mouseY)]
            if(currentlyHovering == "delete") {
                deleting = true;
            }
            rightClicking = false;
        }

        backgroundPositions = [0.25, 0.5, 0.75]
        if(!shared.gameStarted) {

            for(let i =0; i < 3; i++) {
                if((canvasWidth/5 > abs(canvasWidth * 0.25 * (i + 1) - mouseX)) && (canvasHeight/5 > abs(canvasHeight/2 - mouseY))) {
                    shared.backgroundImage = i
                }
            }

            if(abs(canvasWidth/2 - mouseX) < 100 && abs(canvasHeight/5 * 4-mouseY) < 10) {
                startGame()
            }
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
        randomizeMenuOrder();
        menuPos.x = mouseX;
        menuPos.y = mouseY;

        if(menuPos.x > canvasWidth * 4/5) {
            menuPos.x = canvasWidth * 4/5;
        }

        if(menuPos.y > canvasHeight * 3/5) {
            menuPos.y = canvasHeight * 3/5;
        }
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
    if (!connected) {
        return;
    }
    if (partyIsHost() && drawingRectangle)
    {
        createCage();
        drawingRectangle = false;
        curRectX = 0;
        curRectY = 0;
    }
}