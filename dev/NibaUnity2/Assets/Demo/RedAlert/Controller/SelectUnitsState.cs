using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System.Linq;

namespace RedAlert
{
    public class SelectUnitsState : DefaultRedAlertControllerState
    {
        List<GameObject> units;
        public SelectUnitsState(List<GameObject> units)
        {
            this.units = units;
        }
        public override void OnEnter()
        {
            SelectionManager.OnSelect += OnSelect;
        }
        public override void OnExit()
        {
            SelectionManager.OnSelect -= OnSelect;
        }
        public override void OnUpdate(float dt)
        {
            if (Input.GetMouseButtonUp(1))
            {
                var sm = Holder.View.selectionManager;
                var pos = sm.pointer.localPosition;
                Holder.Client.ClientDirectMoveTo(units, pos+new Vector3(0,5,0));
            }
        }

        void OnSelect(SelectionManager mgr)
        {
            var objs = Holder.Model.ctx.entities.Values
                .Where(ControllerHelper.IsUnitCanSelect(Holder.Player, Holder.View))
                .Select(e => Holder.View.entities[e.Key].gameObject).ToList();
            objs = mgr.GetSelection(objs);

            if(objs.Count != 0)
            {
                units = objs;
                return;
            }

            Holder.ChangeState(new NormalState());
        }
    }
}