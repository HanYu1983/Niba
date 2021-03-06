﻿using System.Collections;
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
                var progressKey = new BuildingProgress(playerHolder.player, host, prototype).Key;
                var pendingCnt = DataAlg.GetPendingBuildingProgressCount(model.ctx, progressKey);
                txt_name.text = string.Format("{0} {1} pending:{2}", building.Name, building.Cost, pendingCnt);
                gameObject.SetActive(true);
            }
            else
            {
                var p = progress.Progress;
                var building = ConfigEntity.Get(prototype);
                var pendingCnt = DataAlg.GetPendingBuildingProgressCount(model.ctx, progress.Key) + 1;
                txt_name.text = string.Format("{0} {1} {2:000}% pending:{3}", building.Name, building.Cost, p, pendingCnt);
                gameObject.SetActive(true);
            }
        }
    }
}