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
let canvasWidth = 800;
let canvasHeight = 600;
const cageActiveTime = 1;

let rightClicking = false;
let rightClickPosition = [0, 0]
let deleting = false;
let curCage = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

let cursorIcon;
let folderIcon

function setup() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault())

    let button = createButton('connect');
    button.position(0, height);
    button.mousePressed(connectToParty);
    cursorIcon = loadImage("icons/cursoricon.svg")
    folderIcon = loadImage("icons/foldericon.svg")
    noCursor()
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
            shared.cageActive = false;
        }
    }

    if(!partyIsHost() && shared.cageActive) {
        drawCage()
    }
    
}

function drawCage() {
    push();
    stroke(255);
    fill(155, 255, 255, 50);
    rect(shared.cage[0], shared.cage[1], shared.cage[2], shared.cage[3]);
    pop();
}
function startGame() {
    shared.gameStarted = true;
}

function drawRightClickMenu() {
    push()
        fill(255, 0, 0, 255)
        stroke(255)
        rect(rightClickPosition[0], rightClickPosition[1], 20, 20);
    pop()
}

function hostDraw()
{
    updateSharedCursorPos();
    
    if (drawingRectangle)
    {
        push();
        fill(255, 255, 255, 10);
        stroke(255);
        rect(rectOrigin[0], rectOrigin[1], curRectX, curRectY);
        updateSharedRectanglePos()
        pop();
    }
    if(rightClicking) {
        drawRightClickMenu();
    }
}

function updateSharedRectanglePos() {
    shared.rectanglePosition = [rectOrigin[0], rectOrigin[1], curRectX, curRectY]
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
            let currentUserRole = parseInt(guests[i].role_keeper.role); 
            let currentUserPosition = shared.filePositions[currentUserRole]
            if(connected && partyIsHost()) {
                
                if((abs(currentUserPosition[0] - rectOrigin[0]) < abs(curCage.width)) && (abs(currentUserPosition[1] - rectOrigin[1]) < abs(curCage.height)) && cageActive) {
                    
                    shared.selectedUsers[currentUserRole] = true
                    if(deleting) {
                        shared.deletedUsers[currentUserRole] = true
                    }
                } else {
                    shared.selectedUsers[currentUserRole] = false
                }

            }
            push()
            if(shared.selectedUsers[currentUserRole]) {
                //fill(255, 0, 0, 255)
                tint('red')

            } else {
                //fill(255, 255, 0, 255)
                tint('green')

            }
            imageMode(CENTER);

            if(!shared.deletedUsers[currentUserRole]) {
                //circle(currentUserPosition[0], currentUserPosition[1], 20);

                image(folderIcon, currentUserPosition[0], currentUserPosition[1], 20, 20)
            }
            pop()
        } catch
        {
            
        }
        deleting = false;
    }
}

function drawCursor()
{
    // TODO replace circle with cursor
    //circle(shared.cursorPosition[0], shared.cursorPosition[1], 10);
    image(cursorIcon, shared.cursorPosition[0], shared.cursorPosition[1], 20, 20)
}

function createCage()
{
    curCage.x = rectOrigin[0];
    curCage.y = rectOrigin[1];
    curCage.width = curRectX;
    curCage.height = curRectY;
    cageActive = true;
    cageTimer = 0;

    shared.cage = [curCage.x, curCage.y, curCage.width, curCage.height]
    shared.cageActive = true
}