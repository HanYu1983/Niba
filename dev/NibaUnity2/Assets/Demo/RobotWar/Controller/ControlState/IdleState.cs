using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
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
                        var unit = DataAlg.GetTopCTUnit(Model.mapCtx);
                        Holder.ChangeState(new SelectUnitActionState(unit));
                    }
                    break;
            }
        }
        void OnClick(GridView gv)
        {
            var gk = new Grid(gv.coord).Key;
            var hasUnit = Model.mapCtx.grid2Unit.ContainsKey(gk);
            if (hasUnit)
            {
                var targetKey = Model.mapCtx.grid2Unit[gk];
                var target = Model.mapCtx.units[targetKey];

                var moveRange = DataAlg.FindAllPath(Model.mapCtx, DataAlg.GetMovePower(Model.mapCtx, targetKey), gv.coord);
                View.SetGridColor(null, Color.white);
                View.SetGridColor(moveRange.Keys, Color.green);

                var owner = Model.mapCtx.unit2Player[target.Key];
                var playerObj = Model.mapCtx.players[owner];
                if (playerObj.isAI == false)
                {
                    var isTop = DataAlg.GetTopCTUnit(Model.mapCtx) == target;
                    if (isTop)
                    {
                        Holder.ChangeState(new SelectUnitActionState(target));
                    }
                }
            }
        }
    }
}