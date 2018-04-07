using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using UnityEngine.UI;

namespace RobotWar
{
    public class UnitView : MonoBehaviour
    {
        public KeyRef keyRef;
        public Text txt_name;
        public Text txt_pilot;
        public Text txt_desc;

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
            if (keyRef.IsValid == false)
            {
                txt_name.text = "";
                txt_pilot.text = "";
                txt_desc.text = "";
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var key = keyRef.Ref;
            var obj = model.ctx.units[key];
            var cfg = ConfigUnit.Get(obj.prototype);
            if(txt_name != null)
            {
                txt_name.text = cfg.name;
            }
            if(txt_pilot != null)
            {
                var pilot = DataAlg.GetPilot(model.ctx, key);
                if (pilot != null)
                {
                    var pilotCfg = ConfigPilot.Get(pilot.prototype);
                    txt_pilot.text = pilotCfg.name;
                }
            }
            if(txt_desc != null)
            {
                var msg = string.Format("hp: {0} en: {1}", cfg.hp, cfg.en);
                txt_desc.text = msg;
            }
        }
    }
}