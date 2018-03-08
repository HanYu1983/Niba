using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;

namespace NightmarketAssistant
{
    public class NumPadControl : MonoBehaviour
    {
        public Text text;
        void UpdateView()
        {
            try
            {
                text.text = int.Parse(num) + "";
            }
            catch (Exception)
            {
                text.text = "0";
            }
        }
        
        public Action<NumPadControl> OnEnter = delegate { };
        public string num;
        public int Num
        {
            get
            {
                return int.Parse(num);
            }
        }
        public void ClickNum(int num)
        {
            this.num = this.num + num;
            UpdateView();
        }
        public void ClickClear()
        {
            num = "0";
            UpdateView();
        }
        public void ClickEnter()
        {
            OnEnter(this);
        }
    }
}