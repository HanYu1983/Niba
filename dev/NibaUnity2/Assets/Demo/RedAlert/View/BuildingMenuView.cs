using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class BuildingMenuView : MonoBehaviour
    {
        public IntRef keyRef;
        public Text txt_name;
        public RedAlertModel model;

        void Awake()
        {
            keyRef.OnValueChange += UpdateView;
        }

        void UpdateView()
        {
            txt_name.text = "";
            if (keyRef.IsValid == false)
            {
                return;
            }
            var key = keyRef.Ref;
            var building = model.ctx.entities[key];
            txt_name.text = ConfigEntity.Get(building.prototype).Name;
        }
    }
}