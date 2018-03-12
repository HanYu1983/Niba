using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

namespace NightmarketAssistant
{
    public class ShowCalculateResult : MonoBehaviour
    {
        public EarnListRef earnListRef;
        public Text txt_result;
        public string format;

        private void Start()
        {
            UpdateView();
        }

        private void OnEnable()
        {
            earnListRef.OnValueChange += UpdateView;
        }

        private void OnDisable()
        {
            earnListRef.OnValueChange -= UpdateView;
        }

        void UpdateView()
        {
            var income = earnListRef.Ref.Where(e =>
            {
                return e.money > 0;
            }).Sum(e => e.money);

            var outcome = Mathf.Abs(earnListRef.Ref.Where(e =>
            {
                return e.money < 0;
            }).Sum(e => e.money));

            var result = income - outcome;
            txt_result.text = string.Format(format, income, outcome, result);
        }
    }
}