/*
GhostDaSnipa's Lazyman Companion
updated 10 January 2020 03:44 PST
*/

function main() {
    menu.init();
    Cheat.RegisterCallback("Draw", "menu.logic");
    Cheat.RegisterCallback("round_announce_match_start", "chivalry.gameStart");
    Cheat.RegisterCallback("announce_phase_end", "chivalry.gameHalf");
    Cheat.RegisterCallback("cs_win_panel_match", "chivalry.gameEnd");
    Cheat.RegisterCallback("bomb_beginplant", "bomb.planting");
    Cheat.RegisterCallback("bomb_abortplant", "bomb.abort");
    Cheat.RegisterCallback("bomb_planted", "bomb.planted");
    Cheat.RegisterCallback("bomb_defused", "bomb.defused");
    Cheat.RegisterCallback("bomb_begindefuse", "bomb.defusing");
    Cheat.RegisterCallback("bomb_abortdefuse", "bomb.abortDefuse");
    Cheat.RegisterCallback("bomb_dropped", "bomb.dropped");
    Cheat.RegisterCallback("bomb_pickup", "bomb.pickup");
    Cheat.RegisterCallback("enter_bombzone", "bombZone.enter");
    Cheat.RegisterCallback("exit_bombzone", "bombZone.left");
    Cheat.RegisterCallback("enter_buyzone", "buyZone.enter");
    Cheat.RegisterCallback("exit_buyzone", "buyZone.exit")
    Cheat.RegisterCallback("CreateMove", "locationFinder.whenPressed");
    Cheat.RegisterCallback("weapon_reload", "pantsDown.isReloading");
    Cheat.RegisterCallback("grenade_thrown", "pantsDown.grenadeThrown");
    Cheat.RegisterCallback("weapon_zoom", "pantsDown.isZoom");
    Cheat.RegisterCallback("weapon_fire", "pantsDown.onWeaponFire");
    Cheat.RegisterCallback("Draw", "iSeeYou.lineESP");
    Cheat.RegisterCallback("Draw", "iHateYou.rage");
    Global.RegisterCallback("vote_options", "whoVoted.voteCasted");
    Global.RegisterCallback("vote_cast", "whoVoted.voteChoice");
}

//Simplify stuff lol
var get = {
    ui: {
        value(name) {
            return UI.GetValue("Misc", "JAVASCRIPT", "Script items", name);
        },
        string(name) {
            return UI.GetString("Misc", "JAVASCRIPT", "Script items", name);
        },
        mode(name) {
            return get.ui.value(name).toString(2).split("").reverse().map(Number)
        },
    },
    event: {
        int(event) {
            return Event.GetInt(event);
        },
        string(event) {
            return Event.GetString(event);
        }
    },
    entity: {
        enemies() { //String Array
            return Entity.GetEnemies();
        },
        id(eventID) { //Integer
            return Entity.GetEntityFromUserID(eventID);
        },
        name(entid) { //String
            return Entity.GetName(entid);
        },
        me() { //Integer
            return Entity.GetLocalPlayer();
        },
        players() { //String Array
            return Entity.GetPlayers();
        },
        team() { //String Array
            return Entity.GetTeammates();
        },
        weapon(entid) { //String
            return Entity.GetName(Entity.GetWeapon(entid));
        },
        isAlive(entid) { //Bool
            return Entity.IsAlive(entid);
        },
        isBot(entid) { //Bool
            return Entity.IsBot(entid);
        },
        isEnemy(entid) { //Bool
            return Entity.IsEnemy(entid);
        },
        isMe(entid) { //Bool
            return Entity.IsLocalPlayer(entid);
        }
    },
    screenSize: Render.GetScreenSize()
};

var output = {
    say(msg) {
        Cheat.ExecuteCommand("say " + msg);
    },
    teamSay(msg) {
        Cheat.ExecuteCommand("say_team " + msg);
    },
    print(msg) {
        Cheat.Print(msg);
    },
    printChat(msg) {
        Cheat.PrintChat(msg);
    }
};

