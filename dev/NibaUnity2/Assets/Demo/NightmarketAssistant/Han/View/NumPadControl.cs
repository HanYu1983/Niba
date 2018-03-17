using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using UnityEngine.Events;
using UnityEngine.EventSystems;
using UnityEngine.Serialization;

namespace NightmarketAssistant
{
    public class NumPadControl : MonoBehaviour
    {
        public Text text;
        public string num;
        public int textLength;

        [SerializeField]
        private UnityEvent onClickRight = new UnityEvent();
        [SerializeField]
        private UnityEvent onClickLeft = new UnityEvent();

        void UpdateView()
        {
            try
            {
                text.text = int.Parse(num) + "";
            }
            catch (Exception e)
            {
                Debug.LogWarning(e.Message);
                text.text = "0";
            }
        }

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
            if(textLength > 0 && this.num.Length >= 5)
            {
                Debug.LogWarning("over text langth:"+textLength);
                return;
            }
            this.num = this.num + num;
            this.num = Num + "";
            UpdateView();
        }
        public void ClickZero2()
        {
            ClickNum(0);
            ClickNum(0);
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
            onClickRight.Invoke();
        }
        public void ClickExpend()
        {
            onClickLeft.Invoke();
        }
    }
}