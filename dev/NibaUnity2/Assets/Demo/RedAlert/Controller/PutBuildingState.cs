using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace RedAlert
{
    public class PutBuildingState : DefaultRedAlertControllerState
    {
        public int host;
        public string prototype;

        private void Update()
        {
            Holder.View.SyncPuttingEntityPosition(Holder.View.selectionManager.pointer.localPosition);
            if (Input.GetMouseButtonUp(1))
            {
                Holder.ChangeState(GetComponent<NormalState>());
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
            StartCoroutine(DelayAddListener());
            enabled = true;
        }

        IEnumerator DelayAddListener()
        {
            yield return 0;
            Holder.View.selectionManager.OnSelect += OnSelect;
        }

        public override void OnExit()
        {
            Holder.View.selectionManager.OnSelect -= OnSelect;
            Holder.View.RemovePuttingObject();
            enabled = false;
        }

        void OnSelect(SelectionManager mgr)
        {
            Holder.View.RemovePuttingObject();
            Holder.ClientCreateEntity(Holder.Player, host, prototype, Holder.View.selectionManager.pointer.localPosition);
            Holder.ChangeState(GetComponent<NormalState>());
        }
    }
}