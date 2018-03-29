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
        public Unit(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                this.key = new System.Guid().ToString();
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
            key = new System.Guid().ToString();
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

    public class Context
    {
        public Dictionary<string, Unit> units = new Dictionary<string, Unit>();
        public Dictionary<string, Weapon> weapons = new Dictionary<string, Weapon>();
        public Dictionary<string, Pilot> pilots = new Dictionary<string, Pilot>();

        public Dictionary<string, Grid> grids = new Dictionary<string, Grid>();
        public Dictionary<string, string> grid2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> unit2Grid = new Dictionary<string, string>();
        public Dictionary<string, string> unit2Polot = new Dictionary<string, string>();

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
                    if (ctx.grid2Unit.ContainsKey(gk))
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
            return 0;
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
            ctx.turn += 1;
        }

        public static Unit GetTopCTUnit(Context ctx)
        {
            var ret = new List<Unit>(ctx.units.Values);
            return ret.OrderByDescending(u => u.ct).FirstOrDefault();
        }

        public static void PassUnit(Context ctx, string unitKey)
        {
            ctx.units[unitKey].ct -= 1;
        }

        public static void MoveUnit(Context ctx, Vector2Int dist, string unitKey)
        {
            ctx.unit2Grid[unitKey] = new Grid(dist).Key;
            ctx.grid2Unit[new Grid(dist).Key] = unitKey;
        }








        public enum MenuItem
        {
            Pending, Move, Attack, Pass, Cancel
        }

        public interface IMenu<T>
        {
            List<T> WhiteList { set; }
            T Result
            {
                get;
            }
            IEnumerator WaitForInput();
            
            string UnitKey { set; }
        }

        public interface IView
        {
            void MarkMoveRange(IEnumerable<Grid> grids);
            void MarkAttackRange(IEnumerable<Grid> grids);
            IEnumerator AnimateUnitMove(string unitKey, Vector2Int dist);
            void UpdateStatus(Context ctx);
        }
        public enum InputItem
        {
            Exit, Map
        }

        public interface IInputState
        {
            bool IsDirty(InputItem item);
            void Clear(InputItem item);
            Vector2Int CurrPos { get; }
        }

        public static IEnumerator Flow(
            Context ctx,
            IView view,
            IInputState rootInput, 
            IMenu<Vector2Int> gridSelector,
            IMenu<MenuItem> unitMenu,
            IMenu<int> weaponMenu)
        {
            while (true)
            {
                // 取得可行動單位
                var topCTUnit = GetTopCTUnit(ctx);
                if (topCTUnit == null)
                {
                    StepCT(ctx);
                    view.UpdateStatus(ctx);
                    yield return 0;
                }
                else
                {
                    // 判斷可行動單位是玩家還是AI
                    var isPlayer = topCTUnit.owner == 0;
                    var isAI = isPlayer == false;
                    if (isPlayer)
                    {
                        // move to play and open menu


                        //yield return MA(ctx, view, gridSelector, unitMenu, weaponMenu, topCTUnit.Key);
                    }
                }
            }
        }
        public static IEnumerator MA(Context ctx, IView view, IMenu<Vector2Int> gridSelector, IMenu<MenuItem> unitMenu, IMenu<int> weaponMenu, string selectUnitKey)
        {
            // 顯示移動範圍
            var movePower = GetMovePower(ctx, selectUnitKey);
            var grid = ctx.grids[ctx.unit2Grid[selectUnitKey]];
            var allPath = FindAllPath(ctx, movePower, grid.pos);
            view.MarkMoveRange(allPath.Keys);

            const int idle = 0;
            const int moved = 1;
            const int cancel = 2;
            var menuStep = idle;
            while (menuStep != cancel)
            {
                var validItem = new List<MenuItem>();
                validItem.Add(MenuItem.Attack);
                if (menuStep == idle)
                {
                    validItem.Add(MenuItem.Move);
                }
                unitMenu.WhiteList = validItem;
                // 顯示選單(移動,攻擊...)
                yield return unitMenu.WaitForInput();
                var item = unitMenu.Result;
                switch (item)
                {
                    case MenuItem.Pending:
                        {
                            menuStep = cancel;
                        }
                        break;
                    case MenuItem.Pass:
                        PassUnit(ctx, selectUnitKey);
                        menuStep = cancel;
                        break;
                    // 選擇移動
                    case MenuItem.Move:
                        {
                            // 等待地點點選
                            gridSelector.WhiteList = allPath.Keys.Select(g => g.pos).ToList();
                            yield return gridSelector.WaitForInput();
                            // 移動單位
                            var selectPos = gridSelector.Result;
                            MoveUnit(ctx, selectPos, selectUnitKey);
                            // 等待移動視覺完成
                            yield return view.AnimateUnitMove(selectUnitKey, selectPos);
                            // handle face

                            menuStep = moved;
                        }
                        break;
                    case MenuItem.Attack:
                        {
                            // 
                            var weapons = GetWeaponList(ctx, selectUnitKey);
                            weaponMenu.UnitKey = selectUnitKey;
                            weaponMenu.WhiteList = Enumerable.Range(0, weapons.Count).ToList();
                            yield return weaponMenu.WaitForInput();
                            var weaponIdx = weaponMenu.Result;
                            var selectWeapon = weapons[weaponIdx];
                            var weaponCfg = new ConfigWeapon();
                            // 處理是不是地
                            var ranges = FindAllRange(ctx, weaponCfg.minRange, weaponCfg.maxRange, grid.pos);
                            // 
                            view.MarkAttackRange(ranges.Keys);
                            // 等待地點點選
                            gridSelector.WhiteList = ranges.Keys.Select(g => g.pos).ToList();
                            yield return gridSelector.WaitForInput();

                            menuStep = cancel;
                        }
                        break;
                }
            }
        }
        public static IEnumerator Flow2(
            Context ctx,
            IView view, 
            IMenu<Vector2Int> gridSelector, 
            IMenu<MenuItem> unitMenu,
            IMenu<int> weaponMenu)
        {
            while (true)
            {
                // 取得可行動單位
                var topCTUnit = GetTopCTUnit(ctx);
                if (topCTUnit == null)
                {
                    StepCT(ctx);
                    view.UpdateStatus(ctx);
                    yield return 0;
                }
                else
                {
                    // 判斷可行動單位是玩家還是AI
                    var isPlayer = topCTUnit.owner == 0;
                    var isAI = isPlayer == false;

                    if (isPlayer)
                    {
                        var selectUnitKey = topCTUnit.Key;
                        // 顯示移動範圍
                        var movePower = GetMovePower(ctx, selectUnitKey);
                        var grid = ctx.grids[ctx.unit2Grid[selectUnitKey]];
                        var allPath = FindAllPath(ctx, movePower, grid.pos);
                        view.MarkMoveRange(allPath.Keys);

                        const int idle = 0;
                        const int moved = 1;
                        const int cancel = 2;
                        var menuStep = idle;
                        while (menuStep != cancel)
                        {
                            var validItem = new List<MenuItem>();
                            validItem.Add(MenuItem.Attack);
                            if (menuStep == idle)
                            {
                                validItem.Add(MenuItem.Move);
                            }
                            unitMenu.WhiteList = validItem;
                            // 顯示選單(移動,攻擊...)
                            yield return unitMenu.WaitForInput();
                            var item = unitMenu.Result;
                            switch (item)
                            {
                                case MenuItem.Pending:
                                    {
                                        menuStep = cancel;
                                    }
                                    break;
                                case MenuItem.Pass:
                                    PassUnit(ctx, selectUnitKey);
                                    menuStep = cancel;
                                    break;
                                // 選擇移動
                                case MenuItem.Move:
                                    {
                                        // 等待地點點選
                                        gridSelector.WhiteList = allPath.Keys.Select(g => g.pos).ToList();
                                        yield return gridSelector.WaitForInput();
                                        // 移動單位
                                        var selectPos = gridSelector.Result;
                                        MoveUnit(ctx, selectPos, selectUnitKey);
                                        // 等待移動視覺完成
                                        yield return view.AnimateUnitMove(selectUnitKey, selectPos);
                                        // handle face

                                        menuStep = moved;
                                    }
                                    break;
                                case MenuItem.Attack:
                                    {
                                        // 
                                        var weapons = GetWeaponList(ctx, selectUnitKey);
                                        weaponMenu.UnitKey = selectUnitKey;
                                        weaponMenu.WhiteList = Enumerable.Range(0, weapons.Count).ToList();
                                        yield return weaponMenu.WaitForInput();
                                        var weaponIdx = weaponMenu.Result;
                                        var selectWeapon = weapons[weaponIdx];
                                        var weaponCfg = new ConfigWeapon();
                                        // 處理是不是地
                                        var ranges = FindAllRange(ctx, weaponCfg.minRange, weaponCfg.maxRange, grid.pos);
                                        // 
                                        view.MarkAttackRange(ranges.Keys);
                                        // 等待地點點選
                                        gridSelector.WhiteList = ranges.Keys.Select(g => g.pos).ToList();
                                        yield return gridSelector.WaitForInput();

                                        menuStep = cancel;
                                    }
                                    break;
                            }
                        }
                    }
                    
                    if (isPlayer)
                    {
                        // 等待地圖點擊
                        gridSelector.WhiteList = ctx.grids.Values.Select(g => g.pos).ToList();
                        yield return gridSelector.WaitForInput();
                        var selectPos = gridSelector.Result;
                        var hasUnit = ctx.grid2Unit.ContainsKey(new Grid(selectPos).Key);
                        // 點到單位
                        if (hasUnit)
                        {
                            var unitKey = ctx.grid2Unit[new Grid(selectPos).Key];
                            // 顯示移動範圍
                            var movePower = GetMovePower(ctx, unitKey);
                            var grid = ctx.grids[ctx.unit2Grid[unitKey]];
                            var allPath = FindAllPath(ctx, movePower, grid.pos);
                            view.MarkMoveRange(allPath.Keys);
                            // 如果點到可行動單位
                            var isTopCTUnit = unitKey == topCTUnit.Key;
                            if (isTopCTUnit)
                            {
                                const int idle = 0;
                                const int moved = 1;
                                const int cancel = 2;
                                var menuStep = idle;
                                while(menuStep != cancel)
                                {
                                    var validItem = new List<MenuItem>();
                                    validItem.Add(MenuItem.Attack);
                                    if (menuStep == idle)
                                    {
                                        validItem.Add(MenuItem.Move);
                                    }
                                    unitMenu.WhiteList = validItem;
                                    // 顯示選單(移動,攻擊...)
                                    yield return unitMenu.WaitForInput();
                                    var item = unitMenu.Result;
                                    switch (item)
                                    {
                                        case MenuItem.Pending:
                                            menuStep = cancel;
                                            break;
                                        case MenuItem.Pass:
                                            PassUnit(ctx, unitKey);
                                            menuStep = cancel;
                                            break;
                                        // 選擇移動
                                        case MenuItem.Move:
                                            {
                                                // 等待地點點選
                                                gridSelector.WhiteList = allPath.Keys.Select(g => g.pos).ToList();
                                                yield return gridSelector.WaitForInput();
                                                // 移動單位
                                                selectPos = gridSelector.Result;
                                                MoveUnit(ctx, selectPos, unitKey);
                                                // 等待移動視覺完成
                                                yield return view.AnimateUnitMove(unitKey, selectPos);
                                                // handle face

                                                menuStep = moved;
                                            }
                                            break;
                                        case MenuItem.Attack:
                                            {
                                                // 
                                                var weapons = GetWeaponList(ctx, unitKey);
                                                weaponMenu.UnitKey = unitKey;
                                                weaponMenu.WhiteList = Enumerable.Range(0, weapons.Count).ToList();
                                                yield return weaponMenu.WaitForInput();
                                                var weaponIdx = weaponMenu.Result;
                                                var selectWeapon = weapons[weaponIdx];
                                                var weaponCfg = new ConfigWeapon();
                                                // 處理是不是地
                                                var ranges = FindAllRange(ctx, weaponCfg.minRange, weaponCfg.maxRange, grid.pos);
                                                // 
                                                view.MarkAttackRange(ranges.Keys);
                                                // 等待地點點選
                                                gridSelector.WhiteList = ranges.Keys.Select(g => g.pos).ToList();
                                                yield return gridSelector.WaitForInput();

                                                menuStep = cancel;
                                            }
                                            break;
                                    }
                                }
                                
                            }
                        }
                        
                    }

                    if (isAI)
                    {
                        PassUnit(ctx, topCTUnit.Key);
                    }
                }
            }
        }
    }
}