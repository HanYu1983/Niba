using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanPathFindingAPI;
using System;
using System.Linq;
using UnityEngine.Assertions;

namespace RobotWar
{
    public struct PolarVector
    {
        public float radius, angle;

        public PolarVector(float radius, float angle)
        {
            this.radius = radius;
            this.angle = angle;
        }

        public static float NormalizeAngle(float angle)
        {
            var ret = angle;
            while (ret < 0)
            {
                ret += 2 * Mathf.PI;
            }
            ret = ret % Mathf.PI;
            return ret;
        }

        public static float Angle(PolarVector a, PolarVector b)
        {
            var ret = Mathf.Abs(NormalizeAngle(a.angle) - NormalizeAngle(b.angle));
            if(ret > Mathf.PI)
            {
                return 2 * Mathf.PI - ret;
            }
            return ret;
        }

        public static Vector2 Polar2Vector2(PolarVector p)
        {
            return new Vector2(Mathf.Cos(p.angle) * p.radius, Mathf.Sign(p.angle) * p.radius);
        }

        public static Vector2 NormalVector2(Vector2 v)
        {
            var n = Vector3.Cross(Vector3.forward, v);
            return new Vector2(n.x, n.y).normalized;
        }

        public static float DistanceBetweenLineAndDot(Vector2 p1, Vector2 p2, Vector2 p3)
        {
            var line = p2 - p1;
            var line2 = p3 - p1;
            return Vector2.Dot(line2, NormalVector2(line));
        }

        public static float Area(PolarVector a, PolarVector b)
        {
            var d1 = Polar2Vector2(a);
            var d2 = Polar2Vector2(b);
            if(d1 == Vector2.zero)
            {
                return 0;
            }
            if (d2 == Vector2.zero)
            {
                return 0;
            }
            var l1 = d1 - Vector2.zero;
            var l2 = d2 - Vector2.zero;
            var l1n = l1.normalized;
            var len1 = Vector2.Dot(l2, l1n);
            var len2 = l1.magnitude - len1;
            var h = Mathf.Abs(DistanceBetweenLineAndDot(Vector2.zero, d1, d2));
            return (len1 * h) / 2 + (len2 * h) / 2;
        }

        public static float Region(int num)
        {
            return (2 * Mathf.PI) / num;
        }

        public static float WhereRegion(float region, float angle)
        {
            return angle / region;
        }
    }


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

    public enum Direction
    {
        Up, Down, Left, Right
    }

    public struct UnitLevels
    {
        public int hp, en, armor, speed, power;
    }
    
    public class Unit
    {
        public string key;
        public string prototype;
        public int owner;
        public int usedHp, usedEn;
        public float ct;
        public Direction direction;
        public bool alreadyMove;
        public UnitLevels levels;
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
        public int usedBulletCount;

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

    public class Item
    {
        public string key;
        public string prototype;
        public Item()
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

    public class DeffendValue
    {
        public int unitArmor;
        public int unitSpeed;
        public int unitPower;
        public int pilotFighting;
        public int pilotShooting;
        public int pilotHitRate;
        public int pilotAvoidanceRate;
        public int pilotTechnique;
        public int pilotLucky;
    }

    public class AttackValue : DeffendValue
    {
        public string weaponBulletType;
        public int weaponMaxRange;
        public int weaponPower;
        public float distance;

        public float GetHitRate(DeffendValue b)
        {
            var hitPoint = pilotHitRate + unitSpeed + pilotLucky;
            var avoidanceRate = b.pilotAvoidanceRate + b.unitSpeed + b.pilotLucky;
            return hitPoint/2*avoidanceRate;
        }

        public Dictionary<string, float> GetAttackAbility(DeffendValue b)
        {
            return null;
        }

        public Dictionary<string, float> GetDeffendAbility(DeffendValue b)
        {
            return null;
        }

