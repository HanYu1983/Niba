using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;
using GameFramework.UI.Dialogs.Components;
using System;

namespace RobotWar
{
    public class WeaponPageController : MonoBehaviour
    {
        public KeyRef selectUnitKeyRef;
        public KeyRef selectWeaponKeyRef;
        
        public KeyShowPageList unitList;
        public KeyShowPageList weaponList;

        public WeaponDataProvider weaponDataProvider;

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
                weaponDataProvider.ownerUnit = selectUnit;
                weaponList.UpdateView();
                */
            }
        }

        public void Confirm()
        {
            try
            {
                var model = GameManager.Instance.gameObject.GetComponent<Model>();
                if (selectWeaponKeyRef.IsValid == false)
                {
                    Debug.LogWarning("沒有指定武器");
                    return;
                }
                var weapon = selectWeaponKeyRef.Ref;
                if (selectUnitKeyRef.IsValid)
                {
                    var unit = selectUnitKeyRef.Ref;
                    DataAlg.AssignWeapon(model.ctx, weapon, unit);
                }
                else
                {
                    DataAlg.AssignWeapon(model.ctx, weapon, null);
                }
                model.RequestSaveHome();

                weaponList.UpdateView();
                selectWeaponKeyRef.NotifyValueChange();
            }
            catch (Exception e)
            {
                ModelController.OnException(e);
            }
        }

        public void CancelUnit()
        {
            selectUnitKeyRef.value = null;
            selectUnitKeyRef.NotifyValueChange();

            weaponDataProvider.ownerUnit = null;
            weaponList.UpdateView();
        }

        public void FilterOwner()
        {
            if(selectUnitKeyRef.IsValid == false)
            {
                Debug.LogWarning("XX");
                return;
            }
            weaponDataProvider.ownerUnit = selectUnitKeyRef.Ref;
            weaponList.UpdateView();
        }
    }
}