/**************************************
*        Kill and Death Says V2.3.0
*        by GhostDaSnipa O_o
**************************************/
function main() {
    menu.init();
    Global.RegisterCallback("Draw", "menu.logic");
    Global.RegisterCallback("player_death", "output.onPlayerDeath");
}

var get = {
    value(name) {
        return UI.GetValue("Misc", "JAVASCRIPT", "Script items", name);
    },
    string(name) {
        return UI.GetString("Misc", "JAVASCRIPT", "Script items", name);
    }
};

var menu = {
    init() {
        UI.AddLabel( "=====KillSay And DeathSay=====");
        UI.AddMultiDropdown( "Select Mode(s)", [
            "BotSay",
            "DeathSay",
            "KillSay",
            "TeamSay",
            "SepakuSay"
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

        UI.AddLabel("=======DeathSay======");
        UI.AddDropdown( "DeathSay Type", [
            "BOT Insult",
            "Custom Mode",
            "Premade",
            "WeaponSay"
        ] );
        UI.AddCheckbox("Death: Include Attacker Name");
        UI.AddTextbox("Custom DeathSay");
    },
    logic() {
        if (!UI.IsMenuOpen()) return;
        var mode = menu.mode();
        if (mode[1]) {
            menu.deathSay.update(true);
            if (get.value("DeathSay Type") != 1) {
                menu.deathSay.updateCustom(false);
            }
        } else {
            menu.deathSay.update(false);
        }
        if (mode[2]) {
            menu.killSay.update(true);
            if (get.value("KillSay Type") != 1) {
                menu.killSay.updateCustom(false);
            }
        } else {
            menu.killSay.update(false);
        }
    },
    mode() {
        return get.value("Select Mode(s)").toString(2).split("").reverse().map(Number);
    },
    deathSay: {
        isActive() {
            return get.value("DeathSay Type");
        },
        update(state) {
            UI.SetEnabled("Script items", "=======DeathSay======", state);
            UI.SetEnabled("Script items", "DeathSay Type", state);
            UI.SetEnabled("Script items", "Death: Include Attacker Name", state);
            UI.SetEnabled("Script items", "Custom DeathSay", state);
        },
        updateCustom(state) {
            UI.SetEnabled("Script items", "Custom DeathSay", state);
        }
    },
    killSay: {
        update(state) {
            UI.SetEnabled("Script items", "=======KillSay=======", state);
            UI.SetEnabled("Script items", "KillSay Type", state);
            UI.SetEnabled("Script items", "Kill: Include Victim Name", state);
            UI.SetEnabled("Script items", "Custom KillSay", state);
        },
        updateCustom(state) {
            UI.SetEnabled("Script items", "Custom KillSay", state);
        }
    }
};

var output = {
    onPlayerDeath() {
        var msg = "";
        var mode = menu.mode();
        var victim = player.uID("victim");
        var attacker = player.uID("attacker");
        if (mode[0]) {
            if (player.isBot(victim) && player.isMe(attacker)) {
                msg = "say I just killed your bot, goodbye BOT "
                + player.name(victim);
            }
        }
        if (mode[1]) {
            if (!player.isMe(attacker) && player.isMe(victim)) {
                msg = deathSay(get.value("Death: Include Attacker Name") ?
                player.name(attacker) + "": "", player.weapon(attacker));
            }
        }
        if (mode[2]) {
            if (!player.isMe(victim) && player.isMe(attacker) && !mode[0]) {
                (msg = killSay(get.value("Kill: Include Victim Name") ?
                player.name(victim) + "" : "", player.weapon(attacker)));
            }
        }
        if (mode[3]) {
            if (!player.isMe(attacker) && player.isTeam(attacker)) {
            msg = "Say wow " + player.name(victim) + ", you got killed by "
            +  player.name(attacker) + "?? You dissapoint me...";
            }
        }
        if (mode[4]) {
            if (player.isMe(attacker && victim)) {
            msg = "say I felt bad for you guys, so I decided to kill myself"
            + " for you.";
            }
        }
        Global.ExecuteCommand(msg);
    }
};

var player = {
    uID(entity) {
        if (entity == "victim") {
            return Entity.GetEntityFromUserID(Event.GetInt("userid"));
        }
        if (entity == "attacker") {
            return Entity.GetEntityFromUserID(Event.GetInt("attacker"));
        }
    },
    name(uID) {
        return Entity.GetName(uID);
    },
    weapon(uID) {
        return Entity.GetName(Entity.GetWeapon(uID));
    },
    isBot(uID) {
        return Entity.IsBot(uID);
    },
    isMe(uID) {
        return Entity.IsLocalPlayer(uID);
    },
    isTeam(uID) {
        return Entity.IsTeammate(uID);
    }
};

var b= 0;
var d = 0;
var h = 0;
var k = 0;
var roast = {
    death: [
        'you finally killed me, Good Job!',
        'good for you, you finally hit something!',
        'you finally learned to put your crosshair on me, cute.',
        'did you use aimbot to kill me? It\'s okay, that\'s all you got.',
        'I almost died of old age, nice of you to finally kill me.',
        'nice shot, I guess you do have luck on your side.',
        'stormtroopers can still kill me faster than you.'
    ],
    kill: [
        'light travels faster than sound which is why you seemed bright until you spoke.',
        'you\'re so bad that even china declined they made you.',
        'you are like a cloud. When you disappear it\'s a beautiful day.',
        'you are more disappointing than an unsalted pretzel.',
        'I thought of you today. It reminded me to take out the trash.',
        'I would ask how old you are, but I know you can\'t count that high.',
        'do you still love nature, despite what it did to you?',
        'I’m not insulting you, I’m describing you.',
        'your face makes onions cry.',
        'when was your last time you got a kill?',
        'you\'re a grey sprinkle on a rainbow cupcake.'
    ],
    head: [
        'OneTap',
        'One',
        '1',
        'BOOM! Headshot',
        'Nice Resolver',
        'You paid for those?'
    ],
    body: [
        'Too Slow.',
        'Ouu I\'m sorry, you were not fast enough.',
        'my Baim is better than yours.'
    ],
    onDeath() {
        if (d > roast.death.length - 2) {
            d = 0;
        } else {
            d++;
        }
        return roast.death[d];
    },
    onKill() {
        if (k > roast.kill.length - 2) {
            k = 0
        } else {
            k++;
        }
        return roast.kill[k];
    },
    onHead() {
        if (h > roast.head.length - 2) {
            h = 0
        } else {
            h++;
        }
        return roast.head[h];
    },
    onBody() {
        if (b > roast.body.length - 2) {
            b = 0
        } else {
            b++;
        }
        return roast.body[b];
    }
};

function deathSay(attacker, weapon) {
    var attackerName = get.value("Death: Include Attacker Name") ? attacker
    + " " : "";
    var msg = "default death";
    switch (get.value("DeathSay Type")) {
        case 0:
            msg = "say Wow, I got killed by a BOT " + attackerName;
            break;
        case 1:
            msg = "say " + attackerName + get.string("Custom DeathSay");
            break;
        case 2:
            msg = "say " + attacker + ", " + roast.onDeath();
            break;
        case 3:
            msg = "say Wow " + attackerName + " you killed me with" + weapon
    }
    return msg;
}

function killSay(victim, weapon) {
    var victimName = get.value("Kill: Include Victim Name") ? victim + " " : "";
    var msg = "default kill";
    switch (get.value("KillSay Type")) {
        case 0:
            msg = "say I just killed your bot, goodbye BOT " + victimName;
            break;
        case 1:
            msg = "say " + victimName + get.string("Custom KillSay");
            break;
        case 2:
            if (Event.GetInt("headshot")) {
                msg = "say " + victimName + roast.onHead("hitboxHead");
            } else {
                msg = "say " + victimName + roast.onBody("hitboxBody");
            }
            break;
        case 3:
            msg = "say " + victimName + "No wonder you are  "
                + Entity.GetProp(player.uID("victim"), 'CPlayerResource', 'm_iKills')
                + " and "
                + Entity.GetProp(player.uID("victim"), 'CPlayerResource', 'm_iDeaths')
                + ". Get tapped.";
            break;
        case 4:
            msg = "say " + victimName + roast.onKill("kill");
            break;
        case 5:
            msg = "say " + victimName + "I killed you with a " + weapon + " how???";
            break;
    }
    return msg;
}
main();
