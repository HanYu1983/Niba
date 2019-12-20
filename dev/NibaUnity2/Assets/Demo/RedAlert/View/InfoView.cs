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
                if(model.ctx.money.Count <= playerHolder.player)
                {
                    Debug.LogWarning("你還沒為玩家加入金錢:"+playerHolder.player);
                    return;
                }
                var money = model.ctx.money[playerHolder.player];
                txt_money.text = string.Format("money:{0}", money);
            }
        }
    }
}