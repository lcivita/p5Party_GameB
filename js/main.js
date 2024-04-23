let playerPos = [0,0];
let lastPlayerPos = [0,0];

const fileMoveSpeed = 80;

let maxGuestsLength = 0;

let drawingRectangle = false;
let rectOrigin = [0,0];
// let rectOffset = [0,0];
let curRectX = 0;
let curRectY = 0;

let cageActive = false;
let cageTimer = 0;
let subResolution = 7;
let canvasWidth = Math.round(800/subResolution);
let canvasHeight = Math.round(600/subResolution);
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
let folderIcon;
let fileIcon;

let backImages = []
let myColors = ["#e3a21a", "#00a300", "#7e3878", "#2d89ef", "#ffc40d", "#00aba9", "#99b433"];

let canvas;
let ctx;

function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());
    noSmooth();
    cursorIcon = loadImage("icons/cursoricon.svg")
    folderIcon = loadImage("icons/foldericon.svg")
    fileIcon = loadImage("imgs/file.png");


    backImage = loadImage("imgs/bg1.png")
    backImage2 = loadImage("imgs/bg2.png")
    backImage3 = loadImage("imgs/bg3.png")
    backImages = [backImage, backImage2, backImage3];
    noCursor();
    ellipseMode(CENTER);
}


function drawDesktop() {
    push();
    rect();
    pop();
}

function draw() {

    if (!connected) {
        background("#000000");
        // draw cursor before match starts
        image(cursorIcon, mouseX, mouseY, 3, 3);
        return;
    }
    
    
    if (!shared.gameStarted)
    {
        background("#222222");

        // draw cursor before match starts

        if(partyIsHost()) {

            
            for(let i = 0; i < 3; i++) {
                push()
                    if(shared.backgroundImage == i) {
                        rectMode(CENTER)
                        stroke(0, 255, 255)
                        rect(canvasWidth * 0.25 * (i + 1), canvasHeight/2, canvasWidth/5, canvasHeight/5)
                    }
                    imageMode(CENTER)
                    image(backImages[i], canvasWidth * 0.25 * (i + 1), canvasHeight/2, canvasWidth/5, canvasHeight/5)
                pop();
            }
            push();
            rectMode(CENTER);
            rect(canvasWidth/2, canvasHeight/5 * 4, 100, 10);
            textAlign(CENTER);
            textSize(5);
            text("start", canvasWidth/2,  canvasHeight/5 * 4);
            image(cursorIcon, mouseX, mouseY, 3, 3);
            pop();
        }

        return;
    }
    background("#006e6d");
    push()
        imageMode(CENTER)
        image(backImages[shared.backgroundImage], canvasWidth/2, canvasHeight/2, canvasWidth, canvasHeight)
    pop()

    if (guests.length > maxGuestsLength) {
        maxGuestsLength = guests.length;
    }

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


    drawAllFiles();
    drawCursor();

    if (partyIsHost())
    {
        hostDraw();
    }
    else
    {
        clientDraw();
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
    // push()
    //     fill(255, 0, 0, 255)
    //     stroke(255)
    //     rect(rightClickPosition[0], rightClickPosition[1], 20, 20);
    // pop()

    displayMenu(menuPos, hoveredOption);
}

function hostDraw()
{
    updateSharedCursorPos();
    
    drawFileBoost();

    boostEatenCheck();
    
    if (drawingRectangle)
    {
        push();
        fill(255, 255, 255, 10);
        stroke(255);
        rect(rectOrigin[0], rectOrigin[1], curRectX, curRectY);
        updateSharedRectanglePos();
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
    drawFileBoost();
    displayAvailableBoost();
    
    
    if (boosting && millis() > boostStartTime + boostLength) {
        boosting = false;
    }

    for (let i = 0; i < 2; i++) {
        playerPos[i] += moveInput()[i] * deltaTime * fileMoveSpeed / 1000;
    }
    
    if (lastPlayerPos[0] !== playerPos[0] || lastPlayerPos[1] !== playerPos[1]) 
    {
        updateMyPos();
    }

    lastPlayerPos = playerPos.slice();
    
    // console.log("boosts available = " + boostsAvailable);
}


function drawAllFiles()
{
    for (let i = 1; i < maxGuestsLength; i++)
    {
        // TODO replace circle with file icon. Make array and have your file type be linked to your role
        try
        {
            let currentUserRole = parseInt(guests[i].role_keeper.role); 
            let currentUserPosition = shared.filePositions[currentUserRole];

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
                tint('red')
            } else {
                tint(myColors[i])
            }

            imageMode(CENTER);

            if(!shared.deletedUsers[currentUserRole]) {
                image(folderIcon, currentUserPosition[0], currentUserPosition[1], 4, 4)
            }
            pop()
        } catch
        {
            
        }
    }
    deleting = false;

}

function drawCursor()
{
    // TODO replace circle with cursor
    //circle(shared.cursorPosition[0], shared.cursorPosition[1], 10);
    image(cursorIcon, shared.cursorPosition[0], shared.cursorPosition[1], 3, 3);
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

