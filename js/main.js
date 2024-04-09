let playerPos = [0,0];
let lastPlayerPos = [0,0];

const fileMoveSpeed = 200;

let maxGuestsLength = 0;

let drawingRectangle = false;
let rectOrigin = [0,0];
// let rectOffset = [0,0];
let curRectX = 0;
let curRectY = 0;

let cageActive = false;
let cageTimer = 0;
const cageActiveTime = 1;
let curCage = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

function setup() {
    createCanvas(800, 600);

    let button = createButton('connect');
    button.position(0, height);
    button.mousePressed(connectToParty);
    
    ellipseMode(CENTER);
}

function draw() {
    background(0);
    
    if (!connected) {
        return;
    }
    
    if (!shared.gameStarted)
    {
        return;
    }
    
    if (guests.length > maxGuestsLength) {
        maxGuestsLength = guests.length;
    }
    
    if (partyIsHost())
    {
        hostDraw();
    }
    else
    {
        clientDraw();
    }

    drawAllFiles();
    drawCursor();
    
    if (cageActive)
    {
        cageTimer += deltaTime / 1000;
        
        push();
        stroke(255);
        fill(255, 255, 255, 50);
        rect(curCage.x, curCage.y, curCage.width, curCage.height);
        pop();
        
        if (cageTimer >= cageActiveTime)
        {
            cageActive = false;
            cageTimer = 0;
        }
    }
    
}

function startGame() {
    shared.gameStarted = true;
}

function hostDraw()
{
    updateSharedCursorPos();
    
    if (drawingRectangle)
    {
        push();
        fill(255, 255, 255, 50);
        stroke(255);
        rect(rectOrigin[0], rectOrigin[1], curRectX, curRectY);
        pop();
    }
}

function updateSharedCursorPos()
{
    shared.cursorPosition = [mouseX, mouseY];
}

function updateSharedFilePos(data)
{
    shared.filePositions[data[0]] = [data[1], data[2]];
}

function clientDraw()
{
    for (let i = 0; i < 2; i++) {
        playerPos[i] += moveInput()[i] * deltaTime * fileMoveSpeed / 1000;
    }
    
    if (lastPlayerPos[0] !== playerPos[0] || lastPlayerPos[1] !== playerPos[1]) 
    {
        updateMyPos();
    }

    lastPlayerPos = playerPos.slice();
}


function drawAllFiles()
{
    for (let i = 1; i < maxGuestsLength; i++)
    {
        // TODO replace circle with file icon. Make array and have your file type be linked to your role
        try
        {
            circle(shared.filePositions[parseInt(guests[i].role_keeper.role)][0], shared.filePositions[parseInt(guests[i].role_keeper.role)][1], 20);
        } catch
        {
            
        }
    }
}

function drawCursor()
{
    // TODO replace circle with cursor
    circle(shared.cursorPosition[0], shared.cursorPosition[1], 10);
}

function createCage()
{
    curCage.x = rectOrigin[0];
    curCage.y = rectOrigin[1];
    curCage.width = curRectX;
    curCage.height = curRectY;
    cageActive = true;
    cageTimer = 0;
}