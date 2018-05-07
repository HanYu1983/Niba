using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace RedAlert
{
    public class PutBuildingState : DefaultRedAlertControllerState
    {
        int host;
        string prototype;

        public PutBuildingState(int host, string prototype)
        {
            this.host = host;
            this.prototype = prototype;
        }

        public override void OnUpdate(float dt)
        {
            Holder.View.SyncPuttingEntityPosition(Holder.View.selectionManager.pointer.localPosition);
            if (Input.GetMouseButtonUp(1))
            {
                Holder.ChangeState(new NormalState());
            }
        }

        public override void OnEnter()
        {
            var cfg = ConfigEntity.Get(prototype);
            if (cfg.EntityType != ConfigEntityType.ID_building)
            {
                throw new System.Exception("must building");
            }
            Holder.View.SpawnPuttingEntity(prototype, Holder.View.selectionManager.pointer.localPosition);
            Holder.View.StartCoroutine(DelayAddListener());
        }

        IEnumerator DelayAddListener()
        {
            yield return 0;
            SelectionManager.OnSelect += OnSelect;
        }

        public override void OnExit()
        {
            SelectionManager.OnSelect -= OnSelect;
            Holder.View.RemovePuttingObject();
        }

        void OnSelect(SelectionManager mgr)
        {
            Holder.View.RemovePuttingObject();
            Holder.Client.ClientCreateEntity(Holder.Player, host, prototype, Holder.View.selectionManager.pointer.localPosition);
            Holder.ChangeState(new NormalState());
        }
    }
}