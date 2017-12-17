using System;
using UnityEngine;
using UnityEngine.UI;
using Common;
using System.Linq;
using System.Collections.Generic;

namespace View
{
	public class ItemPopup : MonoBehaviour
	{
		public GameObject itemParent;
		public int offset;
		public int limit;
		public Text txtCurrItem;
		public Button[] btns;

		public Button[] items;

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
				if (value <= 0) {
					offset = 0;
					return;
				}
				offset = value * limit;
			}
		}

		public int CurrIndex(string cmd) {
			var idx = int.Parse (cmd.Replace ("click_itemPopup_item_", ""));
			return idx + offset;
		}

		public enum Mode{
			Normal, Equip
		}
		public Mode showMode;
		public Mode ShowMode{
			set{
				showMode = value;
			}
		}

		public void UpdateButtonLabel(IModelGetter model){
			var useBtn = btns.Where (btn => {
				return btn.gameObject.name == "btn_use";
			}).FirstOrDefault();
			var nouseBtn = btns.Where (btn => {
				return btn.gameObject.name == "btn_nouse";
			}).FirstOrDefault();

			if (useBtn != null) {
				useBtn.GetComponentInChildren<Text> ().text = 
					showMode == Mode.Normal ? "使用" : "裝備";
			}
			if (nouseBtn != null) {
				nouseBtn.GetComponentInChildren<Text> ().text = 
					showMode == Mode.Normal ? "賣掉" : "拆掉";
			}


			var leftHandBtn = btns.Where (btn => {
				return btn.gameObject.name == "btn_leftHand";
			}).FirstOrDefault();

			var rightHandBtn = btns.Where (btn => {
				return btn.gameObject.name == "btn_rightHand";
			}).FirstOrDefault();

			var handBtns = new Button[]{ leftHandBtn, rightHandBtn };
			var handWeapons = model.MapPlayer.weapons.Where (item => {
				var cfg = ConfigItem.Get(item.prototype);
				return cfg.Position == ConfigWeaponPosition.ID_hand;
			}).ToList();

			for (var i = 0; i < handWeapons.Count; ++i) {
				if (handBtns [i] == null) {
					continue;
				}
				var btn = handBtns [i];
				var weapon = handWeapons [i];
				var cfg = ConfigItem.Get(weapon.prototype);
				btn.GetComponentInChildren<Text> ().text = cfg.Name;
			}

			var a1Btn = btns.Where (btn => {
				return btn.gameObject.name == "btn_a1";
			}).FirstOrDefault();
			var a2Btn = btns.Where (btn => {
				return btn.gameObject.name == "btn_a2";
			}).FirstOrDefault();
			var a3Btn = btns.Where (btn => {
				return btn.gameObject.name == "btn_a3";
			}).FirstOrDefault();

			var aWeapons = model.MapPlayer.weapons.Where (item => {
				var cfg = ConfigItem.Get(item.prototype);
				return cfg.Position == ConfigWeaponPosition.ID_accessory;
			}).ToList();

			var aBtns = new Button[]{ a1Btn, a2Btn, a3Btn };
			for (var i = 0; i < aWeapons.Count; ++i) {
				if (aBtns [i] == null) {
					continue;
				}
				var btn = aBtns [i];
				var weapon = aWeapons [i];
				var cfg = ConfigItem.Get(weapon.prototype);
				btn.GetComponentInChildren<Text> ().text = cfg.Name;
			}
		}

		IEnumerable<Item> data;
		public IEnumerable<Item> Data{
			set{
				data = value;
			}
			get{
				return data;
			}
		}

		public void CurrItemLabel(IModelGetter model, int currIndex){
			if (data == null) {
				Debug.LogWarning ("還沒有設定data");
				return;
			}
			var item = data.Skip (currIndex).First ();
			var cfg = ConfigItem.Get (item.prototype);
			txtCurrItem.text = string.Format ("你選擇{0}", cfg.Name);
		}

		public void UpdateUI(IModelGetter model){
			UpdateButtonLabel (model);
			if (data == null) {
				Debug.LogWarning ("還沒有設定data");
				return;
			}
			var modelItems = data.ToList ();
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
				var appendStr = "";
				switch (showMode) {
				case Mode.Equip:
					{
						if (cfg.Type == "weapon") {
							appendStr += "(" + cfg.Ability + ")";
						}
					}
					break;
				}

				var msg = string.Format ("{0}{1}{2}個", name, appendStr, cnt);
				btn.gameObject.GetComponentInChildren<Text> ().text = msg;
				btn.gameObject.SetActive (true);
			}
		}
	}
}

