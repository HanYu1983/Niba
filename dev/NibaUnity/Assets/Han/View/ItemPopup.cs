using System;
using UnityEngine;
using UnityEngine.UI;
using Common;
using System.Linq;

namespace View
{
	public class ItemPopup : MonoBehaviour
	{
		public GameObject itemParent;
		public Button[] items;
		public int offset;
		public int limit;

		void Awake(){
			if (limit > 10) {
				throw new Exception ("limit不能大於10");
			}
			items = itemParent.GetComponentsInChildren<Button> ();
		}

		public int Page{
			get{
				return offset / limit;
			}
			set{
				offset = value * limit;
			}
		}

		public int CurrIndex(string cmd) {
			var idx = int.Parse (cmd.Replace ("click_itemPopup_item_", ""));
			return idx + offset;
		}

		public void UpdateUI(IModelGetter model){
			var modelItems = model.StorageInMap.ToList ();
			for (var i = 0; i < limit; ++i) {
				var curr = i + offset;
				var btn = items [i];

				if (curr >= modelItems.Count) {
					btn.gameObject.SetActive (false);
					continue;
				}
				var modelItem = modelItems [curr];
				var cfg = ConfigItem.Get (modelItem.prototype);

				var cnt = modelItem.count;
				var name = cfg.Name;
				var msg = string.Format ("{0}{1}個", name, cnt);
				btn.gameObject.GetComponentInChildren<Text> ().text = msg;
				btn.gameObject.SetActive (true);
			}
		}
	}
}

