
const appName = "nikita_leo_lu_GameB_Final";
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
            selectedUsers: [],
            deletedUsers: [],
            boostAvailable: [],
            gameStarted: false,
            cage: [0, 0, 0, 0],
            cageActive: false,
            backgroundImage:0,
            gameEnded: -1,
            timer: 0,
            matchTimer: 30000
        },
        onConnect
    );
    me = partyLoadMyShared();
    guests = partyLoadGuestShareds();
    
    new RoleKeeper(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"], "none");
}

function onConnect() {
    if (partyIsHost())
    {
        randomizeFilePos();
        /*
        let button2 = createButton('(host) start game');
        button2.position(button2.width, 0);
        button2.mousePressed(startGame);
        */
    }
        
        // Delay by 0.2 seconds
    setTimeout(() => {
        shared.filePositions[parseInt(me.role_keeper.role)] = playerPos;
        connected = true;
        shared.selectedUsers[parseInt(me.role_keeper.role)] = false;
        shared.deletedUsers[parseInt(me.role_keeper.role)] = false;
        shared.boostAvailable[parseInt(me.role_keeper.role)] = 0;
        subscribePartyEvents();


        if (!partyIsHost()) {
            playerPos = [width - 20, 20 + me.role_keeper.role * height/16 - height/16];
            partySubscribe("fileEaten", tryAddCharge);
        }
    }, 200);
}