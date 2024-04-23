const boost = 2.0;
let boosting = false;
let boostsAvailable = 3;
let boostStartTime;
let boostLength = 1000;

// let filePos = [0.5, 0.5];

function tryBoost() {
    if (!boosting && boostsAvailable > 0) {
        boosting = true;
        boostsAvailable--;
        boostStartTime = millis();
    }
}

function tryAddCharge(data) {
    if (data === parseInt(me.role_keeper.role)) {
        if (boostsAvailable < 3) {
            boostsAvailable++;
        }
    }
}


const maxFileEatDist = 6;
function boostEatenCheck() {
    let closestIndex = -1;
    for (let i = 0; i < shared.filePositions.length; i++) {
        let tempPos = shared.filePositions[i];
        let dx = tempPos[0] - shared.filePos[0];
        let dy = tempPos[1] - shared.filePos[1];
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= maxFileEatDist) {
            partyEmit("fileEaten", i);
            randomizeFilePos();
            break;
        }
    }
}

function randomizeFilePos() {
    shared.filePos = [random() * width, random() * (height - 4)];
}

function displayAvailableBoost() {
    push();
    
    rectMode(CENTER);
    noStroke();
    fill(255);
    
    for (let i = 0; i < boostsAvailable; i++) {
        rect(shared.filePositions[me.role_keeper.role][0] - 2 + i * 2, shared.filePositions[me.role_keeper.role][1] + 4, 1, 1);
    }
    
    pop();
}

function drawFileBoost()
{
    // TODO replace with file img
    push();
    imageMode(CENTER);
    image(fileIcon, shared.filePos[0],shared.filePos[1], 7, 7);
    // rectMode(CENTER);
    // fill(255);
    // rect(shared.filePos[0],shared.filePos[1], 3, 3);
    pop();
}