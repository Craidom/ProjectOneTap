/**************************************
*        Kill and Death Says V2.1.0
*        by GhostDaSnipa O_o
**************************************/
var get = {
    state(state) {
        return UI.GetValue("Misc", "JAVASCRIPT", "Script items", state);
    },
    string(string) {
        return UI.GetString("Misc", "JAVASCRIPT", "Script items", string);
    }
}

function main() {
    initUI();
    Global.RegisterCallback ( "player_death" , "modeCheck" );
}

function initUI() {
    UI.AddLabel( "=======Modes======");
    UI.AddMultiDropdown( "Select Mode(s)", [
        "BotSay",
        "DeathSay",
        "KillSay",
        "TeamSay"
    ] );

    UI.AddLabel( "=======KillSay=======");
    UI.AddDropdown( "KillSay Type", [
        "BOT Insult",
        "Custom Mode",
        "Hitbox",
        "KD",
        "PreMade",
        "WeaponSay"
    ] );
    UI.AddCheckbox("Kill: Include Victim Name");
    UI.AddTextbox("Custom KillSay");

    UI.AddLabel( "=======DeathSay======");
    UI.AddDropdown( "DeathSay Type", [
        "BOT Insult",
        "Custom Mode",
        "Premade",
        "WeaponSay"
    ] );
    UI.AddCheckbox("Death: Include Attacker Name");
    UI.AddTextbox("Custom DeathSay");
}

function modeCheck() {
    var mode = get.state("Select Mode(s)").toString(2).split("").reverse().map(Number);
    if (mode[0]) {
        if (Entity.IsBot(getPlayerID("victim")) && Entity.IsLocalPlayer(getPlayerID("attacker"))) botSay(getPlayerID("victim"));
    }
    if (mode[1]) {
        if (Entity.GetLocalPlayer() == getPlayerID("victim")) {
            deathSay((get.state("Death: Include Attacker Name") ? getPlayerName(getPlayerID("attacker")) + " " : ""), getPlayerWeapon(getPlayerID("attacker")));
        }
    }
    if (mode[2]) {
        if (Entity.IsLocalPlayer(getPlayerID("attacker"))) {
            killSay((get.state("Kill: Include Victim Name") ? "Hey " + getPlayerName(getPlayerID("victim")) + ", " : ""), getPlayerWeapon(getPlayerID("attacker")));
        }
    }
    if (mode[3]) {
        if (Entity.IsLocalPlayer(getPlayerID("attacker"))) return;
        if (Entity.IsLocalPlayer(getPlayerID("attacker"))) teamSay((get.state("Kill: Include Victim Name") ? getPlayerName(getPlayerID("victim")) + " " : ""), getPlayerName(getPlayerID("attacker")));
    }
}

function botSay(victimID) {
        Global.ExecuteCommand("say I just killed your bot, goodbye BOT "
            + getPlayerName(victimID));
}

function deathSay(attackerName, weaponName) {
    switch (get.state("DeathSay Type")) {
        case 0:
            Global.ExecuteCommand("say "
                + "Wow, I got killed by " + (get.state("Death: Include Attacker Name") ? "BOT " + attackerName + "..." : "a BOT..."));
            break;
        case 1:
            Global.ExecuteCommand("say "
                + attackerName + get.string("Custom DeathSay"));
            break;
        case 2:
            Global.ExecuteCommand("say "
                + attackerName + cycleRoasts("death"));
                d++;
                if (d + 1 > deathRoasts.length) {
                    d = 0;
                }
            break;
        case 3:
            Global.ExecuteCommand("say "
                + (get.state("Death: Include Attacker Name") ? "Wow " + attackerName : "Wow ") + "you killed me with a " + weaponName + "...");
            break;
    }
}

