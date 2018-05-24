using System;
using UnityEngine;
using UnityEngine.UI;
namespace Niba
{
	public class PropView : MonoBehaviour
	{
        public Text txt_money;
        
		public void UpdateView(IModelGetter model){
			if(txt_money != null)
            {
                txt_money.text = "money:"+model.Money;
            }
		}
	}
}

