using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;

namespace NightmarketAssistant
{
    public class DetailScoreView : MonoBehaviour, INeedModel
    {
        public Text txt_total, txt_avgTime, txt_avgEarn, txt_maxEarn, txt_minEarn;
        public EarnListRef rangeRef;

        void Start()
        {
            NMAEvent.OnComponentStart(this);
        }

        void OnDestroy()
        {
            NMAEvent.OnComponentDestroy(this);
        }

        private void OnEnable()
        {
            // 這時可能model還沒注入
            if (model == null)
            {
                return;
            }
            UpdateView();
        }

        IModelGetter model;
        public IModelGetter IModel
        {
            get { return model; }
            set
            {
                this.model = value;
                UpdateView();
            }
        }

        public void UpdateView()
        {
            var earns = rangeRef.Ref;
            var total = Alg.TotalEarn(earns);
            var avgTime = TimeSpan.FromTicks(Alg.AverageTimeBetweenEarn(model.States, earns));
            var avgEarn = Alg.AverageEarn(earns);
            var maxEarn = Alg.MaxEarn(earns);
            var minEarn = Alg.MinEarn(earns);
            txt_total.text = total + "";
            txt_avgTime.text = avgTime.Seconds+" seconds";
            txt_avgEarn.text = avgEarn+"";
            txt_maxEarn.text = maxEarn+"";
            txt_minEarn.text = minEarn+"";
        }
    }
}