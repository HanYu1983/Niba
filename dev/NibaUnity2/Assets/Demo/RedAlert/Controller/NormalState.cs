using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;

namespace RedAlert
{
    public class NormalState : DefaultRedAlertControllerState
    {
        public IntShowPageList buildingMenu;
        public StrShowPageList buildMenu;

        public void OnSelectBuild()
        {
            var host = buildingMenu.selectedKeyRef.Ref;
            var model = Holder.Model;
            var player = Holder.Player;
            var entityPrototype = buildMenu.selectedKeyRef.Ref;
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
                    var state = GetComponent<PutBuildingState>();
                    state.host = p.host;
                    state.prototype = entityPrototype;
                    Holder.ChangeState(state);
                    return;
                }
            }
            // client simulation
            DataAlg.Building(model.ctx, player, host, entityPrototype);
            Holder.ClientBuilding(player, host, entityPrototype);
        }

        public override void OnEnter()
        {
            buildMenu.onSelect.AddListener(OnSelectBuild);
        }
        public override void OnExit()
        {
            buildMenu.onSelect.RemoveListener(OnSelectBuild);
        }
        void OnSelect(SelectionManager mgr)
        {

        }
    }
}