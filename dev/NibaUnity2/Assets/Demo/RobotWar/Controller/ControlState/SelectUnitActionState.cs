using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
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
            var owner = Model.mapCtx.unit2Player[unit.Key];
            var playerObj = Model.mapCtx.players[owner];
            if (playerObj.isAI)
            {
                Holder.ChangeState(new UpdateCTState());
                return;
            }
        }
        public override void OnEnterState()
        {
            var owner = Model.mapCtx.unit2Player[unit.Key];
            var playerObj = Model.mapCtx.players[owner];
            if (playerObj.isAI)
            {
                return;
            }
            // 如果單位沒移動過, 才顯示移動範圍並可以點地圖
            if (unit.alreadyMove == false)
            {
                // 顯示移動範圍
                View.SetGridColor(null, Color.white);
                var movePower = DataAlg.GetMovePower(Model.mapCtx, unit.Key);
                var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;
                var paths = DataAlg.FindAllPath(Model.mapCtx, movePower, pos);
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
                Debug.LogWarning("動畫播放中, 不能點擊:" + Time.timeScale);
                return;
            }
            // 判斷是否點到移動範圍內的方塊
            var gk = new Grid(gv.coord).Key;
            var g = Model.mapCtx.grids[gk];
            var isInRange = paths.ContainsKey(g);
            if (isInRange)
            {
                // 關閉菜單
                View.GetUnitMenu().gameObject.SetActive(false);
                // 移動單位
                DataAlg.MoveUnit(Model.mapCtx, gv.coord, unit.Key);
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
                        var pos = DataAlg.CancelMoveUnit(Model.mapCtx, unit.Key);
                        View.SetUnitPos(unit.Key, Model.mapCtx.grids[pos]);
                        Holder.ChangeState(new SelectUnitActionState(unit));
                    }
                    break;
                case UnitMenuItem.Attack:
                    var weapons = DataAlg.GetWeaponList(Model.mapCtx, unit.Key);
                    if (weapons.Count == 0)
                    {
                        Debug.LogWarning("no weapons");
                        return;
                    }
                    Holder.ChangeState(new SelectWeaponState(unit));
                    break;
                case UnitMenuItem.Pass:
                    DataAlg.PassUnit(Model.mapCtx, unit.Key);
                    Holder.ChangeState(new SystemState());
                    break;
                case UnitMenuItem.Cancel:
                    Holder.ChangeState(new IdleState());
                    break;
            }
        }
    }
}