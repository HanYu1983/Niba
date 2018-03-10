using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;

namespace NightmarketAssistant
{
    public class DetailScoreView : MonoBehaviour, INeedModel
    {
        public Text txt_total, txt_avgTime, txt_avgEarn, txt_maxEarn, txt_minEarn, txt_earnCount;
        public EarnListRef rangeRef;

        void Start()
        {
            OnEnable();
        }

        void OnDestroy()
        {
            OnDisable();
        }

        private void OnEnable()
        {
            NMAEvent.OnComponentStart(this);
            rangeRef.OnValueChange += UpdateView;
            // 這時可能model還沒注入
            if (model == null)
            {
                return;
            }
            UpdateView();
        }

        private void OnDisable()
        {
            NMAEvent.OnComponentDestroy(this);
            rangeRef.OnValueChange -= UpdateView;
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
            var earnCount = earns.Count;

            if (txt_total != null)
            {
                txt_total.text = total + "";
            }
            if (txt_avgTime != null)
            {
                txt_avgTime.text = avgTime.Seconds + " seconds";
            }
            if (txt_avgEarn != null)
            {
                txt_avgEarn.text = avgEarn + "";
            }
            if (txt_maxEarn != null)
            {
                txt_maxEarn.text = maxEarn + "";
            }
            if (txt_minEarn != null)
            {
                txt_minEarn.text = minEarn + "";
            }
            if(txt_earnCount != null)
            {
                txt_earnCount.text = earnCount + "";
            }
        }
    }
}