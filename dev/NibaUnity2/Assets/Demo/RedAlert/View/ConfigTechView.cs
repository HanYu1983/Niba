using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class ConfigTechView : MonoBehaviour
    {
        public StrRef keyRef;

        public Text txt_name;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        void Awake()
        {
            keyRef.OnValueChange += UpdateView;
        }

        private void Update()
        {
            UpdateView();
        }

        void UpdateView()
        {
            txt_name.text = "";
            if (keyRef.IsValid == false)
            {
                gameObject.SetActive(false);
                return;
            }
            var techPrototype = keyRef.Ref;
            var cfg = ConfigTech.Get(techPrototype);
            var progress = DataAlg.GetBuildingProgress(model.ctx, playerHolder.player, ControllerHelper.TechHost, techPrototype);
            if (progress == null)
            {
                var enable = false;
                var tech = DataAlg.GetTechWithTechPrototype(model.ctx, playerHolder.player, techPrototype);
                if(tech != null)
                {
                    enable = tech.enabled;
                }
                txt_name.text = cfg.Name + ":" + enable;
            }
            else
            {
                txt_name.text = cfg.Name + ":" + progress.Progress + "%";
            }
            gameObject.SetActive(true);
        }
    }
}