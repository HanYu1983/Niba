using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using GameFramework.GameStructure;

namespace RobotWar
{
    public class WeaponView : MonoBehaviour
    {
        public KeyRef keyRef;
        public KeyRef unitKeyRef;
        public Text txt_name;

        private void Start()
        {
            keyRef.OnValueChange += UpdateView;
            unitKeyRef.OnValueChange += UpdateView;
        }

        void OnDestroy()
        {
            unitKeyRef.OnValueChange -= UpdateView;
            keyRef.OnValueChange -= UpdateView;
        }

        void UpdateView()
        {
            if (keyRef.IsValid == false)
            {
                txt_name.text = "";
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var key = keyRef.Ref;
            var obj = model.ctx.weapons[key];
            var cfg = ConfigWeapon.Get(obj.prototype);
            txt_name.text = cfg.name;

            if (unitKeyRef.IsValid)
            {
                var unitKey = unitKeyRef.Ref;
                var hasOwner = model.ctx.weapon2Unit.ContainsKey(key);
                if (hasOwner)
                {
                    var owner = model.ctx.weapon2Unit[key];
                    if(owner == unitKey)
                    {
                        // change color
                    }
                }
            }
        }
    }
}