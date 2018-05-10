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
            var tech = DataAlg.GetTechWithTechPrototype(model.ctx, playerHolder.player, techPrototype);

            var progress = DataAlg.GetBuildingProgress(model.ctx, playerHolder.player, ControllerHelper.TechHost, techPrototype);
            if (progress == null)
            {
                txt_name.text = cfg.Name + ":" + tech.enabled;
            }
            else
            {
                txt_name.text = cfg.Name + ":" + progress.Progress + "%";
            }
            gameObject.SetActive(true);
        }
    }
}