function killSay(victimName, weaponName) {
    switch (get.state("KillSay Type")) {
        case 0:
            Global.ExecuteCommand("say I just killed your bot, goodbye BOT "
                + victimName);
            break;
        case 1:
            Global.ExecuteCommand("say "
                + victimName + get.string("Custom KillSay"));
            break;
        case 2:
            if (Event.GetInt("headshot")) {
                Global.ExecuteCommand("say "
                    + victimName + cycleRoasts("hitboxHead"));
            } else {
                Global.ExecuteCommand("say "
                    + victimName + cycleRoasts("hitboxBody"));
            }
        case 3:
            Global.ExecuteCommand("say "
                + victimName + "No wonder you are  "
                + Entity.GetProp(getPlayerID("victim"), 'CPlayerResource', 'm_iKills')
                + " and "
                + Entity.GetProp(getPlayerID("victim"), 'CPlayerResource', 'm_iDeaths')
                + ". Get tapped.");
            break;
        case 4:
            Global.ExecuteCommand("say "
                + victimName + cycleRoasts("kill"));
            break;
        case 5:
            Global.ExecuteCommand("say "
                + victimName + "I killed you with a " + weaponName + " how???");
            break;
    }
}

var b = 0;
var d = 0;
var h = 0;
var k = 0;
function cycleRoasts(roast) {
    var deathRoasts = [
        'You finally killed me, Good Job!',
        'Good for you, you finally hit something!',
        'You finally learned to put your crosshair on me, cute.',
        'Did you use aimbot to kill me? It\'s okay, that\'s all you got.',
        'I almost died of old age, nice of you to finally kill me.',
        'Nice shot, I guess you do have luck on your side.',
        'Stormtroopers can still kill me faster than you.'
    ];
    var killRoasts = [
        'Light travels faster than sound which is why you seemed bright until you spoke.',
        'You\'re so bad that even china declined they made you.',
        'You are like a cloud. When you disappear it\'s a beautiful day.',
        'You are more disappointing than an unsalted pretzel.',
        'I thought of you today. It reminded me to take out the trash.',
        'I would ask how old you are, but I know you can\'t count that high.',
        'Do you still love nature, despite what it did to you?',
        'I’m not insulting you, I’m describing you.',
        'Your face makes onions cry.',
        'When was your last time you got a kill?',
        'You\'re a grey sprinkle on a rainbow cupcake.'
    ];
    var hitboxHeadshotRoasts = [
        'OneTap',
        'One',
        'tylerONE'
    ];
    var hitboxBodyRoasts = [
        'Too Slow.',
        'Ouu I\'m sorry, you were not fast enough.',
        'my Baim is better than yours.'
    ];
    switch (roast) {
        case "death":
            if (d > deathRoasts.length - 2) {
                d = 0;
                return deathRoasts[d];
            } else {
                d++;
                return deathRoasts[d];
            }
            break;
        case "kill":
            if (k > killRoasts.length - 2) {
                k = 0;
                return killRoasts[k];
            } else {
                k++;
                return killRoasts[k];
            }
            break;
        case "hitboxHead":
            if (h > hitboxHeadshotRoasts.length - 2) {
                h = 0;
                return hitboxHeadshotRoasts[h];
            } else {
                h++;
                return hitboxHeadshotRoasts[h];
            }
            break;
        case "hitboxBody":
            if (b > hitboxBodyRoasts.length - 2) {
                b = 0;
                return hitboxBodyRoasts[b];
            } else {
                b++;
                return hitboxBodyRoasts[b];
            }
            break;
    }
}

function teamSay(victimName, attackerName) {
    Global.ExecuteCommand("Say Wow " + victimName + ", you got killed by " +  attackerName + "?? You dissapoint me...");
}

function getPlayerID(player) {
    if (player == "victim") {
        victim = Event.GetInt("userid");
        victimID = Entity.GetEntityFromUserID(victim);
        return victimID;
    }
    if (player == "attacker") {
        attacker = Event.GetInt("attacker");
        attackerID = Entity.GetEntityFromUserID(attacker);
        return attackerID;
    }
}

function getPlayerName(player) {
        playerName = Entity.GetName(player);
        return playerName;
}

function getPlayerWeapon(player) {
        attackerWeapon = Entity.GetWeapon(player);
        weaponName = Entity.GetName(attackerWeapon);
        return weaponName;
}
main();
