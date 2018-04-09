using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;


namespace RobotWar
{
    public class ItemPageController : MonoBehaviour
    {
        public KeyRef selectUnitKeyRef;
        public KeyRef selectItemKeyRef;
        
        public KeyShowPageList unitList;
        public KeyShowPageList itemList;

        public ItemDataProvider itemDataProvider;

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
                /*
                itemDataProvider.ownerUnit = selectUnit;
                itemList.UpdateView();
                */
            }
        }

        public void Confirm()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            if (selectItemKeyRef.IsValid == false)
            {
                Debug.LogWarning("沒有指定道具");
                return;
            }
            var item = selectItemKeyRef.Ref;
            if (selectUnitKeyRef.IsValid)
            {
                var unit = selectUnitKeyRef.Ref;
                DataAlg.AssignItem(model.ctx, item, unit);
            }
            else
            {
                DataAlg.AssignItem(model.ctx, item, null);
            }
            itemList.UpdateView();
            selectItemKeyRef.NotifyValueChange();
        }

        public void CancelUnit()
        {
            selectUnitKeyRef.value = null;
            selectUnitKeyRef.NotifyValueChange();

            itemDataProvider.ownerUnit = null;
            itemList.UpdateView();
        }

        public void FilterOwner()
        {
            if(selectUnitKeyRef.IsValid == false)
            {
                Debug.LogWarning("XX");
                return;
            }
            itemDataProvider.ownerUnit = selectUnitKeyRef.Ref;
            itemList.UpdateView();
        }
    }
}