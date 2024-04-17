let menuOptions = [
    "delete",
    "don't delete",
    "do nothing",
    "useless option",
    "try this",
    "close menu",
    "collapse"
]

let hoveredOption = -1;
let menuPos = { x: 50, y: 50 };

// array shuffling thingy
function randomizeMenuOrder() {
    let curIdx = menuOptions.length, tempVal, randomIdx;
    while (curIdx !== 0) {
        randomIdx = Math.floor(Math.random() * curIdx);
        curIdx -= 1;
        tempVal = menuOptions[curIdx];
        menuOptions[curIdx] = menuOptions[randomIdx];
        menuOptions[randomIdx] = tempVal;
    }
}
const padding = 1;
const lineHeight = 3;
const rectHeight = lineHeight + padding * 2;

function displayMenu(pos, hoveredOption) {

    let maxTextWidth = 0;
    for (let i = 0; i < menuOptions.length; i++) {
        const currentTextWidth = textWidth(menuOptions[i]) + padding * 2;
        if (currentTextWidth > maxTextWidth) {
            maxTextWidth = currentTextWidth;
        }
    }
    for (let i = 0; i < menuOptions.length; i++) {
        const x = menuPos.x;
        const y = menuPos.y + i * rectHeight;

        if (i === hoveredOption) {
            fill(0);
            rect(x, y, maxTextWidth, rectHeight);
            fill(255);
        } else {
            fill(255);  
            rect(x, y, maxTextWidth, rectHeight);
            fill(0);
        }

        if(menuOptions[i] == "delete") {
            fill(255, 0, 0)
        }
        textSize(2.5)
        noStroke()
        text(menuOptions[i], x + padding, y + padding + (rectHeight - lineHeight));
    }
}

function mouseMoved() {
    hoveredOption = getHoveredOption(mouseX, mouseY);
    return false;
}

function getHoveredOption(x, y) {
    let maxTextWidth = 0;
    for (let option of menuOptions) {
        const currentTextWidth = textWidth(option) + padding * 2;
        if (currentTextWidth > maxTextWidth) {
            maxTextWidth = currentTextWidth;
        }
    }
    for (let i = 0; i < menuOptions.length; i++) {
        const rectX = menuPos.x;
        const rectY = menuPos.y + i * rectHeight;
        if (x >= rectX && x <= rectX + maxTextWidth && y >= rectY && y <= rectY + rectHeight) {
            return i;
        }
    }
    return -1;
}