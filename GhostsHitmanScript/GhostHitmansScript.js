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
            "Aimbot",
            "Tracers"

        ]);
        UI.AddDropdown("Show Menu(s)", [
            "None",
            "Aimbot",
            "Hitlist",
            "Tracers"
        ]);

        UI.AddCheckbox("Hitlist: Refresh");
        for (var i = 1; i <= 35; i++) {
            UI.AddCheckbox("Player ID: " + i);
            UI.SetEnabled("Player ID: " + i, false);
        }

        UI.AddCheckbox("Tracers: Draw on Visible");
        UI.AddColorPicker("Tracers: Line Colour");
        UI.AddColorPicker("Tracers: Text Colour");
        UI.AddSliderInt("Tracers: Text Size", 1, 48);

        UI.AddCheckbox("Aimbot: Aim Through Wall");
        UI.AddSliderInt("Aimbot: Min Dmg", 0, 150);
        UI.AddCheckbox("Aimbot: AntiAim");
        UI.AddCheckbox("Aimbot: Aimbot With No Resolver");
        UI.AddCheckbox("Aimbot: Rage only on Target");
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
        menu.update.hitList(menuSelection == 2 ? true : false); //HitList
        menu.update.tracers(menuSelection == 3 ? true : false); //Tracers
    },
    update: {
        aimbot(state) {
            UI.SetEnabled("Aimbot: Aim Through Wall", state);
            UI.SetEnabled("Aimbot: Min Dmg", state);
            UI.SetEnabled("Aimbot: AntiAim", state);
            UI.SetEnabled("Aimbot: Hitbox Selection", state);
            if (state) {
                if (!get.ui.value("Aimbot: Aimbot With No Resolver")) {
                    UI.SetEnabled("Aimbot: Rage only on Target", true);
                } else {
                    UI.SetEnabled("Aimbot: Rage only on Target", false);
                }
                if (!get.ui.value("Aimbot: Rage only on Target")) {
                    UI.SetEnabled("Aimbot: Aimbot With No Resolver", true);
                } else {
                    UI.SetEnabled("Aimbot: Aimbot With No Resolver", false);
                }
            } else {
                UI.SetEnabled("Aimbot: Aimbot With No Resolver", state);
                UI.SetEnabled("Aimbot: Rage only on Target", state);
            }


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

var aimbot = {
    aim() {
        var mode = menu.getMode();
        if (!mode[0]) return;
        var localID = Entity.GetLocalPlayer();
        var localEyePos = Entity.GetEyePosition(localID);
        var hitboxSelect = get.ui.value("Aimbot: Hitbox Selection");
        target.checkBullet(hitboxSelect);
        if (get.ui.value("Aimbot: AntiAim") && target.isVisible) {
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", true);
            UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Enabled", true);
            UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Extend angle", true);
        } else {
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Enabled", false);
            UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Enabled", false);
            UI.SetValue("Anti-Aim", "Legit Anti-Aim", "Extend angle", false);
        }
        if (!get.ui.value("Aimbot: Aim Through Wall") && !target.isVisible) return;
        if (get.ui.value("Aimbot: Aimbot With No Resolver")) {
            UI.SetValue("Rage", "General", "Enabled", false);
            UI.SetValue("Legit", "General", "Enabled", true);
            if (!target.canShoot) return;
            aimbot.aimOnTarget(target.id, localEyePos, hitboxSelect);
        } else {
            if (Entity.IsAlive(target.id)) {
                UI.SetValue("Legit", "General", "Enabled", false);
                if (get.ui.value("Aimbot: Rage only on Target")) {
                    var rageTarget = Ragebot.GetTarget();
                    if (rageTarget != target.id) {
                        Ragebot.IgnoreTarget(rageTarget);
                    }
                }
                Ragebot.ForceTarget(target.id);
                UI.SetValue("Rage", "General", "Enabled", true);
            } else {
                UI.SetValue("Rage", "General", "Enabled", false);
                UI.SetValue("Legit", "General", "Enabled", true)
            }
        }
    },
    aimOnTarget(playerID, myEyePos, hitbox) {
        if (!get.ui.value("Player ID: " + playerID) || !Entity.IsValid(playerID) || !Entity.IsAlive(playerID)) return;
                var target = Entity.GetHitboxPosition(playerID, hitbox);
                var myEyePos = Entity.GetEyePosition(Entity.GetLocalPlayer());
                var enemyVec = [target[0], target[1], target[2]];
                function calc() {
                    return [target[0] - myEyePos[0], target[1] - myEyePos[1], target[2] - myEyePos[2],]
                }
                calcs = calc();
                var yaw = Math.atan2(calcs[1], calcs[0]) * 180 / Math.PI;
                var pitch = -(Math.atan2(calcs[2], Math.sqrt(calcs[0] ** 2 + calcs[1] ** 2)) * 180 / Math.PI);
                Local.SetViewAngles([pitch, yaw, 0]) ;
    }
}

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
            if (Entity.IsDormant(playerID[i]) || !get.ui.value("Player ID: " + playerID[i]) || !Entity.IsValid(playerID[i]) || !Entity.IsAlive(playerID[i])) continue;
            if (get.ui.value("Tracers: Draw on Visible")) {
                    if (!target.isVisible) continue;
            }
            if (Entity.IsAlive(playerID[i]) && !Entity.IsDormant(playerID[i])) {
                target.id = playerID[i];
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
    id: {value:0, writeable: true},
    isVisible: {value: false, writeable: true},
    canShoot: {value: false, writeable: true},
    checkBullet(hitbox) {
        try {
            var localID = Entity.GetLocalPlayer();
            var localEyePos = Entity.GetEyePosition(localID);
            var hitboxPos = Entity.GetHitboxPosition(target.id, hitbox);
            var bullet = Trace.Bullet(localID, target.id, localEyePos, hitboxPos);
            if (bullet[2]) {
                target.canShoot = true;
            } else {
                target.canShoot = false;
            }
            if (bullet[1] > get.ui.value("Aimbot: Min Dmg")) {
                target.canShoot = true;
            } else {
                target.canShoot = false;
            }
        } catch (e) {
            target.canShoot = true;
        }
    },
    checkVisible() {
        try {
            var localID = Entity.GetLocalPlayer();
            var localEyePos = Entity.GetEyePosition(localID);
            var headPos = Entity.GetHitboxPosition(target.id, 0);
            var bullet = Trace.Line(localID, localEyePos, headPos);
            if (bullet[1] > 0.3) {
                target.isVisible = true;
            } else {
                target.isVisible = false;
            }
        } catch (e) {
            target.isVisible = true;
        }
    }
}


function main() {
    menu.init();
    Cheat.RegisterCallback("Draw", "menu.logic");
    Cheat.RegisterCallback("Draw", "tracers.trace");
    Cheat.RegisterCallback("CreateMove", "target.checkVisible");
    Cheat.RegisterCallback("CreateMove", "aimbot.aim");
}

main();

//Make Objects writeable;
