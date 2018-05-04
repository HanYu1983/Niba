using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class BuildMenuView : MonoBehaviour
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
            var key = keyRef.Ref;
            var progress = DataAlg.GetBuildingProgress(model.ctx, playerHolder.player, key);
            if(progress == null)
            {
                var building = ConfigEntity.Get(key);
                txt_name.text = string.Format("{0} {1}", building.Name, building.Cost);
                gameObject.SetActive(true);
            }
            else
            {
                var p = progress.Progress;
                var building = ConfigEntity.Get(key);
                txt_name.text = string.Format("{0} {1} {2:000}%", building.Name, building.Cost, p);
                gameObject.SetActive(true);
            }
        }
    }
}