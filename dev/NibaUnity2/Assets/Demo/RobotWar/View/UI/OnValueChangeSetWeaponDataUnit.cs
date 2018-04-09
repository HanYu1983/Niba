using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RobotWar
{
    public class OnValueChangeSetWeaponDataUnit : MonoBehaviour
    {
        public KeyRef unitKeyRef;
        public KeyShowPageList weaponList;
        public WeaponDataProvider weaponDataProvider;

        private void Awake()
        {
            unitKeyRef.OnValueChange += OnValueChange;
        }

        private void OnDestroy()
        {
            unitKeyRef.OnValueChange -= OnValueChange;
        }

        void OnValueChange()
        {
            if (unitKeyRef.IsValid == false)
            {
                weaponDataProvider.ownerUnit = null;
            }
            else
            {
                weaponDataProvider.ownerUnit = unitKeyRef.Ref;
            }
            weaponList.UpdateView();
        }
    }
}