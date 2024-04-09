
const appName = "nikita_leo_lu_GameB_Week1";
const roomName = "test";

let me, guests;
let shared;

let connected = false;
function connectToParty()
{
    partyConnect("wss://demoserver.p5party.org", appName, roomName);
    shared = partyLoadShared("shared",
        {
            cursorPosition: [0, 0],
            filePositions: [],
            gameStarted: false
        },
        onConnect
    );

    // me = partyLoadMyShared({}, onConnect);
    me = partyLoadMyShared();
    guests = partyLoadGuestShareds();
    
    new RoleKeeper(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], "none");
}

function onConnect() {
    if (partyIsHost())
    {
        let button2 = createButton('start game');
        button2.position(width/2, height);
        button2.mousePressed(startGame);
    }
        
        // Delay by 0.2 seconds
    setTimeout(() => {
        shared.filePositions[parseInt(me.role_keeper.role)] = playerPos;
        connected = true;
        subscribePartyEvents();
        // shared.gameStarted = true;

        if (!partyIsHost()) {
            playerPos = [width - 20, 20 + me.role_keeper.role * height/16 - height/16];
        }

        // TODOS
        // check if game is in progress
        // if not, join waiting room
    }, 200);
}