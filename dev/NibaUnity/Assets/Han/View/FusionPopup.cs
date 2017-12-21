using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
using System;
using System.Linq;

namespace View{
	public class FusionPopup : MonoBehaviour {
		public ItemView itemView;
		public FusionRequireView fusionRequireView;

		public MapPlayer Who{ get; set; }

		public void UpdateUI(IModelGetter model){
			itemView.Data = model.CanFusionItems;
			itemView.UpdateDataView (model);
		}

		#region controller
		public IEnumerator HandleCommand(IModelGetter model, string msg, object args, Action<Exception> callback){
			switch (msg) {
			default:
				{
					if (msg.Contains (fusionRequireView.CommandPrefix)) {
						yield return fusionRequireView.HandleCommand (model, msg, args, callback);
					}
					if (msg.Contains (itemView.CommandPrefix)) {
						if (msg.Contains (itemView.CommandPrefix + "_item_")) {
							// 修改狀態文字
							var selectIdx = itemView.CurrIndex (msg);
							var item = itemView.Data.ToList () [selectIdx];
							/*
							var isCanFusion = model.IsCanFusion (item.prototype, Who);
							if (isCanFusion <= 0) {
								var cfg = ConfigItem.Get (item.prototype);
								callback (new Exception ("無法合成:"+cfg.Name));
								yield break;
							}*/
							fusionRequireView.Who = Who;
							fusionRequireView.FusionTarget = item;
							fusionRequireView.UpdateUI (model);
						}
						yield return itemView.HandleCommand (model, msg, args, callback);
					}
				}
				break;
			}
			yield return null;
		}
		#endregion
	}
}