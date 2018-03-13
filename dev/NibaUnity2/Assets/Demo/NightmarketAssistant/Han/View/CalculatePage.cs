using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;

namespace NightmarketAssistant
{
    public class CalculatePage : MonoBehaviour
    {
        public NumPadControl numPad;
        public EarnListRef earnList;

        private void OnEnable()
        {
            numPad.OnEnter += OnNumPadEnter;
            numPad.OnExpend += OnNumPadExpend;
        }

        private void OnDisable()
        {
            numPad.OnEnter -= OnNumPadEnter;
            numPad.OnExpend -= OnNumPadExpend;
        }

        public void ClickEarnDelete(EarnRef earnRef)
        {
            earnList.Ref.Remove(earnRef.Ref);
            earnList.OnValueChange();
        }

        public void ClearEarns()
        {
            earnList.Ref.Clear();
            earnList.OnValueChange();
        }

        public IEnumerable<Earn> GetIncomeEarn()
        {
            return earnList.Ref.Where(e =>
            {
                return e.money < 0;
            }).Select(e =>
            {
                e.money = -e.money;
                return e;
            });
        }

        void OnNumPadEnter(NumPadControl o)
        {
            if (o.Num == 0)
            {
                Debug.LogWarning("ignore 0");
                return;
            }
            var earn = new Earn(DateTime.Now.Ticks, "temp");
            earn.money = -o.Num;
            earn.comment = "價錢";
            earnList.Ref.Add(earn);
            earnList.OnValueChange();

            numPad.ClickClear();
        }

        void OnNumPadExpend(NumPadControl o)
        {
            if(o.Num == 0)
            {
                Debug.LogWarning("ignore 0");
                return;
            }
            var earn = new Earn(DateTime.Now.Ticks, "temp");
            earn.money = o.Num;
            earn.comment = "客人支付";
            earnList.Ref.Add(earn);
            earnList.OnValueChange();

            numPad.ClickClear();
        }
    }
}