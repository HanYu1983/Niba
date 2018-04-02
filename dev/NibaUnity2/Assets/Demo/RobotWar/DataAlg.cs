using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanPathFindingAPI;
using System;
using System.Linq;

namespace RobotWar
{
    public class Grid : IGraphNode, IEquatable<Grid>
    {
        public readonly Vector2Int pos;
        public string prototype;
        public Grid(Vector2Int pos)
        {
            this.pos = pos;
        }
        public string Key
        {
            get
            {
                return pos.y + "_" + pos.x;
            }
        }
        public int GetDistance(IGraphNode other)
        {
            return GetDistance(other as Grid);
        }

        public bool Equals(Grid other)
        {
            return Key.Equals(other.Key);
        }

        public override bool Equals(object other)
        {
            if (!(other is Grid))
                return false;

            return Equals(other as Grid);
        }

        public override int GetHashCode()
        {
            int hash = 23;

            hash = (hash * 37) + (int)pos.x;
            hash = (hash * 37) + (int)pos.y;
            return hash;
        }
    }

    public class Unit
    {
        public string key;
        public string prototype;
        public int owner;
        public int hp, en;
        public float ct;
        public bool alreadyMove;
        public Unit(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                this.key = Guid.NewGuid().ToString();
            } else
            {
                this.key = key;
            }
        }
        public string Key
        {
            get
            {
                return key;
            }
        }
    }

    public class Weapon
    {
        public string key;
        public string prototype;
        public int level;

        public Weapon()
        {
            key = Guid.NewGuid().ToString();
        }
        public string Key
        {
            get
            {
                return key;
            }
        }
    }

    public class Pilot
    {
        public string key;
        public string prototype;
        public int exp;
        public Pilot()
        {
            key = Guid.NewGuid().ToString();
        }
        public string Key
        {
            get
            {
                return key;
            }
        }
    }

    public class Player
    {
        public int key;
        public Player(int key)
        {
            this.key = key;
        }
        public int Key { get { return key;  } }
        public bool isAI;
        public int team;
    }

    public class Task
    {
        public const string UnitAttack = "Unit{0} use Weapon{1} attack {2}";
        public string description;
        public List<string> values = new List<string>();
        public float ct;
        public string owner;
    }

    public class Context
    {
        // home
        public Dictionary<string, Unit> units = new Dictionary<string, Unit>();
        public Dictionary<string, Weapon> weapons = new Dictionary<string, Weapon>();
        public Dictionary<string, Pilot> pilots = new Dictionary<string, Pilot>();
        public Dictionary<string, string> weapon2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> pilot2Unit = new Dictionary<string, string>();
        // map
        public Dictionary<string, Grid> grids = new Dictionary<string, Grid>();
        public Dictionary<string, string> grid2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> unit2Grid = new Dictionary<string, string>();
        public List<Task> tasks = new List<Task>();
        public List<Player> players = new List<Player>();
        public int turn;
        public string lastUnitPos;
        // tmp
        public List<Dictionary<string, int>> fireCost = new List<Dictionary<string, int>>();
    }

    public class DataAlg
    {
        static AStarPathfinding pathFiniding = new AStarPathfinding();

        public static IPathfinding.GetNeigboursFn<Grid> GetNeigbours(Context ctx, Vector2Int pos)
        {
            var unitKey = ctx.grid2Unit[new Grid(pos).Key];
            var unit = ctx.units[unitKey];
            var player = ctx.players[unit.owner];
            var dirs = new Vector2Int[]
            {
                new Vector2Int(1, 0),new Vector2Int(0, 1),new Vector2Int(-1, 0),new Vector2Int(0, -1)
            };
            return (Grid curr) =>
            {
                var ret = new Dictionary<Grid, int>();
                var oriPos = curr.pos;
                var oriData = ConfigGrid.Get(ConfigGrid.ID_plain);
                var cost = oriData.cost;
                var posKey = new Grid(oriPos).Key;
                if (ctx.fireCost.Count > player.team && ctx.fireCost[player.team].ContainsKey(posKey))
                {
                    var fireCost = ctx.fireCost[player.team][posKey];
                    cost += fireCost;
                }
                foreach (var v in dirs)
                {
                    var newPos = oriPos + v;
                    var gk = new Grid(newPos).Key;
                    if (ctx.grids.ContainsKey(gk) == false)
                    {
                        continue;
                    }
                    if(ctx.grid2Unit.ContainsKey(gk))
                    {
                        continue;
                    }
                    var g = ctx.grids[gk];
                    ret.Add(g, cost);
                }
                return ret;
            };
        }

        public static IPathfinding.GetNeigboursFn<Grid> GetNeigboursForRangeAttack(Context ctx)
        {
            var dirs = new Vector2Int[]
            {
                new Vector2Int(1, 0),new Vector2Int(0, 1),new Vector2Int(-1, 0),new Vector2Int(0, -1)
            };
            return (Grid curr) =>
            {
                var ret = new Dictionary<Grid, int>();
                var oriPos = curr.pos;
                var cost = 1;
                foreach (var v in dirs)
                {
                    var newPos = oriPos + v;
                    var gk = new Grid(newPos).Key;
                    if (ctx.grids.ContainsKey(gk) == false)
                    {
                        continue;
                    }
                    var g = ctx.grids[gk];
                    ret.Add(g, cost);
                }
                return ret;
            };
        }

        public static List<Grid> FindPath(Context ctx, Vector2Int s, Vector2Int e)
        {
            var sk = new Grid(s).Key;
            var ek = new Grid(e).Key;

            var grids = ctx.grids;
            if (grids.ContainsKey(sk) == false)
            {
                throw new Exception("xxx");
            }
            if (grids.ContainsKey(ek) == false)
            {
                throw new Exception("xxx");
            }
            return pathFiniding.FindPath(GetNeigbours(ctx, s), grids[sk], grids[ek]);
        }

        public static Dictionary<Grid, List<Grid>> FindAllPath(Context ctx, int movePower, Vector2Int s)
        {
            var sk = new Grid(s).Key;

            var grids = ctx.grids;
            if (grids.ContainsKey(sk) == false)
            {
                throw new Exception("grid not found:"+sk);
            }
            return DijkstraPathfinding.FindAllPaths(GetNeigbours(ctx, s), movePower, grids[sk]);
        }

        public static Dictionary<Grid, List<Grid>> FindAllRange(Context ctx, int min, int max, Vector2Int s)
        {
            var sk = new Grid(s).Key;

            var grids = ctx.grids;
            if (grids.ContainsKey(sk) == false)
            {
                throw new Exception("grid not found:" + sk);
            }
            var paths = DijkstraPathfinding.FindAllPaths(GetNeigboursForRangeAttack(ctx), max, grids[sk]);
            foreach(var k in new Dictionary<Grid, List<Grid>>(paths).Keys)
            {
                if(paths[k].Count < min)
                {
                    paths.Remove(k);
                }
            }
            return paths;
        }

        public static List<Weapon> GetWeaponList(Context ctx, string unit)
        {
            //return new List<Weapon>(ctx.weapons.Values).FindAll(w => w.ownerUnit == unit);
            return ctx.weapon2Unit.Keys.Where(k => ctx.weapon2Unit[k] == unit).Select(k => ctx.weapons[k]).ToList();
        }

        public static void AssignPilot(Context ctx, string pilot, string unit)
        {
            var pilotNotFound = ctx.pilots.ContainsKey(pilot) == false;
            if (pilotNotFound)
            {
                throw new System.Exception("pilotNotFound");
            }
            var unitNotFound = ctx.units.ContainsKey(unit) == false;
            if (unitNotFound)
            {
                throw new System.Exception("unitNotFound");
            }
            if (ctx.pilot2Unit.ContainsKey(pilot))
            {
                // 駕駛切換座機
                ctx.pilot2Unit[pilot] = unit;
            }
            else
            {
                // 無座機的駕駛指派座機
                ctx.pilot2Unit.Add(pilot, unit);
            }
        }

        public static Pilot GetPilot(Context ctx, string unit)
        {
            return ctx.pilot2Unit.Keys.Where(k => ctx.pilot2Unit[k] == unit).Select(p => ctx.pilots[p]).FirstOrDefault();
        }

        public static int GetMovePower(Context ctx, string unit)
        {
            var unitObj = ctx.units[unit];
            var cfg = ConfigUnit.Get(unitObj.prototype);
            var weight = GetWeaponList(ctx, unit).Select(w => ConfigWeapon.Get(w.prototype)).Sum(w => w.unitPowerCost);
            var power = cfg.power - weight;
            return power;
        }

        public static float Speed2CT(float speed)
        {
            return speed;
        }

        public static float UnitSpeed(Context ctx, string unitKey)
        {
            // 沒有駕駛員不能行動
            var pilot = GetPilot(ctx, unitKey);
            if(pilot == null)
            {
                return 0;
            }
            var unit = ctx.units[unitKey];
            var cfg = ConfigUnit.Get(unit.prototype);
            return cfg.speed;
        }

        public static void StepCT(Context ctx)
        {
            foreach(var u in ctx.units.Values)
            {
                var cfg = ConfigUnit.Get(u.prototype);
                u.ct += Speed2CT(UnitSpeed(ctx, u.Key));
            }
            foreach(var t in ctx.tasks)
            {
                t.ct -= Speed2CT(UnitSpeed(ctx, t.owner));
            }
            ctx.turn += 1;
        }

        public static Task GetTopTask(Context ctx)
        {
            var ret = ctx.tasks;
            return ret.OrderBy(u => u.ct).Where(u=> u.ct<=0).FirstOrDefault();
        }

        public static Unit GetTopCTUnit(Context ctx)
        {
            var ret = new List<Unit>(ctx.units.Values);
            return ret.OrderByDescending(u => u.ct).Where(u=> u.ct>=1).FirstOrDefault();
        }

        public static void PassUnit(Context ctx, string unitKey)
        {
            ctx.units[unitKey].ct -= 1;
            ctx.units[unitKey].alreadyMove = false;
        }

        public static Player CreatePlayer(Context ctx, int team, bool isAI)
        {
            var p = new Player(ctx.players.Count);
            p.team = team;
            p.isAI = isAI;
            ctx.players.Add(p);
            return p;
        }

        public static Dictionary<string, int> GetFileCostDict(Context ctx, int team)
        {
            if(ctx.fireCost.Count < team + 1)
            {
                var shouldAddCount = team + 1 - ctx.fireCost.Count;
                for (var i=0; i<shouldAddCount; ++i)
                {
                    ctx.fireCost.Add(new Dictionary<string, int>());
                }
            }
            return ctx.fireCost[team];
        }

        public static void CalcFileCost(Context ctx, int team)
        {
            var fireDict = GetFileCostDict(ctx, team);
            fireDict.Clear();
            foreach (var unitObj in ctx.units.Values)
            {
                var ownerObj = ctx.players[unitObj.owner];
                var grid = ctx.grids[ctx.unit2Grid[unitObj.Key]];
                var isEnemy = team != ownerObj.team;
                if(isEnemy == false)
                {
                    continue;
                }
                foreach(var weaponObj in GetWeaponList(ctx, unitObj.Key))
                {
                    var cfg = ConfigWeapon.Get(weaponObj.prototype);
                    var allRange = FindAllRange(ctx, cfg.minRange, cfg.maxRange, grid.pos);
                    foreach(var g in allRange.Keys)
                    {
                        if (fireDict.ContainsKey(g.Key) == false)
                        {
                            fireDict[g.Key] = 0;
                        }
                        fireDict[g.Key] += 5;
                    }
                }
            }
        }

        public static void MoveUnit(Context ctx, Vector2Int dist, string unitKey, bool force = false)
        {
            if(force == false && ctx.units[unitKey].alreadyMove)
            {
                throw new Exception("already move");
            }
            var hasOldGrid = ctx.unit2Grid.ContainsKey(unitKey);
            if(hasOldGrid == false)
            {
                throw new Exception("XXX");
            }
            // clear old pos
            var oldGrid = ctx.unit2Grid[unitKey];
            ctx.grid2Unit.Remove(oldGrid);
            // change to new pos
            ctx.unit2Grid[unitKey] = new Grid(dist).Key;
            ctx.grid2Unit[new Grid(dist).Key] = unitKey;
            ctx.units[unitKey].alreadyMove = true;
            if (force == false)
            {
                ctx.lastUnitPos = oldGrid;
            }
        }

        public static string CancelMoveUnit(Context ctx, string unitKey)
        {
            var isNotValidPos = string.IsNullOrEmpty(ctx.lastUnitPos);
            if (isNotValidPos)
            {
                throw new Exception("XXXX");
            }
            MoveUnit(ctx, ctx.grids[ctx.lastUnitPos].pos, unitKey, true);
            ctx.units[unitKey].alreadyMove = false;
            return ctx.lastUnitPos;
        }

        public static Unit CreateUnit(Context ctx, string prototype, int owner, Vector2Int pos)
        {
            if(ctx.players.Count < owner+1)
            {
                throw new Exception("player not exist:"+owner);
            }
            var gk = new Grid(pos).Key;
            var hasUnit = ctx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                throw new System.Exception("has unit:"+gk);
            }
            var unit = new Unit(null);
            unit.prototype = prototype;
            unit.owner = owner;
            ctx.units.Add(unit.Key, unit);
            ctx.grid2Unit[gk] = unit.Key;
            ctx.unit2Grid[unit.Key] = gk;
            return unit;
        }

        public static Weapon CreateWeapon(Context ctx, string unitKey, string prototype)
        {
            var w = new Weapon();
            w.prototype = prototype;
            ctx.weapons.Add(w.Key, w);
            ctx.weapon2Unit.Add(w.Key, unitKey);
            return w;
        }

        public static Pilot CreatePilot(Context ctx, string prototype)
        {
            var p = new Pilot();
            p.prototype = prototype;
            ctx.pilots.Add(p.Key, p);
            return p;
        }

        public static Task CreateAttackTask(Context ctx, string unitKey, string weaponKey, List<string> targets)
        {
            var t = new Task();
            t.description = Task.UnitAttack;
            t.owner = unitKey;
            t.values.Add(unitKey);
            t.values.Add(weaponKey);
            t.values.Add(string.Join(",", targets.ToArray()));

            var weaponObj = ctx.weapons[weaponKey];
            var cfg = ConfigWeapon.Get(weaponObj.prototype);
            t.ct = cfg.prepareTime;
            return t;
        }

        public static void PushTask(Context ctx, Task task)
        {
            ctx.tasks.Add(task);
        }

        public static void CompleteTask(Context ctx, Task task)
        {
            ctx.tasks.Remove(task);
        }
    }
}