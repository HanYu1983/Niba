using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace RedAlert
{
    public class InfoView : MonoBehaviour
    {
        public Text txt_money;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        private void Awake()
        {
            model.onMoneyChange += UpdateView;
        }

        private void Update()
        {
            UpdateView();
        }

        void UpdateView()
        {
            if(txt_money != null)
            {
                var money = model.ctx.money[playerHolder.player];
                txt_money.text = string.Format("money:{0}", money);
            }
        }
    }
}