//Features treated as Objects/Classes
var menu = {
    init() {
        UI.AddMultiDropdown("Activate Mode(s)", [
            "AboutServer",
            "Whitelist",
            "BuyZone",
            "Chivalry",
            "Bomb",
            "BombZone",
            "LocationFinder",
            "PantsDown",
            "ISeeYou",
            "IHateYou",
            "WhoVoted"
        ]);
        UI.AddDropdown("Show Menu(s)", [
            "None",
            "AboutServer",
            "Whitelist Menu",
            "Bomb Menu",
            "BombZone Menu",
            "LocationFinder Menu",
            "PantsDown Menu",
            "ISeeYou Menu",
            "IHateYou Menu"
        ]);
        UI.AddColorPicker("AS: Text Colour");
        UI.AddSliderInt("AS: X pos", 0, get.screenSize[0]);
        UI.AddSliderInt("AS: Y pos", 0, get.screenSize[1]);

        UI.AddCheckbox("Whitelist: Refresh")
        UI.AddCheckbox("Whitelist ID: 1");
        UI.AddCheckbox("Whitelist ID: 2");
        UI.AddCheckbox("Whitelist ID: 3");
        UI.AddCheckbox("Whitelist ID: 4");
        UI.AddCheckbox("Whitelist ID: 5");
        UI.AddCheckbox("Whitelist ID: 6");
        UI.AddCheckbox("Whitelist ID: 7");
        UI.AddCheckbox("Whitelist ID: 8");
        UI.AddCheckbox("Whitelist ID: 9");
        UI.AddCheckbox("Whitelist ID: 10");
        UI.AddCheckbox("Whitelist ID: 11");
        UI.AddCheckbox("Whitelist ID: 12");
        UI.AddCheckbox("Whitelist ID: 13");
        UI.AddCheckbox("Whitelist ID: 14");
        UI.AddCheckbox("Whitelist ID: 15");
        UI.AddCheckbox("Whitelist ID: 16");
        UI.AddCheckbox("Whitelist ID: 17");
        UI.AddCheckbox("Whitelist ID: 18");
        UI.AddCheckbox("Whitelist ID: 19");
        UI.AddCheckbox("Whitelist ID: 20");
        for (var i = 1; i <= 20; i++) {
            UI.SetEnabled("Whitelist ID: " + i, false);
        }

        UI.AddDropdown("BombZone Output", [
            "PrintChat",
            "TeamSay",
            "Say"
        ]);

        UI.AddDropdown("Bomb Output", [
            "PrintChat",
            "TeamSay",
            "Say"
        ]);

        UI.AddCheckbox("Click For Location!");
        UI.AddHotkey("Location Hotkey");
        UI.AddDropdown("Location of: ", [
            "All",
            "Enemy",
            "Teammates"
        ]);

        UI.AddCheckbox("PD: Use Whitelist");
        UI.AddCheckbox("PD: Enable Weaponfire");
        UI.AddCheckbox("PD: Weaponfire On Key?");
        UI.AddHotkey("PD: Hotkey")
        UI.AddDropdown("PantsDown Output", [
            "PrintChat",
            "TeamSay",
            "Say"
        ]);

        UI.AddCheckbox("ISY: Use Whitelist");
        UI.AddCheckbox("ISY: Show Name")
        UI.AddCheckbox("ISY: OnlyEnemy");
        UI.AddCheckbox("ISY: Draw on Visible");
        UI.AddColorPicker("ISY: Line Colour");
        UI.AddColorPicker("ISY: Text Colour")
        UI.AddSliderInt("ISY: Text Size", 1, 48);

        UI.AddCheckbox("IHY: Enable Rage On Sight");
        UI.AddCheckbox("IHY: Detect Through Wall");
        UI.AddSliderInt("IHY: Min Dmg", 0, 150);
        UI.AddCheckbox("IHY: AntiAim");
        UI.AddCheckbox("IHY: Refresh IHateYouList");
        UI.AddCheckbox("IHY ID: 1");
        UI.AddCheckbox("IHY ID: 2");
        UI.AddCheckbox("IHY ID: 3");
        UI.AddCheckbox("IHY ID: 4");
        UI.AddCheckbox("IHY ID: 5");
        UI.AddCheckbox("IHY ID: 6");
        UI.AddCheckbox("IHY ID: 7");
        UI.AddCheckbox("IHY ID: 8");
        UI.AddCheckbox("IHY ID: 9");
        UI.AddCheckbox("IHY ID: 10");
        UI.AddCheckbox("IHY ID: 11");
        UI.AddCheckbox("IHY ID: 12");
        UI.AddCheckbox("IHY ID: 13");
        UI.AddCheckbox("IHY ID: 14");
        UI.AddCheckbox("IHY ID: 15");
        UI.AddCheckbox("IHY ID: 16");
        UI.AddCheckbox("IHY ID: 17");
        UI.AddCheckbox("IHY ID: 18");
        UI.AddCheckbox("IHY ID: 19");
        UI.AddCheckbox("IHY ID: 20");
        for (var i = 1; i <= 20; i++) {
            UI.SetEnabled("IHY ID: " + i, false);
        }
    },
    logic() {
        if (!UI.IsMenuOpen()) return;
        var mode = get.ui.mode("Activate Mode(s)");
        var menuSelection = get.ui.value("Show Menu(s)");

        var rgbaAS = UI.GetColor("Script items", "AS: Text Colour");
        var redAS = rgbaAS[0];
        var greenAS = rgbaAS[1];
        var blueAS = rgbaAS[2];
        var alphaAS = rgbaAS[3];
        menu.update.aboutServer(menuSelection == 1 ? true : false);
        Render.String(get.ui.value("AS: X pos"), get.ui.value("AS: Y pos"), 0,
            "Map: " + aboutServer.getMap() +
            "\nServerIP: " + aboutServer.getIP() +
            "\nPing: " + aboutServer.getPing() + "ms" +
            "\nSession Time: " + aboutServer.getRealTime(),
            mode[0] ?
            [redAS, greenAS,
            blueAS, alphaAS] : [255, 255, 255], 4.5
        );

        menu.update.whitelist(menuSelection == 2 ? true : false);
        if (get.ui.value("Whitelist: Refresh")) {
            UI.SetValue("Whitelist: Refresh", false);
            var id = whitelist.refresh();
            for (var i = 1; i <= 20; i++) {
                UI.SetEnabled("Whitelist ID: " + i, false);
            }
            for (var i = 1; i <= id.length; i++) {
                UI.SetEnabled("Whitelist ID: " + id[i], true);
            }
        }
        menu.update.bomb(menuSelection == 3 ? true : false);
        menu.update.bombZone(menuSelection == 4 ? true : false);
        menu.update.locationFinder(menuSelection == 5 ? true : false);
        menu.update.pantsDown(menuSelection == 6 ? true : false)
        menu.update.iSeeYou(menuSelection == 7 ? true : false);
        menu.update.iHateYou(menuSelection == 8 ? true : false)
        if (get.ui.value("IHY: Refresh IHateYouList")) {
            UI.SetValue("IHY: Refresh IHateYouList", false);
            iHateYou.iHateYouList();
        }
    },
    update: {
        aboutServer(state) {
            UI.SetEnabled("AS: X pos", state);
            UI.SetEnabled("AS: Y pos", state);
            UI.SetEnabled("AS: Text Colour", state);
        },
        whitelist(state) {
            UI.SetEnabled("Whitelist: Refresh", state);
            if (!(get.ui.value("Show Menu(s)") == 2)) {
                for (var i = 1; i <= 20; i++) {
                    UI.SetEnabled("Whitelist ID: " + i, false);
                }
            }
        },
        bomb(state) {
            UI.SetEnabled("Bomb Output", state);
        },
        bombZone(state) {
            UI.SetEnabled("BombZone Output", state);
        },
        locationFinder(state) {
            UI.SetEnabled("Click For Location!", state);
            UI.SetEnabled("Location Hotkey", state);
            UI.SetEnabled("Location of: ", state);
        },
        pantsDown(state) {
            UI.SetEnabled("PD: Use Whitelist", state);
            UI.SetEnabled("PD: Hotkey", state);
            UI.SetEnabled("PD: Weaponfire On Key?", state);
            UI.SetEnabled("PD: Enable Weaponfire", state);
            UI.SetEnabled("PantsDown Output", state);
        },
        iSeeYou(state) {
            UI.SetEnabled("ISY: Use Whitelist", state);
            UI.SetEnabled("ISY: Show Name", state);
            UI.SetEnabled("ISY: OnlyEnemy", state);
            UI.SetEnabled("ISY: Draw on Visible", state);
            UI.SetEnabled("ISY: Line Colour", state);
            UI.SetEnabled("ISY: Text Colour", state);
            UI.SetEnabled("ISY: Text Size", state);
        },
        iHateYou(state) {
            UI.SetEnabled("IHY: Enable Rage On Sight", state);
            UI.SetEnabled("IHY: Detect Through Wall", state);
            UI.SetEnabled("IHY: Min Dmg", state);
            UI.SetEnabled("IHY: AntiAim", state);
            UI.SetEnabled("IHY: Refresh IHateYouList", state);
            if (!state) {
                for (var i = 1; i <= 20; i++) {
                    UI.SetEnabled("IHY ID: " + i, false);
                }
            }
        }
    }
};

