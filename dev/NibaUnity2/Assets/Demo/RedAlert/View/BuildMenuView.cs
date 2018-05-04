using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class BuildMenuView : MonoBehaviour
    {
        public IntRef hostRef;
        public StrRef prototypeRef;
        public Text txt_name;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        void Awake()
        {
            prototypeRef.OnValueChange += UpdateView;
        }

        private void Update()
        {
            UpdateView();
        }

        void UpdateView()
        {
            txt_name.text = "";
            if (prototypeRef.IsValid == false)
            {
                gameObject.SetActive(false);
                return;
            }
            var host = hostRef.Ref;
            var prototype = prototypeRef.Ref;
            var progress = DataAlg.GetBuildingProgress(model.ctx, playerHolder.player, host, prototype);
            if(progress == null)
            {
                var building = ConfigEntity.Get(prototype);
                txt_name.text = string.Format("{0} {1}", building.Name, building.Cost);
                gameObject.SetActive(true);
            }
            else
            {
                var p = progress.Progress;
                var building = ConfigEntity.Get(prototype);
                txt_name.text = string.Format("{0} {1} {2:000}%", building.Name, building.Cost, p);
                gameObject.SetActive(true);
            }
        }
    }
}