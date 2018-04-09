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
        public Text txt_name;
        public Text txt_unit;
        public Text txt_desc;

        private void Awake()
        {
            keyRef.OnValueChange += UpdateView;
        }

        void OnDestroy()
        {
            keyRef.OnValueChange -= UpdateView;
        }

        void UpdateView()
        {
            txt_name.text = "";
            if(txt_unit != null)
            {
                txt_unit.text = "";
            }
            if (txt_desc != null)
            {
                txt_desc.text = "";
            }
            if (keyRef.IsValid == false)
            {
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var key = keyRef.Ref;
            var obj = model.ctx.weapons[key];
            var cfg = ConfigWeapon.Get(obj.prototype);
            txt_name.text = cfg.name;

            if (txt_unit != null)
            {
                var hasUnit = model.ctx.weapon2Unit.ContainsKey(key);
                if (hasUnit)
                {
                    var unitKey = model.ctx.weapon2Unit[key];
                    var unit = model.ctx.units[unitKey];
                    var unitCfg = ConfigUnit.Get(unit.prototype);
                    txt_unit.text = unitCfg.name;
                }
            }

            if(txt_desc != null)
            {
                var power = DataAlg.WeaponPowerWithLevel(model.ctx, key);
                var minRange = cfg.minRange;
                var maxRange = DataAlg.WeaponRangeWithLevel(model.ctx, key);
                var level = obj.level;
                var msg = string.Format("{0} {1}~{2} Lv{3}", power , minRange, maxRange, level+1);
                txt_desc.text = msg;
            }
        }
    }
}