var aboutServer = {
    getCurTime() {
        return Math.floor(Globals.Curtime());
    },
    getIP() {
        return World.GetServerString();
    },
    getMap() {
        return World.GetMapName();
    },
    getPing() {
        return Math.floor(Local.Latency());
    },
    getRealTime() {
        var time = Math.floor(Globals.Realtime());
        return Math.floor(((time/60)/60)) + "h " + Math.floor(time/60) + "m " + time%60 + "s";
    }
};

var whitelist = {
    refresh() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[1]) return;
        var players = get.entity.players();
        output.printChat("=================================");
        for (var i = 0; i < players.length; i++) {
            output.printChat("ID:" + players[i] + " > " + get.entity.name(players[i]));
        }
        output.printChat("=================================");
        return players;
    }
};

var buyZone = {
    enter() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[2]) return;
        var player = get.entity.id(get.event.int("userid"));
        if (!get.entity.isMe(player)) return;
        var canBuy =(get.event.int("canbuy"));
        output.printChat(">You have entered your buy zone!");
        if (canBuy) {
            output.printChat(">You can still buy stuff!");
        } else {
            output.printChat(">You can no longer buy stuff!");
        }
    },
    exit() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[2]) return;
        var player = get.entity.id(get.event.int("userid"));
        if (!get.entity.isMe(player)) return;
        var canBuy = get.event.int("canbuy");
        output.printChat(">You have left your buy zone!");
        if (canBuy) {
            output.printChat(">You can still buy stuff!");
        } else {
            output.printChat(">You can no longer buy stuff!");
        }
    }
};

