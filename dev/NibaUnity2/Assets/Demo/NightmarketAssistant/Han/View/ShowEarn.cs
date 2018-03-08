using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;

namespace NightmarketAssistant
{
    public class ShowEarn : MonoBehaviour
    {
        public EarnRef earnRef;
        public Text text;
        public string format;

        private void Start()
        {
            UpdateView();
        }

        void UpdateView()
        {
            var earn = earnRef.Ref;
            var openTime = new DateTime(earn.date);
            text.text = string.Format(format, openTime.ToLocalTime(), earn.money);
        }
    }
}
