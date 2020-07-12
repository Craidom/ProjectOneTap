/*
GhostDaSnipa's Hitman Script V1
updated 11 July 2020 16:55 PST
*/

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

var menu = {
    //values
    getMode() {
        return get.ui.mode("Activate Mode(s)");
    },
    //Functions
    init() {
        UI.AddMultiDropdown("Activate Mode(s)", [
            "Bomb Locater",
            "Tracers",
            "Aimbot"
        ]);
        UI.AddDropdown("Show Menu(s)", [
            "None",
            "Aimbot",
            "Bomb Locater",
            "Hitlist",
            "Tracers"
        ]);

        UI.AddCheckbox("Hitlist: Refresh");
        for (var i = 1; i <= 35; i++) {
            UI.AddCheckbox("Player ID: " + i);
            UI.SetEnabled("Player ID: " + i, false);
        }

        UI.AddDropdown("Bomb Locater", [
            "PrintChat",
            "TeamSay",
            "Say"
        ]);
        UI.AddDropdown("Bomb: PrintChatColor", [
            "Default",
            "Red",
            "Purple",
            "Green",
            "Blue",
            "Yellow",
            "Brown"
        ]);

        UI.AddCheckbox("Tracers: Draw on Visible");
        UI.AddColorPicker("Tracers: Line Colour");
        UI.AddColorPicker("Tracers: Text Colour");
        UI.AddSliderInt("Tracers: Text Size", 1, 48);

        UI.AddCheckbox("Aimbot: Aim Through Wall");
        UI.AddSliderInt("Aimbot: Min Dmg", 0, 150);
        UI.AddCheckbox("Aimbot: AntiAim when seen");
        UI.AddCheckbox("Aimbot: Aimbot With No Resolver");
        UI.AddDropdown("Aimbot: Hitbox Selection", [
            "Head",
            "Neck",
            "Pelvis",
            "Body",
            "Thorax",
            "Chest",
            "Upper Chest",
            "Left Thigh",
            "Right Thigh",
            "Left Calf",
            "Right Calf",
            "Left Foot",
            "Right Foot",
            "Left Hand",
            "Right Hand",
            "Left Upper Arm",
            "Left Forearm",
            "Right Upper Arm",
            "Right Forearm"
        ]);
    },
    color(choice) {
        var color = " \x01";
        switch (choice) {
            case 0: //default
                color = " \x01";
                break;
            case 1: //red
                color = " \x02";
                break;
            case 2: //purple
                color = " \x03";
                break;
            case 3: //green
                color = " \x04";
                break;
            case 4: //blue
                color = " \x0C";
                break;
            case 5: //yellow
                color = " \x09";
                break;
            case 6: // brown
                color = " \x10";
                break;
        }
        return color;
    },
    logic() {
        if (!UI.IsMenuOpen()) return;
        var menuSelection = get.ui.value("Show Menu(s)");
        menu.update.aimbot(menuSelection == 1 ? true : false); //Aimbot
        menu.update.bombLocater(menuSelection == 2 ? true : false); //BombLocater
        menu.update.hitList(menuSelection == 3 ? true : false); //HitList
        menu.update.tracers(menuSelection == 4 ? true : false); //Tracers
    },
    update: {
        aimbot(state) {
            UI.SetEnabled("Aimbot: Aim Through Wall", state);
            UI.SetEnabled("Aimbot: Min Dmg", state);
            UI.SetEnabled("Aimbot: AntiAim when seen", state);
            UI.SetEnabled("Aimbot: Aimbot With No Resolver", state);
            UI.SetEnabled("Aimbot: Hitbox Selection", state);
        },
        bombLocater(state) {
            UI.SetEnabled("Bomb Locater", state);
            UI.SetEnabled("Bomb: PrintChatColor", state);
        },
        hitList(state) {
            UI.SetEnabled("Hitlist: Refresh", state);
            if (!state) {
                for (var i = 1; i <= 35; i++) {
                    UI.SetEnabled("Player ID: " + i, false);
                }
            }
            if (get.ui.value("Hitlist: Refresh")) {
                UI.SetValue("Hitlist: Refresh", false);
                hitList.refresh();
            }
        },
        tracers(state) {
            UI.SetEnabled("Tracers: Draw on Visible", state);
            UI.SetEnabled("Tracers: Line Colour", state);
            UI.SetEnabled("Tracers: Text Colour", state);
            UI.SetEnabled("Tracers: Text Size", state);
        }
    }
};

