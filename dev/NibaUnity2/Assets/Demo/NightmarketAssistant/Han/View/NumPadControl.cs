﻿using System.Collections;
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
        public Action<NumPadControl> OnExpend = delegate { };
        public string num;
        public int Num
        {
            get
            {
                try
                {
                    return int.Parse(num);
                }
                catch (Exception)
                {
                    Debug.LogWarning("invalid num:"+num+". return 0");
                    return 0;
                }
            }
        }
        public void ClickNum(int num)
        {
            this.num = this.num + num;
            UpdateView();
        }
        public void ClickZero2()
        {
            this.num = this.num + "00";
            UpdateView();
        }
        public void ClickBack()
        {
            if (num.Length <= 0)
            {
                return;
            }
            num = num.Substring(0, num.Length - 1);
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
        public void ClickExpend()
        {
            OnExpend(this);
        }
    }
}