using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;


namespace RobotWar
{
    public class PilotPageController : MonoBehaviour
    {
        public KeyRef selectUnitKeyRef;
        public KeyRef selectPilotKeyRef;
        public KeyShowPageList pilotList;
        public KeyShowPageList unitList;

        private void Start()
        {
            StartCoroutine(DelayStart());
        }

        IEnumerator DelayStart()
        {
            yield return 0;
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            if (model.HasSelectUnit)
            {
                var selectUnit = model.selectUnit;
                selectUnitKeyRef.value = selectUnit;
                selectUnitKeyRef.NotifyValueChange();

                var pilot = DataAlg.GetPilot(model.ctx, selectUnit);
                if (pilot != null)
                {
                    selectPilotKeyRef.value = pilot.Key;
                    selectPilotKeyRef.NotifyValueChange();
                }
            }
        }

        public void Confirm()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            if (selectPilotKeyRef.IsValid == false)
            {
                Debug.LogWarning("沒有指定駕駛");
                return;
            }
            var pilot = selectPilotKeyRef.Ref;
            if (selectUnitKeyRef.IsValid)
            {
                var unit = selectUnitKeyRef.Ref;
                DataAlg.AssignPilot(model.ctx, pilot, unit);
            }
            else
            {
                DataAlg.AssignPilot(model.ctx, pilot, null);
            }
            pilotList.UpdateView();
        }

        public void CancelUnit()
        {
            selectUnitKeyRef.value = null;
            selectUnitKeyRef.NotifyValueChange();
        }
    }
}