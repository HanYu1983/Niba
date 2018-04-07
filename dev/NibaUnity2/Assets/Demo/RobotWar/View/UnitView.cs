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
        public KeyRef unitRef;
        public Text txt_name;

        private void Start()
        {
            unitRef.OnValueChange += UpdateView;
        }

        void OnDestroy()
        {
            unitRef.OnValueChange -= UpdateView;
        }

        void UpdateView()
        {
            if (unitRef.IsValid == false)
            {
                txt_name.text = "";
                return;
            }
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var unitKey = unitRef.Ref;
            var unit = model.ctx.units[unitKey];
            var cfg = ConfigUnit.Get(unit.prototype);
            txt_name.text = cfg.name;
        }
    }
}