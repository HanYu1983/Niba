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
        public bool isConfigId;

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
            ConfigItem cfg = null;
            if (isConfigId)
            {
                var key = keyRef.Ref;
                cfg = ConfigItem.Get(key);
            }
            else
            {
                var key = keyRef.Ref;
                var obj = model.ctx.items[key];
                cfg = ConfigItem.Get(obj.prototype);

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
                    var msg = string.Format("cost {0}", cfg.moneyCost);
                    txt_desc.text = msg;
                }
            }
            txt_name.text = cfg.name;
        }
    }
}