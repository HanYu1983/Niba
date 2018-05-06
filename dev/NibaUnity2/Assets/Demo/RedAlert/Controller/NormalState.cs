using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;

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
            Holder.ClientBuilding(player, host, entityPrototype);
        }

        public override void OnEnter()
        {
            Holder.View.buildMenu.onSelect.AddListener(OnSelectBuild);
        }
        public override void OnExit()
        {
            Holder.View.buildMenu.onSelect.RemoveListener(OnSelectBuild);
        }
        void OnSelect(SelectionManager mgr)
        {

        }
    }
}