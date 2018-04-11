using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using GameFramework.UI.Dialogs.Components;
namespace RobotWar
{
    public class SelectDirectionState : DefaultControlState
    {
        Unit unit;
        Direction dir;
        public SelectDirectionState(Unit unit)
        {
            this.unit = unit;
        }
        public override void OnEnterState()
        {
            var menuItems = new List<UnitMenuItem>()
            {
                UnitMenuItem.Confirm
            };
            var menu = View.GetUnitMenu();
            menu.CreateMenu(Model, menuItems);
            menu.OnSelect += OnSelect;
            GridView.OnClick += OnClick;
        }
        public override void OnExitState()
        {
            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
            GridView.OnClick -= OnClick;
        }
        void OnSelect(Menu<UnitMenuItem> menu)
        {
            if(dir == Direction.Pending)
            {
                ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, "請選擇方向", "", null);
                return;
            }
            unit.dir = dir;
            DataAlg.PassUnit(Model.mapCtx, unit.Key);
            Holder.ChangeState(new SystemState());
        }
        void OnClick(GridView gv)
        {
            var clickPos = gv.coord;
            if(Model.mapCtx.unit2Grid.ContainsKey(unit.Key) == false)
            {
                throw new System.Exception("沒有找到機體位置, 請檢查是否丟錯Context. 地圖中要使用mapCtx");
            }
            var unitGridKey = Model.mapCtx.unit2Grid[unit.Key];
            if(Model.mapCtx.grids.ContainsKey(unitGridKey) == false)
            {
                throw new System.Exception("沒有找到機體位置, 請檢查是否丟錯Context. 地圖中要使用mapCtx");
            }
            var unitGrid = Model.mapCtx.grids[unitGridKey];
            this.dir = DataAlg.GetDirection(unitGrid.pos, clickPos);
            Debug.Log("direction:" + dir);
        }
    }
}