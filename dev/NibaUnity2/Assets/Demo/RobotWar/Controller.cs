﻿using System.Collections;
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
            var unit = DataAlg.SpawnUnit(model.ctx, pos, "");
            unit.owner = owner;

            DataAlg.CreateWeapon(model.ctx, unit.Key, "");
            view.CreateUnit(model, unit.Key, pos);
        }

        public void StartPlay()
        {
            ChangeState(new UpdateCTState());
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
            switch (task.description)
            {
                case Task.UnitAttack:
                    {
                        var unitKey = task.values[0];
                        var weaponKey = task.values[1];
                        var targets = task.values[2].Split(',');
                        DataAlg.CompleteTask(Model.ctx, task);
                        Debug.Log("process Attak");
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
                var isPlayer = topCTUnit.owner == 0;
                var isAI = isPlayer == false;
                if (isPlayer)
                {
                    Holder.ChangeState(new SelectUnitActionState(topCTUnit));
                }
                if (isAI)
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
            Holder.ChangeState(new UpdateCTState());
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
            if (unit.owner != 0)
            {
                Holder.ChangeState(new UpdateCTState());
                return;
            }
        }
        public override void OnEnterState()
        {
            if (unit.owner != 0 || unit.alreadyMove == false)
            {
                View.SetGridColor(null, Color.white);
                var movePower = DataAlg.GetMovePower(Model.ctx, unit.Key);
                var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;
                var paths = DataAlg.FindAllPath(Model.ctx, movePower, pos);
                View.SetGridColor(paths.Keys, Color.green);
                this.paths = paths;
            }
            
            if (unit.owner == 0)
            {
                var menu = View.GetUnitMenu();
                menu.OnSelect += OnSelect;
            }
        }
        public override void OnExitState()
        {
            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
        }
        void OnSelect(Menu<UnitMenuItem> menu)
        {
            var item = menu.Selected;
            switch (item)
            {
                case UnitMenuItem.Move:
                    if (unit.alreadyMove)
                    {
                        Debug.LogWarning("already move");
                        return;
                    }
                    Holder.ChangeState(new SelectMoveDistState(unit, paths));
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
                    Holder.ChangeState(new UpdateCTState());
                    break;
                case UnitMenuItem.Cancel:
                    Holder.ChangeState(new IdleState());
                    break;
            }
        }
    }

    public class IdleState : DefaultControlState
    {
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;
            View.SetGridColor(null, Color.white);
        }
        public override void OnExitState()
        {
            GridView.OnClick -= OnClick;
        }
        void OnClick(GridView gv)
        {
            var gk = new Grid(gv.coord).Key;
            var hasUnit = Model.ctx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                var targetKey = Model.ctx.grid2Unit[gk];
                var target = Model.ctx.units[targetKey];
                if (target.owner == 0)
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
        public SelectMoveDistState(Unit unit, Dictionary<Grid, List<Grid>> paths)
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
            var menu = View.GetWeaponMenu();
            menu.CreateMenu(Model, weapons);
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            var menu = View.GetWeaponMenu();
            menu.OnSelect -= OnSelect;
        }
        string lastSelectWeapon;
        List<Grid> lastRange;
        void OnSelect(Menu<string> menu)
        {
            var weapon = menu.Selected;
            if(lastSelectWeapon == weapon)
            {
                Holder.ChangeState(new SelectWeaponTargetState(unit, weapon, lastRange));
            }
            else
            {
                View.SetGridColor(null, Color.white);

                var pos = Model.ctx.grids[Model.ctx.unit2Grid[unit.Key]].pos;
                var cfg = new ConfigWeapon();
                var isSingle = string.IsNullOrEmpty(cfg.shape);
                if (isSingle)
                {
                    var ranges = DataAlg.FindAllRange(Model.ctx, 2, 6, pos);
                    View.SetGridColor(ranges.Keys, Color.red);
                    lastRange = new List<Grid>(ranges.Keys);
                }
            }
            lastSelectWeapon = weapon;
        }
    }

    public class SelectWeaponTargetState : DefaultControlState
    {
        Unit unit;
        string weapon;
        List<Grid> ranges;
        public SelectWeaponTargetState(Unit unit, string weapon, List<Grid> range)
        {
            this.unit = unit;
            this.weapon = weapon;
            this.ranges = range;
        }
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;
        }
        public override void OnExitState()
        {
            GridView.OnClick -= OnClick;
        }
        
        void OnClick(GridView gv)
        {
            // if the weapon is map, change direction

            // if the weapon is single, check target
            var gk = new Grid(gv.coord).Key;
            var hasUnit = Model.ctx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                var targetKey = Model.ctx.grid2Unit[gk];
                var target = Model.ctx.units[targetKey];
                if(unit != target && unit.owner != target.owner)
                {
                    var task = DataAlg.CreateAttackTask(Model.ctx, unit.Key, weapon, new List<string>() { targetKey });
                    DataAlg.PushTask(Model.ctx, task);
                    DataAlg.PassUnit(Model.ctx, unit.Key);
                    Holder.ChangeState(new UpdateCTState());
                }
            }
        }
    }
}