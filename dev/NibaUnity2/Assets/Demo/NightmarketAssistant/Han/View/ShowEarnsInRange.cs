using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.UI;

namespace NightmarketAssistant
{
    public class ShowEarnsInRange : MonoBehaviour
    {
        public EarnsInRangeRef earnsInRangeRef;
        public Text text;
        public string format;

        private void Start()
        {
            UpdateView();
        }

        void UpdateView()
        {
            var total = Alg.TotalEarn(earnsInRangeRef.Ref.earns);
            var openTime = earnsInRangeRef.Ref.open;
            text.text = string.Format(format, openTime.ToShortDateString(), total);
        }
    }
}