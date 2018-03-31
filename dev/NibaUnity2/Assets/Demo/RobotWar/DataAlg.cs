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
        public string ownerUnit;

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
        public bool isAI;
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
        public Dictionary<string, Unit> units = new Dictionary<string, Unit>();
        public Dictionary<string, Weapon> weapons = new Dictionary<string, Weapon>();
        public Dictionary<string, Pilot> pilots = new Dictionary<string, Pilot>();

        public Dictionary<string, Grid> grids = new Dictionary<string, Grid>();
        public Dictionary<string, string> grid2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> unit2Grid = new Dictionary<string, string>();
        public Dictionary<string, string> unit2Polot = new Dictionary<string, string>();
        public List<Task> tasks = new List<Task>();

        public List<Player> players = new List<Player>();
        public int turn;
    }

    public class DataAlg
    {
        static AStarPathfinding pathFiniding = new AStarPathfinding();

        public static IPathfinding.GetNeigboursFn<Grid> GetNeigbours(Context ctx)
        {
            var dirs = new Vector2Int[]
            {
                new Vector2Int(1, 0),new Vector2Int(0, 1),new Vector2Int(-1, 0),new Vector2Int(0, -1)
            };
            return (Grid curr) =>
            {
                var ret = new Dictionary<Grid, int>();
                var oriPos = curr.pos;
                var oriData = new ConfigGrid();
                var cost = 1;// oriData.cost;
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
            return pathFiniding.FindPath(GetNeigbours(ctx), grids[sk], grids[ek]);
        }

        public static Dictionary<Grid, List<Grid>> FindAllPath(Context ctx, int movePower, Vector2Int s)
        {
            var sk = new Grid(s).Key;

            var grids = ctx.grids;
            if (grids.ContainsKey(sk) == false)
            {
                throw new Exception("grid not found:"+sk);
            }
            return DijkstraPathfinding.FindAllPaths(GetNeigbours(ctx), movePower, grids[sk]);
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
            return new List<Weapon>(ctx.weapons.Values).FindAll(w => w.ownerUnit == unit);
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
            ctx.unit2Polot.Add(unit, pilot);
        }

        public static int GetMovePower(Context ctx, string unit)
        {
            return 10;
        }

        public static float Speed2CT(float speed)
        {
            return 0.1f;
        }

        public static float UnitSpeed(Context ctx, string unitKey)
        {
            var cfg = new ConfigUnit();
            return cfg.speed;
        }

        public static void StepCT(Context ctx)
        {
            foreach(var u in ctx.units.Values)
            {
                var cfg = new ConfigUnit();
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
        }

        public static Unit CreateUnit(Context ctx, Vector2Int pos, string prototype)
        {
            var gk = new Grid(pos).Key;
            var hasUnit = ctx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                throw new System.Exception("has unit:"+gk);
            }
            var unit = new Unit(null);
            unit.prototype = prototype;
            ctx.units.Add(unit.Key, unit);
            ctx.grid2Unit[gk] = unit.Key;
            ctx.unit2Grid[unit.Key] = gk;
            return unit;
        }

        public static Weapon CreateWeapon(Context ctx, string unitKey, string prototype)
        {
            var w = new Weapon();
            w.prototype = prototype;
            w.ownerUnit = unitKey;
            ctx.weapons.Add(w.Key, w);
            return w;
        }

        public static Task CreateAttackTask(Context ctx, string unitKey, string weaponKey, List<string> targets)
        {
            var t = new Task();
            t.description = Task.UnitAttack;
            t.values.Add(unitKey);
            t.values.Add(weaponKey);
            t.values.Add(string.Join(",", targets.ToArray()));

            var cfg = new ConfigWeapon();
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