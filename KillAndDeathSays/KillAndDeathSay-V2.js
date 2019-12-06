/**************************************
*        Kill and Death Says V2
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
    Global.RegisterCallback ( "player_death" , "identifyDeath" );
}

function initUI() {
    UI.AddDropdown( "KillSay Type", [
        "-Disabled-",
        "BOT Insult",
        "Custom Mode",
        "KD",
        "PreMade",
        "WeaponSay"
    ] );
    UI.AddCheckbox("Kill: Include Victim Name");
    UI.AddTextbox("KillSay");

    UI.AddDropdown( "DeathSay Type", [
        "-Disabled-",
        "BOT Insult",
        "Custom Mode",
        "Premade",
        "WeaponSay"
    ] );
    UI.AddCheckbox("Death: Include Attacker Name");
    UI.AddTextbox("DeathSay");
}

function identifyDeath() {
    botCheck(getPlayerID("victim"), getPlayerID("attacker"));
    playerCheck(getPlayerID("victim"), getPlayerID("attacker"));
}

function botCheck(victimID, attackerID) {
    if (Entity.IsBot(attackerID)) return;
    if (Entity.IsBot(getPlayerID("victim")) && Entity.IsLocalPlayer(attackerID)) {
        Global.ExecuteCommand("say I just killed your bot, goodbye BOT "
            + getPlayerName(victimID));
        return;
    }
}

function playerCheck(victimID, attackerID) {
    if (Entity.GetLocalPlayer() == victimID) {
        deathSay((get.state("Death: Include Attacker Name") ? getPlayerName(attackerID) + " " : ""), getPlayerWeapon(attackerID));
    }
    if (Entity.IsLocalPlayer(attackerID)) {
        killSay((get.state("Kill: Include Victim Name") ? getPlayerName(victimID) + " " : ""), getPlayerWeapon(attackerID));
    }
}

function deathSay(attackerName, weaponName) {
    switch (get.state("DeathSay Type")) {
        case 1:
            Global.ExecuteCommand("say "
                + "Wow, I got killed by " + (get.state("Death: Include Attacker Name") ? "BOT " + attackerName + "..." : "a BOT..."));
            break;
        case 2:
            Global.ExecuteCommand("say "
                + attackerName + get.string("DeathSay"));
            break;
        case 3:
            Global.ExecuteCommand("say "
                + attackerName + cycleDeathRoasts());
                d++;
                if (d + 1 > deathRoasts.length) {
                    d = 0;
                }
            break;
        case 4:
            Global.ExecuteCommand("say "
                + (get.state("Death: Include Attacker Name") ? "Wow " + attackerName : "Wow ") + "you killed me with a " + weaponName + "...");
            break;
    }
}

var d = 0;
function cycleDeathRoasts() {
    var deathRoasts = [
        'You finally killed me, Good Job!',
        'Good for you, you finally hit something!',
        'You finally learned to put your crosshair on me, cute.',
        'Did you use aimbot to kill me? It\'s okay, that\'s all you got.',
        'I almost died of old age, nice of you to finally kill me.',
        'Nice shot, I guess you do have luck on your side.',
        'Stormtroopers can still kill me faster than you.'
    ];
    if (d > deathRoasts.length - 2) {
        d = 0;
        return deathRoasts[d];
    } else {
        d++;
        return deathRoasts[d];
    }
}

function killSay(victimName, weaponName) {
    switch (get.state("KillSay Type")) {
        case 1:
            Global.ExecuteCommand("say I just killed your bot, goodbye BOT "
                + victimName);
            break;
        case 2:
            Global.ExecuteCommand("say "
                + victimName + get.string("KillSay"));
            break;
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
                + victimName + cycleKillRoasts());
            break;
        case 5:
            Global.ExecuteCommand("say "
                + victimName + "I killed you with a " + weaponName + " how???");
            break;
    }
}

var k = 0;
function cycleKillRoasts() {
    var killRoasts = [
        'Light travels faster than sound which is why you seemed bright until you spoke.',
        'You\'re so bad that even china declined they made you.',
        'You are like a cloud. When you disappear it\'s a beautiful day.',
        'You are more disappointing than an unsalted pretzel.',
        'I thought of you today. It reminded me to take out the trash.',
        'I would ask how old you are, but I know you can\'t count that high',
        'Do you still love nature, despite what it did to you?',
        'I’m not insulting you, I’m describing you.',
        'Your face makes onions cry.',
        'When was your last time you got a kill?',
        'You\'re a grey sprinkle on a rainbow cupcake.'
    ];
    if (k > killRoasts.length - 2) {
        k = 0;
        return killRoasts[k];
    } else {
        k++;
        return killRoasts[k];
    }
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
