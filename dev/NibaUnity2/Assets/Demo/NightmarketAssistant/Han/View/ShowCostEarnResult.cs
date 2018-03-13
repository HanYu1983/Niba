using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

namespace NightmarketAssistant
{
    public class ShowCostEarnResult : MonoBehaviour
    {
        public EarnListRef costList, earnList;
        public Text txt_result;
        public string format;

        private void Start()
        {
            UpdateView();
        }

        private void OnEnable()
        {
            costList.OnValueChange += UpdateView;
            earnList.OnValueChange += UpdateView;
            UpdateView();
        }

        private void OnDisable()
        {
            costList.OnValueChange -= UpdateView;
            earnList.OnValueChange += UpdateView;
        }

        void UpdateView()
        {
            var income = earnList.Ref.Sum(e => e.money);
            var outcome = costList.Ref.Sum(e => e.money);
            var result = income + outcome;
            txt_result.text = string.Format(format, income, outcome, result);
        }
    }
}