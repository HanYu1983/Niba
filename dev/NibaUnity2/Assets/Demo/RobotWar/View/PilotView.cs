using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;
using UnityEngine.UI;

namespace RobotWar
{
    public class PilotView : MonoBehaviour
    {
        public KeyRef keyRef;
        public Text txt_name;
        public Text txt_unit;

        private void Start()
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
            if (keyRef.IsValid == false)
            {
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var key = keyRef.Ref;
            var obj = model.ctx.pilots[key];
            var cfg = ConfigPilot.Get(obj.prototype);
            if (txt_name != null)
            {
                txt_name.text = cfg.name;
            }
            if (txt_unit != null)
            {
                var hasUnit = model.ctx.pilot2Unit.ContainsKey(key);
                if (hasUnit)
                {
                    var unitKey = model.ctx.pilot2Unit[key];
                    var unit = model.ctx.units[unitKey];
                    var unitCfg = ConfigUnit.Get(unit.prototype);
                    txt_unit.text = unitCfg.name;
                }
            }
        }
    }
}