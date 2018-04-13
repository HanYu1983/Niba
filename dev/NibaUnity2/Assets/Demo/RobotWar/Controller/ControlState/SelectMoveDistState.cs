using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
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
            if (moveCor != null)
            {
                return;
            }
            var gk = new Grid(gv.coord).Key;
            var g = Model.mapCtx.grids[gk];
            if (paths.ContainsKey(g))
            {
                Holder.ClientMoveUnit(Holder.Player, unit.Key, gv.coord);
                Holder.ChangeState(new SelectUnitActionState(unit));
                /*
                DataAlg.MoveUnit(Model.mapCtx, gv.coord, unit.Key);
                moveCor = View.StartCoroutine(AnimateUnitMove(paths[g]));
                */
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
}