        public int Damage(DeffendValue b)
        {
            var damage = weaponPower - b.unitArmor;

            var power2 = 0f;

            var region = PolarVector.Region(5);
            var wp = new PolarVector();
            var tp = new PolarVector();
            var angle = PolarVector.Angle(wp, tp);

            var isBad = angle < region;
            var isGood = region < angle && angle < (2 * region);
            if (isBad)
            {
                power2 = 100 * PolarVector.Area(wp, tp);
            }

            if (isGood)
            {
                power2 = 100 * PolarVector.Area(wp, tp);
            }
            var damage2 = (power2 * power2) / (power2 + b.unitArmor);
            if (isBad)
            {
                damage2 = -damage2;
            }
            return (int)(damage*0.7 + damage2*0.3);
        }
    }

    public class Task
    {
        public const string UnitAttack = "Unit{0} use Weapon{1} attack unit{2}";
        public const string UnitRangeAttack = "Unit{0} use Weapon{1} range attack grid{2}";
        public string description;
        public List<string> values = new List<string>();
        public float ct;
        public string owner;
    }

    public class Context
    {
        // home
        public int money;
        public Dictionary<string, Unit> units = new Dictionary<string, Unit>();
        public Dictionary<string, Weapon> weapons = new Dictionary<string, Weapon>();
        public Dictionary<string, Pilot> pilots = new Dictionary<string, Pilot>();
        public Dictionary<string, Item> items = new Dictionary<string, Item>();
        public Dictionary<string, string> weapon2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> pilot2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> item2Unit = new Dictionary<string, string>();
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

        public Context Copy()
        {
            var ret = new Context();
            ret.units = new Dictionary<string, Unit>(units);
            ret.weapons = new Dictionary<string, Weapon>(weapons);
            ret.pilots = new Dictionary<string, Pilot>(pilots);
            ret.items = new Dictionary<string, Item>(items);
            ret.weapon2Unit = new Dictionary<string, string>(weapon2Unit);
            ret.pilot2Unit = new Dictionary<string, string>(pilot2Unit);
            ret.item2Unit = new Dictionary<string, string>(item2Unit);
            return ret;
        }
    }
    
    public class DataAlg
    {
        public static void AddMoney(Context ctx, int money)
        {
            ctx.money += money;
            if(ctx.money < 0)
            {
                ctx.money = 0;
            }
        }

        static AStarPathfinding pathFiniding = new AStarPathfinding();