var chivalry = {
    temp: 0,
    gameStart() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (mode[3]) output.say("glhf");
        chivalry.temp = 0;
    },
    gameHalf() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (mode[3] && !chivalry.temp) {
            output.say("gh");
            chivalry.temp++
        }
    },
    gameEnd() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (mode[3]) output.say("gg");
        chivalry.temp++

    }

};

var bomb = {
    checkSite(site) {
        var bombSiteA =[79, 93, 154, 201, 210, 216, 262, 278, 299, 333, 425];
        var bombSiteB = [107, 180, 202, 209, 279, 300, 314, 405, 422, 426, 504, 538];
        for (var i = 0; i < bombSiteA.length; i++) {
            if (bombSiteA[i] == site) {
                msg = "Bombsite A";
                break;
            } else if (bombSiteB[i] == site) {
                msg = "Bombsite B";
                break;
            } else {
                msg = Entity.GetProp(playerID, "CBasePlayer", "m_szLastPlaceName");
            }
        }
        return msg;
    },
    planting() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var location = bomb.checkSite(Event.GetInt("site"));
        var msg = ">" + player + " is planting on " + location + "!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    abort () {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var msg = ">" + player + " stopped planting!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    planted() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var location = bomb.checkSite(Event.GetInt("site"));
        var msg = ">" + player + " has planted the bomb on " + location + "!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    defused() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var msg = ">" + player + " has defused the bomb!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    defusing() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var location = bomb.checkSite(Event.GetInt("site"));
        var msg = ";"
        if (get.event.int("haskit")) {
            msg = ">" + player + " is defusing the bomb on " + location + " with a kit!"
        } else {
            var msg = ">" + player + " is defusing the bomb on " + location + " without a kit!";
        }
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    abortDefuse() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var msg = ">" + player + " has stopped defusing!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    dropped() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var msg = ">" + player + " has dropped the bomb!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    pickup() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[4]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player= get.entity.name(playerID);
        var msg = ">" + player + " has picked up the bomb!";
        switch (get.ui.value("Bomb Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    }
};

var bombZone = {
    enter() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[5]) return;
        var hasBomb = get.event.int("hasbomb");
        var playerID = get.entity.id(get.event.int("userid"));
        var player = get.entity.name(playerID);
        var location = Entity.GetProp(playerID, "CBasePlayer", "m_szLastPlaceName");
        var msg = ">" + player + " has entered " + location + "!";
        if (hasBomb) {
            msg = msg + " And he has the bomb!";
        }
        switch (get.ui.value("BombZone Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    left() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[5]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player = get.entity.name(playerID);
        var msg = ">" + player + " has left the bombsite.";
        if (hasBomb) {
            msg = msg + " And he has the bomb!";
        }
        switch (get.ui.value("BombZone Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    }
};

var locationFinder = {
    whenPressed() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[6]) return;
        var isKeyActive = UI.IsHotkeyActive("Location Hotkey");
        var players = get.entity.players();
        if (UI.IsHotkeyActive("Script items", "Location Hotkey") || get.ui.value("Click For Location!")) {
            UI.SetValue("Click For Location!", false)
            output.printChat(" ");
            var msg = "";
            for (var i = 0; i < players.length; i++) {
                if (get.entity.isAlive(players[i])) {
                    if (get.ui.value("Location of: ") == 0) {
                        msg = get.entity.name(players[i]) + " is at "
                        + Entity.GetProp(players[i], "CBasePlayer", "m_szLastPlaceName")
                    } else if (get.ui.value("Location of: ") == 1 && get.entity.isEnemy(players[i])) {
                        msg = get.entity.name(players[i]) + " is at "
                        + Entity.GetProp(players[i], "CBasePlayer", "m_szLastPlaceName")
                    } else if (get.ui.value("Location of: ") == 2 && !get.entity.isEnemy(players[i])) {
                        msg = get.entity.name(players[i]) + " is at "
                        + Entity.GetProp(players[i], "CBasePlayer", "m_szLastPlaceName")
                    } else {
                        continue;
                    }
                    output.printChat(msg);
                }
            }
            output.printChat(" ")
        }
    }
};

var pantsDown = {
    isReloading() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[7]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player = get.entity.name(playerID);
        var msg = ">" + player + " is reloading!";
        if (get.ui.value("Whitelist ID: " + [playerID]) && get.ui.value("PD: Use Whitelist")) {
            msg = ">" + player + " is reloading!";
        } else if (get.ui.value("PD: Use Whitelist")) {
            return;
        }
        switch (get.ui.value("PantsDown Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    grenadeThrown() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[7]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player = get.entity.name(playerID);
        var grenade = get.event.string("weapon");
        var msg = ">" + player + " threw a " + grenade + "!";
        if (get.ui.value("Whitelist ID: " + [playerID]) && get.ui.value("PD: Use Whitelist")) {
            msg = ">" + player + " threw a " + grenade + "!";
        } else if (get.ui.value("PD: Use Whitelist")) {
            return;
        }
        switch (get.ui.value("PantsDown Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }

    },
    isZoom() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[7]) return;
        var playerID = get.entity.id(get.event.int("userid"));
        var player = get.entity.name(playerID);
        var msg = ">" + player + " is scoping in!";
        if (get.ui.value("Whitelist ID: " + [playerID]) && get.ui.value("PD: Use Whitelist")) {
            msg = ">" + player + " is scoping in!";
        } else if (get.ui.value("PD: Use Whitelist")) {
            return;
        }
        switch (get.ui.value("PantsDown Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    },
    onWeaponFire() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[7]) return;
        if (!get.ui.value("PD: Enable Weaponfire")) return;
        if (get.ui.value("PD: Weaponfire On Key?")) {
            if (!UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "PD: Hotkey")) {
                return;
            }
        }
        var playerID = get.entity.id(get.event.int("userid"));
        var player = get.entity.name(playerID);
        var weapon = get.event.string("weapon");
        var msg = ">" + player + " is shooting with a " + weapon + "!";
        if (get.ui.value("Whitelist ID: " + [playerID]) && get.ui.value("PD: Use Whitelist")) {
            msg = ">" + player + " is shooting with a " + weapon + "!";
        } else if (get.ui.value("PD: Use Whitelist")) {
            return;
        }
        switch (get.ui.value("PantsDown Output")) {
            case 0:
                output.printChat(msg);
                break;
            case 1:
                output.teamSay(msg);
                break;
            case 2:
                output.say(msg);
        }
    }
};

var iSeeYou = {
    lineESP() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[8]) return;
        var playerID = get.entity.players()
        var meID = Entity.GetLocalPlayer();
        var meEyePos = Entity.GetEyePosition(meID);
        var rgba = UI.GetColor("Script items", "ISY: Line Colour");
        var rgba2 = UI.GetColor("Script items", "ISY: Text Colour");
        for (var i = 0; i < playerID.length; i++) {
            var headPos = Entity.GetHitboxPosition(playerID[i], 0);
            var bullet = Trace.Line(meID, meEyePos, headPos);
            var canSee = false;
            try {
                if (bullet[1] > 0.7) {
                    canSee = true;
                } else {
                    canSee = false;
                }
            } catch (e) {
                canSee = true;
            }
            if (get.ui.value("ISY: Use Whitelist")) {
                if (!get.ui.value("Whitelist ID: " + playerID[i])) {
                    continue;
                }
            }
            var lineESP = true;
            var text = false;
            if (get.ui.value("ISY: Show Name")) {
                text = true;
            }
            if (get.ui.value("ISY: OnlyEnemy") && !get.entity.isEnemy(playerID[i])) {
                lineESP = false;
            }
            if (get.ui.value("ISY: Draw on Visible") && !canSee) {
                lineESP = false;
            }
            if (lineESP && Entity.IsAlive(playerID[i]) && !Entity.IsDormant(playerID[i])) {

                var enemyPos = Entity.GetRenderOrigin(playerID[i]);
                var enemyPosScreen = Render.WorldToScreen(enemyPos);
                var myPos = Entity.GetRenderOrigin(meID);
                var myPosScreen = Render.WorldToScreen(myPos);

                Render.Line(enemyPosScreen[0], enemyPosScreen[1],  myPosScreen[0], myPosScreen[1], [rgba[0], rgba[1], rgba[2], rgba[3]]);
                if (get.ui.value("ISY: Show Name")) {
                    Render.String(enemyPosScreen[0], enemyPosScreen[1], 0, Entity.GetName(playerID[i]), [rgba2[0], rgba2[1], rgba2[2], rgba2[3]], get.ui.value("ISY: Text Size"));
                }
            }
        }
    }
};

var iHateYou = {
    iHateYouList() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[9]) return;
        var playerID = Entity.GetPlayers();
        for (var i = 1; i <= 20; i++) {
            UI.SetEnabled("IHY ID: " + i, false);
        }
        for (var i = 1; i <= playerID.length; i++) {
            UI.SetEnabled("IHY ID: " + playerID[i], true);
        }
        output.printChat("=================================");
        for (var i = 0; i < playerID.length; i++) {
            output.printChat("ID:" + playerID[i] + " > " + get.entity.name(playerID[i]));
        }
        output.printChat("=================================");
    },
    rage() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[9]) return;
        if (!get.ui.value("IHY: Enable Rage On Sight")) return;
        var playerID = get.entity.enemies()
        var meID = Entity.GetLocalPlayer();
        var meEyePos = Entity.GetEyePosition(meID);
        var bulletDMG = null;
        for (var i = 0; i < playerID.length; i++) {
            var headPos = Entity.GetHitboxPosition(playerID[i], 0);
            var bulletDMG = Trace.Bullet(meID, meEyePos, headPos);
            var visible = Trace.Line(meID, meEyePos, headPos);
            var canSee = false;
            var minDMG = false;
            var bhWall
            if (!get.ui.value("IHY ID: " + playerID[i])) {
                continue;
            }
            try {
                if (visible[1] > 0.7) {
                    canSee = true;
                } else {
                    canSee = false;
                }
            } catch (e) {
                canSee = true;
            }
            try {
                if (bulletDMG[1] > get.ui.value("IHY: Min Dmg")) {
                    minDMG = bulletDMG[1];
                } else {
                    minDMG = 0;
                }
            } catch (e) {
                mindDMG = 0;
            }
            try {
                if (!visible[1] > 0.3) {
                    bhWall = false;
                } else {
                    bhWall = true;
                }
            } catch (e) {
                bhWall = false;
            }
            var rage = true;
            var antiAim = true;
            if (get.ui.value("IHY: Detect Through Wall")) {
                if (bhWall) {
                    if (minDMG < get.ui.value("IHY: Min Dmg")) {
                        rage = false;
                    }
                }
            } else if (!canSee) {
                rage = false;
            }
            if (rage && Entity.IsAlive(playerID[i]) && !Entity.IsDormant(playerID[i])) {
                UI.SetValue("Rage", "General", "Enabled", true);
                if (get.ui.value("IHY: AntiAim")) {
                    UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", true);
                } else {
                    UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", false);
                }
            } else {
                UI.SetValue("Rage", "General", "Enabled", false);
                UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", false);
                UI.SetValue("Legit", "General", "Enabled", true);
            }

        }
    }
};

var whoVoted = {
    choice: [],
    storage: [],
    voteCasted() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[10]) return;
        whoVoted.storage = []; //Clear Entry
        for (var o = 1; o < get.event.int("count"); o++) {
            whoVoted.choice[o] = Event.GetString("option" + o);
        }
    },
    voteChoice() {
        var mode = get.ui.mode("Activate Mode(s)");
        if (!mode[10]) return;
        whoVoted.storage.push({
            name: get.entity.name(Event.GetInt("entityid")),
            choice: whoVoted.choice[Event.GetInt("vote_option")]
        });
        Global.PrintChat("============================================");
        Global.PrintChat("                SELECT ONE                  ");
        for (i = 0; i < whoVoted.storage.length; i++) {
                Global.PrintChat(whoVoted.storage[i].name + " voted " + whoVoted.storage[i].choice);
        }
    	Global.PrintChat("============================================");
    }
}
main();