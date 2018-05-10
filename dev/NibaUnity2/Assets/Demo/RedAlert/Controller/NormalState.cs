using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System.Linq;

namespace RedAlert
{
    public class NormalState : DefaultRedAlertControllerState
    {
        public void OnSelectBuild()
        {
            var host = Holder.View.buildingMenu.selectedKeyRef.Ref;
            var model = Holder.Model;
            var player = Holder.Player;
            var entityPrototype = Holder.View.buildMenu.selectedKeyRef.Ref;
            var result = DataAlg.IsCanBuild(Holder.Model.ctx, player, entityPrototype);
            if (result != null)
            {
                Holder.View.Alert(result);
                return;
            }
            var p = DataAlg.GetBuildingProgress(model.ctx, player, host, entityPrototype);
            if (p != null)
            {
                /*if (p.state == BuildingProgressState.Building)
                {
                    var key = new BuildingProgress(player, host, entityPrototype).Key;
                    Holder.ClientCancelBuilding(player, key);
                    return;
                }*/
                if (p.state == BuildingProgressState.Complete)
                {
                    Holder.ChangeState(new PutBuildingState(p.host, entityPrototype));
                    return;
                }
            }
            // client simulation
            DataAlg.Building(model.ctx, player, host, entityPrototype);
            Holder.Client.ClientBuilding(player, host, entityPrototype);
        }
        public override void OnEnter()
        {
            Holder.View.buildMenu.onSelect.AddListener(OnSelectBuild);
            SelectionManager.OnSelect += OnSelect;
        }
        public override void OnExit()
        {
            SelectionManager.OnSelect -= OnSelect;
            Holder.View.buildMenu.onSelect.RemoveListener(OnSelectBuild);
        }
        void OnSelect(SelectionManager mgr)
        {
            var objs = Holder.Model.ctx.entities.Values
                .Where(ControllerHelper.IsUnitCanSelect(Holder.Player, Holder.View))
                .Select(e=>Holder.View.entities[e.Key].gameObject).ToList();
            objs = mgr.GetSelection(objs);

            if (objs.Count != 0)
            {
                Holder.ChangeState(new SelectUnitsState(objs));
            }
        }
    }
}