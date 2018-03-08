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
        public EarnsInRangeRef rangeRef;

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
            var range = rangeRef.Ref;
            var total = Alg.TotalEarn(range.earns);
            var avgTime = TimeSpan.FromTicks(Alg.AverageTimeBetweenEarn(model.States, range.earns));
            var avgEarn = Alg.AverageEarn(range.earns);
            var maxEarn = Alg.MaxEarn(range.earns);
            var minEarn = Alg.MinEarn(range.earns);
            txt_total.text = total + "";
            txt_avgTime.text = avgTime.Minutes+" mins";
            txt_avgEarn.text = avgEarn+"";
            txt_maxEarn.text = maxEarn+"";
            txt_minEarn.text = minEarn+"";
        }
    }
}