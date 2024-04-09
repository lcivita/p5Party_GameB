let playerPos = [0,0];
let lastPlayerPos = [0,0];

const fileMoveSpeed = 200;

// let gameStarted = false;

function setup() {
    createCanvas(800, 600);

    let button = createButton('connect');
    button.position(0, height);
    button.mousePressed(connectToParty);
    //
    // let button2 = createButton('start game');
    // button2.position(width/2, height);
    // button2.mousePressed(startGame);
    //
    // let button3 = createButton('start game');
    // button3.position(width/4, height);
    // button3.mousePressed(onConnect);
    
    ellipseMode(CENTER);
}

function draw() {
    background(0);
    
    // if (!connected) {
    //     if (me !== undefined && me.role_keeper !== undefined && me.role_keeper.role !== undefined) {
    //         onConnect();
    //     }
    //     return;
    // }
    if (!connected) {
        return;
    }
    
    if (!shared.gameStarted)
    {
        return;
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
    
}

function startGame() {
    shared.gameStarted = true;
}

function hostDraw()
{
    updateSharedCursorPos();
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
    for (let i = 1; i < guests.length; i++)
    {
        circle(shared.filePositions[parseInt(guests[i].role_keeper.role)][0], shared.filePositions[parseInt(guests[i].role_keeper.role)][1], 20);
    }
}

function drawCursor()
{
    circle(shared.cursorPosition[0], shared.cursorPosition[1], 10);
}