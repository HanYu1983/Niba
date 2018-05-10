using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class UnitSmallView : MonoBehaviour
    {
        public IntRef unitKeyRef;

        public Text txt_name;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        void Awake()
        {
            unitKeyRef.OnValueChange += UpdateView;
        }

        private void Update()
        {
            UpdateView();
        }

        void UpdateView()
        {
            txt_name.text = "";
            if (unitKeyRef.IsValid == false)
            {
                gameObject.SetActive(false);
                return;
            }
            var unitKey = unitKeyRef.Ref;
            if(model.ctx.entities.ContainsKey(unitKey) == false)
            {
                gameObject.SetActive(false);
                return;
            }
            var unit = model.ctx.entities[unitKey];
            var cfg = ConfigEntity.Get(unit.prototype);
            txt_name.text = cfg.Name;
            gameObject.SetActive(true);
        }
    }
}