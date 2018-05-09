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
            var objs = Holder.Model.ctx.entities.Values.Where(e =>
            {
                if (e.player != Holder.Player)
                {
                    return false;
                }
                var cfg = ConfigEntity.Get(e.prototype);
                if (cfg.EntityType == ConfigEntityType.ID_building)
                {
                    return false;
                }
                if (cfg.EntityType == ConfigEntityType.ID_bullet)
                {
                    return false;
                }
                var isExistInView = Holder.View.entities.ContainsKey(e.Key);
                if(isExistInView == false)
                {
                    return false;
                }
                return true;
            }).Select(e=>Holder.View.entities[e.Key].gameObject).ToList();
            objs = mgr.GetSelection(objs);

            if (objs.Count != 0)
            {
                Holder.ChangeState(new SelectUnitsState(objs));
            }
        }
    }
}