var hitList = {
    refresh() {
        var players = get.entity.players();
        output.printChat(" \x0C=================================");
        for (var i = 0; i < players.length; i++) {
            if (get.entity.isMe(players[i])) {
                output.printChat(" \x03ID:" + players[i] + " > " + get.entity.name(players[i]));
            } else if (get.entity.isEnemy(players[i])) {
                output.printChat(" \x02ID:" + players[i] + " > " + get.entity.name(players[i]));
            } else if (!get.entity.isEnemy(players[i])) {
                output.printChat(" \x04ID:" + players[i] + " > " + get.entity.name(players[i]));
            }
        }
        output.printChat(" \x0C=================================");
        for (var i = 0; i < players.length; i++) {
            UI.SetEnabled("Player ID: " + players[i], true);
        }
        return players;
    }
};

var tracers = {
    trace() {
        var mode = menu.getMode();
        if (!mode[1]) return;
        var playerID = get.entity.players();
        var localID = Entity.GetLocalPlayer();
        var localEyePos = Entity.GetEyePosition(localID);
        var rgba = UI.GetColor("Script items", "Tracers: Line Colour");
        var rgba2 = UI.GetColor("Script items", "Tracers: Text Colour");
        for (var i = 0; i < playerID.length; i++) {
            target.setID(playerID[i]);
            if (!get.ui.value("Player ID: " + playerID[i]) || !Entity.IsValid(playerID[i]) || !Entity.IsAlive(playerID[i])) continue;
            var headPos = Entity.GetHitboxPosition(playerID[i], 0);
            var bullet = Trace.Line(localID, localEyePos, headPos);
            if (get.ui.value("Tracers: Draw on Visible")) {
                try {
                    if (!Entity.IsDormant(playerID[i]) && target.isVisible) {
                        var log = log;
                    } else {
                        continue;
                    }
                } catch (error) {
                    var useless = error;
                }
            }
            if (Entity.IsAlive(playerID[i]) && !Entity.IsDormant(playerID[i])) {
                var enemyPos = Entity.GetRenderOrigin(playerID[i]);
                var enemyPosScreen = Render.WorldToScreen(enemyPos);
                var localPos = Entity.GetRenderOrigin(localID);
                var localPosScreen = Render.WorldToScreen(localPos);
                Render.Line(enemyPosScreen[0], enemyPosScreen[1],  localPosScreen[0], localPosScreen[1], [rgba[0], rgba[1], rgba[2], rgba[3]]);
                Render.String(enemyPosScreen[0], enemyPosScreen[1], 0, Entity.GetName(playerID[i]), [rgba2[0], rgba2[1], rgba2[2], rgba2[3]], get.ui.value("Tracers: Text Size"));
            }
        }
    }
};

var target = {
    id: 0,
    isVisible: false,
    canShoot: false,
    checkVisible() {
        try {
            var localID = Entity.GetLocalPlayer();
            var localEyePos = Entity.GetEyePosition(localID);
            var headPos = Entity.GetHitboxPosition(target.id, 0);
            var bullet = Trace.Line(localID, localEyePos, headPos);
            if (bullet[1] > 0.7) {
                target.isVisible = true;
            } else {
                target.isVisible = false;
            }
        } catch (e) {
            target.isVisible = true;
        }
    },
    setID(id) {
        target.id = id;
    }
}


function main() {
    menu.init();
    Cheat.RegisterCallback("Draw", "menu.logic");
    Cheat.RegisterCallback("Draw", "tracers.trace");
    Cheat.RegisterCallback("CreateMove", "target.checkVisible");
}

main();
