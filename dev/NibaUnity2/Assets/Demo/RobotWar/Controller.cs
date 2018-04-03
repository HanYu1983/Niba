using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    public class Controller : MonoBehaviour, IControlStateHolder
    {
        public Model model;
        public View view;

        private void Start()
        {
            DataAlg.CreatePlayer(model.ctx, 0, false);
            DataAlg.CreatePlayer(model.ctx, 1, false);
            DataAlg.CreatePlayer(model.ctx, 1, false);
            TestLoadMap();
        }

        void Update()
        {
            StateUpdate(Time.deltaTime);
        }

        public IEnumerator LoadMap(string path)
        {
            var request = Resources.LoadAsync<MapData>(path);
            yield return request;
            var data = request.asset as MapData;
            model.CreateMap(data);
            view.Sync(model);
        }

        void CreateUnit(int owner, Vector2Int pos)
        {
            var unit = DataAlg.CreateUnit(model.ctx, ConfigUnit.ID_test01, owner, pos);
            DataAlg.CreateWeapon(model.ctx, unit.Key, ConfigWeapon.ID_handGun);
            DataAlg.CreateWeapon(model.ctx, unit.Key, ConfigWeapon.ID_lightSword);
            DataAlg.CreateWeapon(model.ctx, unit.Key, ConfigWeapon.ID_bomb);
            DataAlg.CreateWeapon(model.ctx, unit.Key, ConfigWeapon.ID_bigGun);

            var p = DataAlg.CreatePilot(model.ctx, ConfigPilot.ID_solider1);
            DataAlg.AssignPilot(model.ctx, p.Key, unit.Key);

            view.CreateUnit(model, unit.Key, pos);
        }

        public void StartPlay()
        {
            ChangeState(new SystemState());
        }

        #region control state
        IControlState controlState;
        public void ChangeState(IControlState next)
        {
            Debug.Log("ChangeState:" + next);
            if(controlState != null)
            {
                controlState.OnExitState();
            }
            next.Holder = this;
            next.Model = model;
            next.View = view;
            next.OnEnterState();
            controlState = next;
        }
        public void StateUpdate(float t)
        {
            if(controlState == null)
            {
                return;
            }
            controlState.OnUpdate(t);
        }
        #endregion

        #region test
        

        [ContextMenu("TestLoadMap")]
        public void TestLoadMap()
        {
            StartCoroutine(LoadMap("Map/map01"));
        }
        [ContextMenu("TestPlay")]
        public void TestPlay()
        {
            StartPlay();
        }
        [ContextMenu("TestCreateUnit")]
        public void TestCreateUnit()
        {
            for(var i=0; i<5; ++i)
            {
                CreateUnit(0, new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            }
        }

        [ContextMenu("TestCreateEnemy")]
        public void TestCreateEnemy()
        {
            for (var i = 0; i < 5; ++i)
            {
                CreateUnit(1, new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            }
        }

        [ContextMenu("TestCreateEnemy2")]
        public void TestCreateEnemy2()
        {
            for (var i = 0; i < 5; ++i)
            {
                CreateUnit(2, new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            }
        }

        [ContextMenu("TestCanMove")]
        public void TestCanMove()
        {
            view.SetGridColor(null, Color.white);

            var paths = DataAlg.FindAllPath(model.ctx, Random.Range(3, 10), new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            view.SetGridColor(paths.Keys, Color.green);

            var dis = new Grid[paths.Keys.Count];
            paths.Keys.CopyTo(dis, 0);
            var path = paths[dis[Random.Range(1, dis.Length)]];
            view.SetGridColor(path, Color.red);
        }

        [ContextMenu("TestAttackRange")]
        public void TestAttackRange()
        {
            view.SetGridColor(null, Color.white);
            var paths = DataAlg.FindAllRange(model.ctx, Random.Range(1, 5), Random.Range(5, 10), new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            view.SetGridColor(paths.Keys, Color.red);
        }
        #endregion
    }

    public interface IControlStateHolder
    {
        void ChangeState(IControlState state);
    }

    public interface IControlState
    {
        IControlStateHolder Holder { set; }
        Model Model { set; }
        View View { set; }
        void OnEnterState();
        void OnExitState();
        void OnUpdate(float t);
    }

    public abstract class DefaultControlState : IControlState
    {
        public IControlStateHolder Holder { set; get; }
        public Model Model { set; get; }
        public View View { set; get; }
        public virtual void OnEnterState() { }
        public virtual void OnExitState() { }
        public virtual void OnUpdate(float t) { }
    }

    public class ProcessTaskState : DefaultControlState
    {
        Task task;
        public ProcessTaskState(Task task)
        {
            this.task = task;
        }
        public override void OnUpdate(float t)
        {
            Debug.Log("***process Task***:" + task.description);
            switch (task.description)
            {
                case Task.UnitAttack:
                    {
                        var unitKey = task.values[0];
                        var weaponKey = task.values[1];

                        var reason = "";
                        var consumWeapon = DataAlg.ConsumeWeapon(Model.ctx, unitKey, weaponKey, ref reason);
                        if (consumWeapon)
                        {
                            var targets = task.values[2].Split(',');
                            DataAlg.CompleteTask(Model.ctx, task);
                        }
                        else
                        {
                            Debug.LogWarning(reason);
                        }
                        DataAlg.CompleteTask(Model.ctx, task);
                    }
                    break;
                case Task.UnitRangeAttack:
                    {
                        var unitKey = task.values[0];
                        var weaponKey = task.values[1];
                        var gridKey = task.values[2];

                        var reason = "";
                        var consumWeapon = DataAlg.ConsumeWeapon(Model.ctx, unitKey, weaponKey, ref reason);
                        if (consumWeapon)
                        {
                            var unit = Model.ctx.units[unitKey];
                            var atkPlayer = Model.ctx.players[unit.owner];
                            var clickPos = Model.ctx.grids[gridKey].pos;
                            var weaponObj = Model.ctx.weapons[weaponKey];
                            var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
                            switch (weaponCfg.shape)
                            {
                                case ConfigShape.ID_center:
                                    {
                                        var vecs = DataAlg.GetCenterVecs(weaponCfg.shapeRange);
                                        var centerRange = vecs.Select(v => v + clickPos).Select(v => new Grid(v).Key).Where(k => Model.ctx.grids.ContainsKey(k)).Select(k => Model.ctx.grids[k]).ToList();
                                        var units = Model.ctx.units.Values.Where(u =>
                                        {
                                            if (Model.ctx.unit2Grid.ContainsKey(u.Key) == false)
                                            {
                                                return false;
                                            }
                                            var dfdPlayer = Model.ctx.players[u.owner];
                                            if (atkPlayer.team == dfdPlayer.team)
                                            {
                                                return false;
                                            }
                                            var unitGrid = Model.ctx.grids[Model.ctx.unit2Grid[u.Key]];
                                            return centerRange.Contains(unitGrid);
                                        });
                                    }
                                    break;
                                case ConfigShape.ID_forward:
                                    {
                                        var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;
                                        var dir = DataAlg.GetDirection(pos, clickPos);

                                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, dir);
                                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.ctx.grids.ContainsKey(k)).Select(k => Model.ctx.grids[k]).ToList();

                                        var units = Model.ctx.units.Values.Where(u =>
                                        {
                                            if (Model.ctx.unit2Grid.ContainsKey(u.Key) == false)
                                            {
                                                return false;
                                            }
                                            var dfdPlayer = Model.ctx.players[u.owner];
                                            if (atkPlayer.team == dfdPlayer.team)
                                            {
                                                return false;
                                            }
                                            var unitGrid = Model.ctx.grids[Model.ctx.unit2Grid[u.Key]];
                                            return ranges.Contains(unitGrid);
                                        });
                                    }
                                    break;
                            }
                        }
                        else
                        {
                            Debug.LogWarning(reason);
                        }
                        DataAlg.CompleteTask(Model.ctx, task);
                    }
                    break;
            }
            Holder.ChangeState(new UpdateCTState());
        }
    }


    public class UpdateCTState : DefaultControlState
    {
        public override void OnUpdate(float t)
        {
            var task = DataAlg.GetTopTask(Model.ctx);
            if (task != null)
            {
                Holder.ChangeState(new ProcessTaskState(task));
                return;
            }
            
            // 取得可行動單位
            var topCTUnit = DataAlg.GetTopCTUnit(Model.ctx);
            if (topCTUnit == null)
            {
                DataAlg.StepCT(Model.ctx);
                View.UpdateState(Model);
            }
            else
            {
                // 判斷可行動單位是玩家還是AI
                var playerObj = Model.ctx.players[topCTUnit.owner];
                if (playerObj.isAI == false)
                {
                    Holder.ChangeState(new SelectUnitActionState(topCTUnit));
                }
                else
                {
                    Holder.ChangeState(new AIState(topCTUnit));
                }
            }
        }
    }

    public class AIState : DefaultControlState
    {
        Unit unit;
        public AIState(Unit unit)
        {
            this.unit = unit;
        }
        public override void OnUpdate(float t)
        {
            DataAlg.PassUnit(Model.ctx, unit.Key);
            Holder.ChangeState(new SystemState());
        }
    }

    public class SelectUnitActionState : DefaultControlState
    {
        Unit unit;
        Dictionary<Grid, List<Grid>> paths;
        public SelectUnitActionState(Unit unit)
        {
            this.unit = unit;
        }
        public override void OnUpdate(float t)
        {
            var playerObj = Model.ctx.players[unit.owner];
            if (playerObj.isAI)
            {
                Holder.ChangeState(new UpdateCTState());
                return;
            }
        }
        public override void OnEnterState()
        {
            var playerObj = Model.ctx.players[unit.owner];
            if (playerObj.isAI)
            {
                return;
            }
            // 如果單位沒移動過, 才顯示移動範圍並可以點地圖
            if (unit.alreadyMove == false)
            {
                // 顯示移動範圍
                View.SetGridColor(null, Color.white);
                var movePower = DataAlg.GetMovePower(Model.ctx, unit.Key);
                var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;
                var paths = DataAlg.FindAllPath(Model.ctx, movePower, pos);
                View.SetGridColor(paths.Keys, Color.green);
                // 暫存所有最短路徑, 這樣就不必計算2次
                this.paths = paths;
                // 監聽地圖點擊, 因為要移動單位
                GridView.OnClick += OnClick;
            }
            // 準備菜單
            var menuItems = new List<UnitMenuItem>()
            {
                UnitMenuItem.Attack, UnitMenuItem.Status, UnitMenuItem.Pass, UnitMenuItem.Cancel
            };
            // 若單位移動過, 多一個取消移動的選項
            if (unit.alreadyMove)
            {
                menuItems.Add(UnitMenuItem.CancelMove);
            }
            // 打開菜單
            var menu = View.GetUnitMenu();
            menu.CreateMenu(Model, menuItems);
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
            GridView.OnClick -= OnClick;
        }
        Coroutine moveCor;
        void OnClick(GridView gv)
        {
            // 動畫沒結束前不能點擊
            if (moveCor != null)
            {
                Debug.LogWarning("動畫播放中, 不能點擊");
                return;
            }
            // 判斷是否點到移動範圍內的方塊
            var gk = new Grid(gv.coord).Key;
            var g = Model.ctx.grids[gk];
            var isInRange = paths.ContainsKey(g);
            if (isInRange)
            {
                // 關閉菜單
                View.GetUnitMenu().gameObject.SetActive(false);
                // 移動單位
                DataAlg.MoveUnit(Model.ctx, gv.coord, unit.Key);
                moveCor = View.StartCoroutine(AnimateUnitMove(paths[g]));
            }
            else
            {
                Debug.LogWarning("不合法的位置");
            }
        }
        IEnumerator AnimateUnitMove(List<Grid> path)
        {
            // 顯示所選的路徑
            View.SetGridColor(null, Color.white);
            View.SetGridColor(path, Color.red);
            // 播放移動單位動畫
            yield return View.AnimateUnitMove(unit.Key, path);
            View.SetGridColor(null, Color.white);
            Holder.ChangeState(new SelectUnitActionState(unit));
        }
        void OnSelect(Menu<UnitMenuItem> menu)
        {
            var item = menu.Selected;
            switch (item)
            {
                /*case UnitMenuItem.Move:
                    if (unit.alreadyMove)
                    {
                        Debug.LogWarning("already move");
                        return;
                    }
                    Holder.ChangeState(new SelectMoveDistState(unit, paths));
                    break;*/
                case UnitMenuItem.CancelMove:
                    {
                        var pos = DataAlg.CancelMoveUnit(Model.ctx, unit.Key);
                        View.SetUnitPos(unit.Key, Model.ctx.grids[pos]);
                        Holder.ChangeState(new SelectUnitActionState(unit));
                    }
                    break;
                case UnitMenuItem.Attack:
                    var weapons = DataAlg.GetWeaponList(Model.ctx, unit.Key);
                    if(weapons.Count == 0)
                    {
                        Debug.LogWarning("no weapons");
                        return;
                    }
                    Holder.ChangeState(new SelectWeaponState(unit));
                    break;
                case UnitMenuItem.Pass:
                    DataAlg.PassUnit(Model.ctx, unit.Key);
                    Holder.ChangeState(new SystemState());
                    break;
                case UnitMenuItem.Cancel:
                    Holder.ChangeState(new IdleState());
                    break;
            }
        }
    }

    // 用來計算暫時資料的狀態, 可以顯示讀取圖示
    // 這個狀態結束後自動切回UpdateCTState
    // 每次有改變單位位置或新增單位都要切換成這個狀態
    public class SystemState : DefaultControlState
    {
        public override void OnUpdate(float t)
        {
            View.StartCoroutine(Compute());
        }
        IEnumerator Compute()
        {
            yield return 0;
            // 計算火力移動消費
            var dict = new HashSet<int>();
            foreach(var p in Model.ctx.players)
            {
                dict.Add(p.team);
            }
            foreach(var team in dict)
            {
                DataAlg.CalcFileCost(Model.ctx, team);
                yield return 0;
            }
            Holder.ChangeState(new UpdateCTState());
        }
    }

    public class IdleState : DefaultControlState
    {
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;
            View.SetGridColor(null, Color.white);
            View.GetUnitMenu().gameObject.SetActive(false);

            var menu = View.GetUnitMenu();
            menu.CreateMenu(Model, new List<UnitMenuItem>()
            {
                UnitMenuItem.Cancel
            });
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            GridView.OnClick -= OnClick;

            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
            menu.gameObject.SetActive(false);
        }
        void OnSelect(Menu<UnitMenuItem> menu)
        {
            switch (menu.Selected)
            {
                case UnitMenuItem.Cancel:
                    {
                        var unit = DataAlg.GetTopCTUnit(Model.ctx);
                        Holder.ChangeState(new SelectUnitActionState(unit));
                    }
                    break;
            }
        }
        void OnClick(GridView gv)
        {
            var gk = new Grid(gv.coord).Key;
            var hasUnit = Model.ctx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                var targetKey = Model.ctx.grid2Unit[gk];
                var target = Model.ctx.units[targetKey];

                var moveRange = DataAlg.FindAllPath(Model.ctx, DataAlg.GetMovePower(Model.ctx, targetKey), gv.coord);
                View.SetGridColor(null, Color.white);
                View.SetGridColor(moveRange.Keys, Color.green);

                var playerObj = Model.ctx.players[target.owner];
                if (playerObj.isAI == false)
                {
                    var isTop = DataAlg.GetTopCTUnit(Model.ctx) == target;
                    if (isTop)
                    {
                        Holder.ChangeState(new SelectUnitActionState(target));
                    }
                }
            }
        }
    }

    public class SelectMoveDistState : DefaultControlState
    {
        Unit unit;
        Dictionary<Grid, List<Grid>> paths;
        private SelectMoveDistState(Unit unit, Dictionary<Grid, List<Grid>> paths)
        {
            this.unit = unit;
            this.paths = paths;
        }
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;
        }
        public override void OnExitState()
        {
            GridView.OnClick -= OnClick;
        }
        Coroutine moveCor;
        void OnClick(GridView gv)
        {
            if(moveCor != null)
            {
                return;
            }
            var gk = new Grid(gv.coord).Key;
            var g = Model.ctx.grids[gk];
            if (paths.ContainsKey(g))
            {
                DataAlg.MoveUnit(Model.ctx, gv.coord, unit.Key);
                moveCor = View.StartCoroutine(AnimateUnitMove(paths[g]));
            }
            else
            {
                Debug.LogWarning("can not reach");
            }
        }
        IEnumerator AnimateUnitMove(List<Grid> path)
        {
            View.SetGridColor(null, Color.white);
            View.SetGridColor(path, Color.red);
            yield return View.AnimateUnitMove(unit.Key, path);
            View.SetGridColor(null, Color.white);
            Holder.ChangeState(new SelectUnitActionState(unit));
        }
    }

    public class SelectWeaponState : DefaultControlState
    {
        Unit unit;
        public SelectWeaponState(Unit unit)
        {
            this.unit = unit;
        }
        public override void OnEnterState()
        {
            var weapons = DataAlg.GetWeaponList(Model.ctx, unit.Key).Select(w=>w.Key).ToList();
            weapons.Add(WeaponMenu.MENU_CANCEL);

            var menu = View.GetWeaponMenu();
            menu.CreateMenu(Model, weapons);
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            var menu = View.GetWeaponMenu();
            menu.gameObject.SetActive(false);
            menu.OnSelect -= OnSelect;
            View.SetGridColor(null, Color.white);
        }
        //string lastSelectWeapon;
        //List<Grid> lastRange;
        void OnSelect(Menu<string> menu)
        {
            var item = menu.Selected;
            if (item == WeaponMenu.MENU_CANCEL)
            {
                Holder.ChangeState(new SelectUnitActionState(unit));
            }
            else
            {
                var weapon = item;
                Holder.ChangeState(new SelectWeaponTargetState(unit, weapon));
                /*
                var weapon = item;
                if (lastSelectWeapon == weapon)
                {
                    Holder.ChangeState(new SelectWeaponTargetState(unit, weapon, lastRange));
                }
                else
                {
                    View.SetGridColor(null, Color.white);

                    var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;
                    var weaponObj = Model.ctx.weapons[weapon];
                    var cfg = ConfigWeapon.Get(weaponObj.prototype);
                    var isSingle = string.IsNullOrEmpty(cfg.shape);
                    if (isSingle)
                    {
                        var ranges = DataAlg.FindAllRange(Model.ctx, cfg.minRange, cfg.maxRange, pos);
                        View.SetGridColor(ranges.Keys, Color.red);
                        lastRange = new List<Grid>(ranges.Keys);
                    }
                    else
                    {
                        
                    }
                }
                lastSelectWeapon = weapon;
                */
            }
        }
    }

    public class SelectWeaponTargetState : DefaultControlState
    {
        Unit unit;
        string weapon;
        List<Grid> ranges;
        bool isReady;
        Grid selectedGrid;

        public SelectWeaponTargetState(Unit unit, string weapon)
        {
            this.unit = unit;
            this.weapon = weapon;
        }
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;

            View.SetGridColor(null, Color.white);
            var weaponObj = Model.ctx.weapons[weapon];
            var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
            var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;

            switch (weaponCfg.shape)
            {
                case ConfigShape.ID_forward:
                    {
                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, Direction.Up);
                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.ctx.grids.ContainsKey(k)).Select(k => Model.ctx.grids[k]).ToList();

                        View.SetGridColor(ranges, Color.red);
                        this.ranges = new List<Grid>(ranges);
                    }
                    break;
                default:
                    {
                        var ranges = DataAlg.FindAllRange(Model.ctx, weaponCfg.minRange, weaponCfg.maxRange, pos);
                        View.SetGridColor(ranges.Keys, Color.red);
                        this.ranges = new List<Grid>(ranges.Keys);
                    }
                    break;
            }

            var menu = View.GetUnitMenu();
            menu.CreateMenu(Model, new List<UnitMenuItem>()
            {
                UnitMenuItem.Confirm,
                UnitMenuItem.Cancel
            });
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            GridView.OnClick -= OnClick;
            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
            menu.gameObject.SetActive(false);
        }
        void OnSelect(Menu<UnitMenuItem> menu)
        {
            switch (menu.Selected)
            {
                case UnitMenuItem.Cancel:
                    Holder.ChangeState(new SelectWeaponState(unit));
                    break;
                case UnitMenuItem.Confirm:
                    {
                        if (isReady == false)
                        {
                            Debug.LogWarning("XXXX");
                            return;
                        }
                        var weaponObj = Model.ctx.weapons[weapon];
                        var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
                        switch (weaponCfg.shape)
                        {
                            case ConfigShape.ID_forward:
                            case ConfigShape.ID_center:
                                {
                                    var task = DataAlg.CreateRangeAttackTask(Model.ctx, unit.Key, weapon, selectedGrid.pos);
                                    DataAlg.PushTask(Model.ctx, task);
                                    DataAlg.PassUnit(Model.ctx, unit.Key);
                                    Holder.ChangeState(new UpdateCTState());
                                }
                                break;
                            default:
                                {
                                    var targetKey = Model.ctx.grid2Unit[selectedGrid.Key];
                                    var task = DataAlg.CreateAttackTask(Model.ctx, unit.Key, weapon, new List<string>() { targetKey });
                                    DataAlg.PushTask(Model.ctx, task);
                                    DataAlg.PassUnit(Model.ctx, unit.Key);
                                    Holder.ChangeState(new UpdateCTState());
                                }
                                break;
                        }
                    }
                    break;
            }
        }
        
        void OnClick(GridView gv)
        {
            var gk = new Grid(gv.coord).Key;
            var g = Model.ctx.grids[gk];

            isReady = false;
            selectedGrid = g;

            var clickPos = gv.coord;
            var weaponCfg = ConfigWeapon.Get(Model.ctx.weapons[weapon].prototype);
            switch (weaponCfg.shape)
            {
                case ConfigShape.ID_center:
                    {
                        var isValidPos = ranges.Contains(g);
                        if (isValidPos == false)
                        {
                            Debug.LogWarning("不合法的位置");
                            return;
                        }
                        var vecs = DataAlg.GetCenterVecs(weaponCfg.shapeRange);
                        var centerRange = vecs.Select(v => v + clickPos).Select(v => new Grid(v).Key).Where(k=>Model.ctx.grids.ContainsKey(k)).Select(k => Model.ctx.grids[k]).ToList();

                        View.SetGridColor(null, Color.white);
                        View.SetGridColor(this.ranges, Color.red);
                        View.SetGridColor(centerRange, Color.magenta);
                        
                        isReady = true;
                    }
                    break;
                case ConfigShape.ID_forward:
                    {
                        var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;
                        var dir = DataAlg.GetDirection(pos, clickPos);

                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, dir);
                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.ctx.grids.ContainsKey(k)).Select(k => Model.ctx.grids[k]).ToList();

                        View.SetGridColor(null, Color.white);
                        View.SetGridColor(ranges, Color.red);
                        this.ranges = new List<Grid>(ranges);
                        
                        isReady = true;
                    }
                    break;
                default:
                    {
                        var isValidPos = ranges.Contains(g);
                        if (isValidPos == false)
                        {
                            Debug.LogWarning("不合法的位置");
                            return;
                        }
                        // if the weapon is single, check target
                        var hasUnit = Model.ctx.grid2Unit.ContainsKey(gk);
                        if (hasUnit)
                        {
                            var targetKey = Model.ctx.grid2Unit[gk];
                            var target = Model.ctx.units[targetKey];
                            var ownerObj = Model.ctx.players[unit.owner];
                            var targetOwnerObj = Model.ctx.players[target.owner];
                            if (unit != target && ownerObj.team != targetOwnerObj.team)
                            {
                                isReady = true;
                            }

                            
                            /*
                            var targetKey = Model.ctx.grid2Unit[gk];
                            var target = Model.ctx.units[targetKey];
                            var ownerObj = Model.ctx.players[unit.owner];
                            var targetOwnerObj = Model.ctx.players[target.owner];
                            if (unit != target && ownerObj.team != targetOwnerObj.team)
                            {
                                var task = DataAlg.CreateAttackTask(Model.ctx, unit.Key, weapon, new List<string>() { targetKey });
                                DataAlg.PushTask(Model.ctx, task);
                                DataAlg.PassUnit(Model.ctx, unit.Key);
                                Holder.ChangeState(new UpdateCTState());
                            }
                            else
                            {
                                Debug.LogWarning("不合法的目標");
                            }*/
                        }
                    }
                    break;
            }
            
        }
    }
}