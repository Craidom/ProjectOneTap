/*
*        Kill and Death Says
*        by GhostDaSnipa O_o
*/

UI.AddCheckbox("Enable KillSay");
UI.AddCheckbox("Kill: Include Victim Name");
UI.AddTextbox("KillSay");

UI.AddDropdown( "KillSay Type", [
    "BOT Insult",
    "Custom Mode",
    "KD",
    "PreMade",
    "WeaponSay"
] );

UI.AddCheckbox("Enable DeathSay");
UI.AddCheckbox("Death: Include Attacker Name");
UI.AddTextbox("DeathSay");

UI.AddDropdown( "DeathSay Type", [
    "BOT Insult",
    "Custom Mode",
    "Premade",
    "WeaponSay"
] );

var get = {
    state(state) {
        return UI.GetValue("Misc", "JAVASCRIPT", "Script items", state);
    },
    string(string) {
        return UI.GetString("Misc", "JAVASCRIPT", "Script items", string);
    }
}

var d = 0;

function onDeath() {
    if (!get.state("Enable DeathSay")) return;

    if (Entity.IsBot(playerID("attacker"))) return;

    attackerName = (get.state("Death: Include Attacker Name") ? playerName("attacker") + " " : "");
    weapon = playerWeapon("attacker");

    var deathRoasts = [
        'You finally killed me, Good Job!',
        'Good for you, you finally hit something!',
        'You finally learned to put your crosshair on me, cute.',
        'Did you use aimbot to kill me? It\'s okay, thats all you got.',
        'I almost died of old age, nice of you to finally kill me.',
        'Nice shot, I guess you do have luck on your side.',
        'Stormtroopers still can kill me faster than you.'
    ];

    switch (get.state("DeathSay Type")) {
        case 0:
            Global.ExecuteCommand("say "
            + "Wow I got killed by " + (get.state("Death: Include Attacker Name") ? "BOT " + attackerName + "..." : "a BOT..."));
            break;
        case 1:
            Global.ExecuteCommand("say "
            + attackerName + get.string("DeathSay"));
            break;
        case 2:
            Global.ExecuteCommand("say "
                + attackerName + deathRoasts[d]);
                d++;
                if (d + 1 > deathRoasts.length) {
                    d = 0;
                }
                break;
        case 3:
            Global.ExecuteCommand("say "
                + (get.state("Death: Include Attacker Name") ? "Wow " + attackerName : "Wow ") + "you killed me with a " + weapon + "...");
            break;
    }
}

var k = 0;

function onKill() {
    if (!get.state("Enable KillSay")) return;

    victimName = (get.state("Kill: Include Victim Name") ? playerName("victim") + " " : "");
    weapon = playerWeapon("attacker");

    if (Entity.IsBot(playerID("victim"))) {
        Global.ExecuteCommand("say I just killed your bot, goodbye BOT "
            + victimName);
    }

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

    var kills = Entity.GetProp(playerID("victim"), 'CPlayerResource', 'm_iKills');
    var deaths = Entity.GetProp(playerID("victim"), 'CPlayerResource', 'm_iDeaths');

    switch (get.state("KillSay Type")) {
        case 0:
            Global.ExecuteCommand("say I just killed your bot, goodbye BOT "
            + victimName);
            break;
        case 1:
            Global.ExecuteCommand("say "
            + victimName + get.string("KillSay"));
            break;
        case 2:
            Global.ExecuteCommand("say "
            + victimName + "No wonder you are  " + kills + " and " + deaths + ". Get tapped.");
            break;
        case 3:
            Global.ExecuteCommand("say "
            + victimName + killRoasts[k]);
            k++;
            if (k + 1 > roasts.length) {
                k = 0;
            }
            break;
        case 4:
            Global.ExecuteCommand("say "
            + victimName + "I killed you with a " + weapon + " how???");
            break;
    }

}

function playerID(player) {
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

function playerName(player) {
    if (player == "victim") {
        victimName = Entity.GetName(playerID("victim"));
        return victimName;
    }
    if (player == "attacker") {
        attackerName = Entity.GetName(playerID("attacker"));
        return attackerName;
    }
}

function playerWeapon(player) {
    if (player == "victim") {
        attackerWeapon = Entity.GetWeapon(playerID("victim"));
        weaponName = Entity.GetName(attackerWeapon);
        return weaponName;
    }
    if (player == "attacker") {
        attackerWeapon = Entity.GetWeapon(playerID("attacker"));
        weaponName = Entity.GetName(attackerWeapon);
        return weaponName;
    }
}

function whenPlayerDies() {

        if (Entity.GetLocalPlayer() == playerID("victim")) {
            onDeath();
        }
        if (Entity.IsLocalPlayer(playerID("attacker"))) {
            onKill();
        }

}
Global.RegisterCallback ( "player_death" , "whenPlayerDies" );