        public static IPathfinding.GetNeigboursFn<Grid> GetNeigbours(Context ctx, Vector2Int pos)
        {
            var gk = new Grid(pos).Key;
            if(ctx.grid2Unit.ContainsKey(gk) == false)
            {
                throw new Exception("指定的地點不存在:"+gk);
            }
            var unitKey = ctx.grid2Unit[gk];
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
                var oriData = ConfigGrid.Get(curr.prototype);
                var cost = oriData.cost;
                var posKey = new Grid(oriPos).Key;
                if (ctx.fireCost.Count > player.team && ctx.fireCost[player.team].ContainsKey(posKey))
                {
                    var fireCost = ctx.fireCost[player.team][posKey];
                    cost += fireCost;
                }
                if (curr.prototype == ConfigGrid.ID_mountain)
                {
                    cost += 100;
                }
                if (curr.prototype == ConfigGrid.ID_ocean)
                {
                    cost += 100;
                }
                if (curr.prototype == ConfigGrid.ID_deepOcean)
                {
                    cost += 100;
                }
                foreach (var v in dirs)
                {
                    var newPos = oriPos + v;
                    var ngk = new Grid(newPos).Key;
                    if (ctx.grids.ContainsKey(ngk) == false)
                    {
                        continue;
                    }
                    if(ctx.grid2Unit.ContainsKey(ngk))
                    {
                        continue;
                    }
                    var g = ctx.grids[ngk];
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

        public static List<Vector2Int> GetCenterVecs(int range)
        {
            var ret = new List<Vector2Int>();
            for(var x=-range; x<=range; x += 1)
            {
                var pos = new Vector2Int(x, 0);
                ret.Add(pos);

                var yrange = range - (int)Mathf.Abs(x);
                for (var y = -yrange; y <= yrange; y += 1)
                {
                    pos = new Vector2Int(x, y);
                    ret.Add(pos);
                }
            }
            return ret;
        }

        public static List<Vector2Int> GetForward(int min, int max, int expend, Direction dir)
        {
            var ret = new List<Vector2Int>();
            for (var x=-expend; x <= expend; ++x)
            {
                for(var y=min; y<=max; ++y)
                {
                    var pos = new Vector2Int(x, y);
                    ret.Add(pos);
                }
            }
            switch (dir)
            {
                case Direction.Down:
                    {
                        for (var i = 0; i < ret.Count; ++i)
                        {
                            var newPos = ret[i];
                            newPos.y = -newPos.y;
                            ret[i] = newPos;
                        }
                    }
                    break;
                case Direction.Right:
                    {
                        for (var i = 0; i < ret.Count; ++i)
                        {
                            var newPos = ret[i];
                            var tmp = newPos.x;
                            newPos.x = newPos.y;
                            newPos.y = tmp;
                            ret[i] = newPos;
                        }
                    }
                    break;
                case Direction.Left:
                    {
                        for (var i = 0; i < ret.Count; ++i)
                        {
                            var newPos = ret[i];
                            var tmp = newPos.x;
                            newPos.x = newPos.y;
                            newPos.y = tmp;
                            ret[i] = newPos;
                        }
                        for (var i = 0; i < ret.Count; ++i)
                        {
                            var newPos = ret[i];
                            newPos.x = -newPos.x;
                            ret[i] = newPos;
                        }
                    }
                    break;
            }
            return ret;
        }

        public static int GetPowerCost(Context ctx, string unit)
        {
            var weaponPowerCost = GetWeaponList(ctx, unit).Sum(w=>ConfigWeapon.Get(w.prototype).unitPowerCost);
            var itemPowerCost = GetItemList(ctx, unit).Sum(w => ConfigItem.Get(w.prototype).unitPowerCost);
            var totalPowerCost = weaponPowerCost + itemPowerCost;
            return totalPowerCost;
        }

        public static void AssignItem(Context ctx, string item, string unit)
        {
            var itemNotFound = ctx.items.ContainsKey(item) == false;
            if (itemNotFound)
            {
                throw new System.Exception("itemNotFound");
            }
            if (unit == null)
            {
                ctx.item2Unit.Remove(item);
                return;
            }
            var unitNotFound = ctx.units.ContainsKey(unit) == false;
            if (unitNotFound)
            {
                throw new System.Exception("unitNotFound");
            }
            var power = ConfigUnit.Get(ctx.units[unit].prototype).power;
            var powerCost = GetPowerCost(ctx, unit) + ConfigItem.Get(ctx.items[item].prototype).unitPowerCost;
            if(powerCost > power)
            {
                throw new System.Exception("power is not enougth");
            }
            if (ctx.item2Unit.ContainsKey(item))
            {
                ctx.item2Unit[item] = unit;
            }
            else
            {
                ctx.item2Unit.Add(item, unit);
            }
        }

        public static void AssignWeapon(Context ctx, string weapon, string unit)
        {
            var weaponNotFound = ctx.weapons.ContainsKey(weapon) == false;
            if (weaponNotFound)
            {
                throw new System.Exception("weaponNotFound");
            }
            if(unit == null)
            {
                ctx.weapon2Unit.Remove(weapon);
                return;
            }
            var unitNotFound = ctx.units.ContainsKey(unit) == false;
            if (unitNotFound)
            {
                throw new System.Exception("unitNotFound");
            }
            var power = ConfigUnit.Get(ctx.units[unit].prototype).power;
            var powerCost = GetPowerCost(ctx, unit) + ConfigWeapon.Get(ctx.weapons[weapon].prototype).unitPowerCost;
            if (powerCost > power)
            {
                throw new System.Exception("power is not enougth");
            }
            if (ctx.weapon2Unit.ContainsKey(weapon))
            {
                ctx.weapon2Unit[weapon] = unit;
            }
            else
            {
                ctx.weapon2Unit.Add(weapon, unit);
            }
        }

        public static List<Item> GetItemList(Context ctx, string unit)
        {
            return ctx.item2Unit.Keys.Where(k => ctx.item2Unit[k] == unit).Select(k => ctx.items[k]).ToList();
        }

        public static List<Weapon> GetWeaponList(Context ctx, string unit)
        {
            return ctx.weapon2Unit.Keys.Where(k => ctx.weapon2Unit[k] == unit).Select(k => ctx.weapons[k]).ToList();
        }

        public static void AssignPilot(Context ctx, string pilot, string unit)
        {
            var pilotNotFound = ctx.pilots.ContainsKey(pilot) == false;
            if (pilotNotFound)
            {
                throw new System.Exception("pilotNotFound");
            }
            if(unit == null)
            {
                // 取消駕駛
                ctx.pilot2Unit.Remove(pilot);
                return;
            }
            var unitNotFound = ctx.units.ContainsKey(unit) == false;
            if (unitNotFound)
            {
                throw new System.Exception("unitNotFound");
            }
            // 取消原駕駛
            var oldPilot = GetPilot(ctx, unit);
            if(oldPilot != null)
            {
                ctx.pilot2Unit.Remove(oldPilot.Key);
            }
            if (ctx.pilot2Unit.ContainsKey(pilot))
            {
                // 新駕駛切換座機
                ctx.pilot2Unit[pilot] = unit;
            }
            else
            {
                // 無座機的新駕駛指派座機
                ctx.pilot2Unit.Add(pilot, unit);
            }
        }

        public static Pilot GetPilot(Context ctx, string unit)
        {
            return ctx.pilot2Unit.Keys.Where(k => ctx.pilot2Unit[k] == unit).Select(p => ctx.pilots[p]).FirstOrDefault();
        }

        public static int GetMovePower(Context ctx, string unit)
        {
            return 200;
            /*
            var unitObj = ctx.units[unit];
            var cfg = ConfigUnit.Get(unitObj.prototype);
            var weight = GetWeaponList(ctx, unit).Select(w => ConfigWeapon.Get(w.prototype)).Sum(w => w.unitPowerCost);
            var power = cfg.power - weight;
            return power;
            */
        }

        public static float Speed2CT(float speed)
        {
            return speed/100;
        }

        public static float UnitSpeed(Context ctx, string unitKey)
        {
            // 沒有駕駛員不能行動
            var pilot = GetPilot(ctx, unitKey);
            if(pilot == null)
            {
                Debug.LogWarning("沒有駕駛員不能行動");
                return 0;
            }
            var unit = ctx.units[unitKey];
            var cfg = ConfigUnit.Get(unit.prototype);
            return cfg.speed;
        }

        public static void StepCT(Context ctx)
        {
            foreach(var uk in ctx.unit2Grid.Keys)
            {
                var u = ctx.units[uk];
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
            //Debug.Log("GetTopTask");
            var ret = ctx.tasks;
            /*foreach(var t in ret)
            {
                Debug.Log(t.ct + ":" + t.description);
            }*/
            return ret.OrderBy(u => u.ct).Where(u=> u.ct<=0).FirstOrDefault();
        }

        public static Unit GetTopCTUnit(Context ctx)
        {
            //Debug.Log("GetTopCTUnit");
            var ret = new List<Unit>(ctx.units.Values);
            /*foreach (var t in ret)
            {
                Debug.Log(t.ct + ":" + t.Key);
            }*/
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
            foreach (var unitKey in ctx.unit2Grid.Keys)
            {
                var isInMap = ctx.unit2Grid.ContainsKey(unitKey);
                if(isInMap == false)
                {
                    continue;
                }
                var unitObj = ctx.units[unitKey];
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

        public static void PutUnit(Context ctx, Vector2Int dist, string unitKey)
        {
            var hasOldGrid = ctx.unit2Grid.ContainsKey(unitKey);
            if (hasOldGrid)
            {
                var oldGrid = ctx.unit2Grid[unitKey];
                ctx.grid2Unit.Remove(oldGrid);
            }
            var gk = new Grid(dist).Key;
            ctx.unit2Grid[unitKey] = gk;
            ctx.grid2Unit[gk] = unitKey;
        }

        public static void MoveUnit(Context ctx, Vector2Int dist, string unitKey)
        {
            if(ctx.units[unitKey].alreadyMove)
            {
                throw new Exception("already move");
            }
            var gk = new Grid(dist).Key;
            var hasUnit = ctx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                throw new Exception("has unit:"+gk);
            }
            // clear old pos
            var hasOldGrid = ctx.unit2Grid.ContainsKey(unitKey);
            if(hasOldGrid == false)
            {
                throw new Exception("has unit:" + gk);
            }
            // remove last grid and record it
            var oldGrid = ctx.unit2Grid[unitKey];
            ctx.grid2Unit.Remove(oldGrid);
            ctx.lastUnitPos = oldGrid;
            // change to new pos
            ctx.unit2Grid[unitKey] = gk;
            ctx.grid2Unit[gk] = unitKey;
            ctx.units[unitKey].alreadyMove = true;
        }

        public static string CancelMoveUnit(Context ctx, string unitKey)
        {
            var isNotValidPos = string.IsNullOrEmpty(ctx.lastUnitPos);
            if (isNotValidPos)
            {
                throw new Exception("機體未移動");
            }
            PutUnit(ctx, ctx.grids[ctx.lastUnitPos].pos, unitKey);
            ctx.units[unitKey].alreadyMove = false;
            return ctx.lastUnitPos;
        }

        public static Unit CreateUnit(Context ctx, string prototype, int owner)
        {
            if(ctx.players.Count < owner+1)
            {
                throw new Exception("player not exist:"+owner);
            }
            var unit = new Unit(null);
            unit.prototype = prototype;
            unit.owner = owner;
            ctx.units.Add(unit.Key, unit);
            return unit;
        }

        public static Weapon CreateWeapon(Context ctx, string prototype)
        {
            var w = new Weapon();
            w.prototype = prototype;
            ctx.weapons.Add(w.Key, w);
            return w;
        }

        public static Pilot CreatePilot(Context ctx, string prototype)
        {
            var p = new Pilot();
            p.prototype = prototype;
            ctx.pilots.Add(p.Key, p);
            return p;
        }

        public static Item CreateItem(Context ctx, string prototype)
        {
            var p = new Item();
            p.prototype = prototype;
            ctx.items.Add(p.Key, p);
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

        public static Task CreateRangeAttackTask(Context ctx, string unitKey, string weaponKey, Vector2Int pos)
        {
            var t = new Task();
            t.description = Task.UnitRangeAttack;
            t.owner = unitKey;
            t.values.Add(unitKey);
            t.values.Add(weaponKey);
            t.values.Add(new Grid(pos).Key);

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

        public static Direction GetDirection(Vector2Int a, Vector2Int b)
        {
            var yoffset = b.y - a.y;
            var xoffset = b.x - a.x;
            if(Mathf.Abs(yoffset) > Mathf.Abs(xoffset))
            {
                if(yoffset >= 0)
                {
                    return Direction.Up;
                }
                else
                {
                    return Direction.Down;
                }
            }
            if(xoffset >= 0)
            {
                return Direction.Right;
            }
            else
            {
                return Direction.Left;
            }
        }

        public static bool ConsumeWeapon(Context ctx, string unit, string weapon, ref string reason)
        {
            if (ctx.weapon2Unit[weapon] != unit)
            {
                reason = "武器的擁有者遺失";
                return false;
            }
            var obj = ctx.weapons[weapon];
            var cfg = ConfigWeapon.Get(obj.prototype);
            var unitObj = ctx.units[unit];

            switch (cfg.weaponType)
            {
                case ConfigWeaponType.ID_bullet:
                    {
                        if(obj.usedBulletCount >= cfg.bulletCount)
                        {
                            reason = "彈藥不足";
                            return false;
                        }
                        obj.usedBulletCount += 1;
                    }
                    break;
                case ConfigWeaponType.ID_energy:
                    {
                        if(unitObj.usedEn >= cfg.cost)
                        {
                            reason = "能量不足";
                            return false;
                        }
                        var en = cfg.cost;
                        unitObj.usedEn += en;
                    }
                    break;
            }
            return true;
        }

        public static int GetUpgradeWeaponCost(Context ctx, string weapon)
        {
            if(ctx.weapons.ContainsKey(weapon) == false)
            {
                throw new Exception("XXX");
            }
            var obj = ctx.weapons[weapon];
            if(obj.level < 2)
            {
                return 500;
            }
            if(obj.level < 4)
            {
                return 1000;
            }
            return 2000;
        }

        public static void UpgradeWeapon(Context ctx, string weapon)
        {
            if (ctx.weapons.ContainsKey(weapon) == false)
            {
                throw new Exception("XXX");
            }
            var obj = ctx.weapons[weapon];
            if(obj.level >= 7)
            {
                throw new Exception("xxx");
            }
            var cost = GetUpgradeWeaponCost(ctx, weapon);
            var isNotEnough = ctx.money < cost;
            if (isNotEnough)
            {
                throw new Exception("錢不夠");
            }
            ctx.money -= cost;
            obj.level += 1;
        }

        public static int WeaponPowerWithLevel(Context ctx, string weapon)
        {
            if (ctx.weapons.ContainsKey(weapon) == false)
            {
                throw new Exception("XXX");
            }
            var obj = ctx.weapons[weapon];
            var cfg = ConfigWeapon.Get(obj.prototype);
            return cfg.power + obj.level * 5;
        }

        public static int WeaponRangeWithLevel(Context ctx, string weapon)
        {
            if (ctx.weapons.ContainsKey(weapon) == false)
            {
                throw new Exception("XXX");
            }
            var obj = ctx.weapons[weapon];
            var cfg = ConfigWeapon.Get(obj.prototype);
            return cfg.maxRange;
        }

        public static string ProcedureMap(float x, float y, float deepOcean, float ocean, float mountain, int cityGridCnt, float city, float cx, float cy, float mori, float mx, float my)
        {
            var height = Mathf.PerlinNoise(x, y);
            if (height < deepOcean)
            {
                return "deepOcean";
            }
            if (height < ocean)
            {
                return "ocean";
            }
            if(height > mountain)
            {
                return "mountain";
            }
            var factor = 1 / (float)cityGridCnt;
            var value = Mathf.PerlinNoise(x + cx, y + cy);
            value = ((int)(value / factor)) * factor;
            if (value > city)
            {
                return "city";
            }
            value = Mathf.PerlinNoise(x + mx, y+my);
            if (value > mori)
            {
                return "mori";
            }
            return "plain";
        }

        public static void GenMap(Context ctx, int width, int height)
        {
            ctx.grids.Clear();

            var deepOcean = UnityEngine.Random.Range(0, 0.3f);
            var ocean = deepOcean + UnityEngine.Random.Range(0, 0.4f);
            var mountain = 1 - UnityEngine.Random.Range(0, 0.3f);
            var city = UnityEngine.Random.Range(0, 1f);
            var mori = UnityEngine.Random.Range(0, 1f);
            var factor = UnityEngine.Random.Range(1, 10f);

            var xr = UnityEngine.Random.Range(0, 100f);
            var yr = UnityEngine.Random.Range(0, 100f);

            var cxr = UnityEngine.Random.Range(0, 100f);
            var cyr = UnityEngine.Random.Range(0, 100f);

            var mxr = UnityEngine.Random.Range(0, 100f);
            var myr = UnityEngine.Random.Range(0, 100f);

            var max = Mathf.Max(width, height);
            var offset = 1 / (float)max;
            for(var x=0; x<width; ++x)
            {
                for (var y = 0; y<height; ++y)
                {
                    var xf = xr + x * offset * factor;
                    var yf = yr + y * offset * factor;
                    var prototype = ProcedureMap(xf, yf, deepOcean, ocean, mountain, max, city, cxr, cyr, mori, mxr, myr);
                    var grid = new Grid(new Vector2Int(x, y));
                    grid.prototype = prototype;
                    ctx.grids.Add(grid.Key, grid);
                }
            }
        }

        public static DeffendValue GetDeffendValue(Context ctx, string unit)
        {
            var pilot = GetPilot(ctx, unit);
            Assert.IsNull(pilot, "XXXX");
            Assert.IsFalse(ctx.units.ContainsKey(unit), "XXX");
            Assert.IsFalse(ctx.unit2Grid.ContainsKey(unit), "eES");

            var unitCfg = ConfigUnit.Get(ctx.units[unit].prototype);
            var pilotCfg = ConfigPilot.Get(pilot.prototype);

            var fv = new DeffendValue();
            fv.unitArmor = unitCfg.armor;
            fv.unitPower = unitCfg.power;
            fv.unitSpeed = unitCfg.speed;
            fv.pilotAvoidanceRate = pilotCfg.avoidanceRate;
            fv.pilotFighting = pilotCfg.fighting;
            fv.pilotHitRate = pilotCfg.hitRate;
            fv.pilotLucky = pilotCfg.lucky;
            fv.pilotShooting = pilotCfg.shooting;
            fv.pilotTechnique = pilotCfg.technique;
            return fv;
        }

        public static AttackValue GetAttackValue(Context ctx, string unit, string targetUnit, string weapon)
        {
            var pilot = GetPilot(ctx, unit);
            Assert.IsNull(pilot, "XXXX");
            Assert.IsFalse(ctx.units.ContainsKey(unit), "XXX");
            Assert.IsFalse(ctx.units.ContainsKey(targetUnit), "XXX2");
            Assert.IsFalse(ctx.weapons.ContainsKey(weapon), "eES");
            Assert.IsFalse(ctx.unit2Grid.ContainsKey(unit), "eES");
            Assert.IsFalse(ctx.unit2Grid.ContainsKey(targetUnit), "eES");

            var unitCfg = ConfigUnit.Get(ctx.units[unit].prototype);
            var pilotCfg = ConfigPilot.Get(pilot.prototype);
            var weaponCfg = ConfigWeapon.Get(ctx.weapons[weapon].prototype);
            var pos1 = ctx.grids[ctx.unit2Grid[unit]].pos;
            var pos2 = ctx.grids[ctx.unit2Grid[targetUnit]].pos;

            var fv = new AttackValue();
            fv.unitArmor = unitCfg.armor;
            fv.unitPower = unitCfg.power;
            fv.unitSpeed = unitCfg.speed;
            fv.pilotAvoidanceRate = pilotCfg.avoidanceRate;
            fv.pilotFighting = pilotCfg.fighting;
            fv.pilotHitRate = pilotCfg.hitRate;
            fv.pilotLucky = pilotCfg.lucky;
            fv.pilotShooting = pilotCfg.shooting;
            fv.pilotTechnique = pilotCfg.technique;
            fv.weaponPower = weaponCfg.power;
            fv.weaponMaxRange = weaponCfg.maxRange;
            fv.distance = Vector2Int.Distance(pos1, pos2);
            return fv;
        }

        public static void DamageUnit(Context ctx, string unit, string targetUnit, string weapon)
        {
            var atk = GetAttackValue(ctx, unit, targetUnit, weapon);
            var dfd = GetDeffendValue(ctx, targetUnit);

            var damage = atk.Damage(dfd);
            var hitRate = atk.GetHitRate(dfd);
            var aa = atk.GetAttackAbility(dfd);
            var da = atk.GetDeffendAbility(dfd);
            // handle ability
            atk.pilotHitRate += 30;
            atk.pilotShooting += 10;

            hitRate = atk.GetHitRate(dfd);
            atk.Damage(dfd);

            var isHit = UnityEngine.Random.Range(0, 1) <= hitRate;
            if (isHit == false) {
                return;
            }
            damage = atk.Damage(dfd);
            // handle ability
            damage /= 2;

            ctx.units[targetUnit].usedHp += damage;
        }
    }
}