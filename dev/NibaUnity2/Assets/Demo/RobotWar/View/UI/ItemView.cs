using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using GameFramework.GameStructure;

namespace RobotWar
{
    public class ItemView : MonoBehaviour
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
            if (txt_unit != null)
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
            var obj = model.ctx.items[key];
            var cfg = ConfigItem.Get(obj.prototype);
            txt_name.text = cfg.name;

            if (txt_unit != null)
            {
                var hasUnit = model.ctx.item2Unit.ContainsKey(key);
                if (hasUnit)
                {
                    var unitKey = model.ctx.item2Unit[key];
                    var unit = model.ctx.units[unitKey];
                    var unitCfg = ConfigUnit.Get(unit.prototype);
                    txt_unit.text = unitCfg.name;
                }
            }

            if (txt_desc != null)
            {
                var msg = "";
                txt_desc.text = msg;
            }
        }
    }
}