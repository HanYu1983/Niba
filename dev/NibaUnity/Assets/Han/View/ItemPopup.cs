using System;
using UnityEngine;
using UnityEngine.UI;
using Common;
using System.Linq;
using System.Collections.Generic;
using System.Collections;

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
		/// <summary>
		/// 將點選列表觸發的指令還原成道具索引
		/// 用這個索引呼叫CurrItemLabel來改變狀態列
		/// </summary>
		/// <returns>The index.</returns>
		/// <param name="cmd">Cmd.</param>
		public int CurrIndex(string cmd) {
			var idx = int.Parse (cmd.Replace ("click_itemPopup_item_", ""));
			return idx + offset;
		}
		/// <summary>
		/// 更新按鈕文字
		/// 每次道具裝備或拆掉後呼叫
		/// </summary>
		/// <param name="model">Model.</param>
		public void UpdateButtonLabel(IModelGetter model){
			// 頭
			var btn_head = btns.Where (btn => {
				return btn.gameObject.name == "btn_head";
			}).FirstOrDefault();
			if (btn_head == null) {
				throw new Exception ("xxx");
			}
			btn_head.GetComponentInChildren<Text> ().text = "頭";
			var head = model.MapPlayer.weapons.Where (item => {
				var cfg = ConfigItem.Get (item.prototype);
				return cfg.Position == ConfigWeaponPosition.ID_head;
			}).FirstOrDefault ();
			if (head.Equals (Item.Empty) == false) {
				var cfg = ConfigItem.Get(head.prototype);
				btn_head.GetComponentInChildren<Text> ().text = cfg.Name;
			}
			// 身
			var btn_body = btns.Where (btn => {
				return btn.gameObject.name == "btn_body";
			}).FirstOrDefault();
			if (btn_body == null) {
				throw new Exception ("xxx");
			}
			btn_body.GetComponentInChildren<Text> ().text = "身";
			var body = model.MapPlayer.weapons.Where (item => {
				var cfg = ConfigItem.Get (item.prototype);
				return cfg.Position == ConfigWeaponPosition.ID_body;
			}).FirstOrDefault ();
			if (body.Equals (Item.Empty) == false) {
				var cfg = ConfigItem.Get(body.prototype);
				btn_body.GetComponentInChildren<Text> ().text = cfg.Name;
			}
			// 腳
			var btn_foot = btns.Where (btn => {
				return btn.gameObject.name == "btn_foot";
			}).FirstOrDefault();
			if (btn_foot == null) {
				throw new Exception ("xxx");
			}
			btn_foot.GetComponentInChildren<Text> ().text = "腳";
			var foot = model.MapPlayer.weapons.Where (item => {
				var cfg = ConfigItem.Get (item.prototype);
				return cfg.Position == ConfigWeaponPosition.ID_foot;
			}).FirstOrDefault ();
			if (foot.Equals (Item.Empty) == false) {
				var cfg = ConfigItem.Get(foot.prototype);
				btn_foot.GetComponentInChildren<Text> ().text = cfg.Name;
			}
			// 左右手
			var leftHandBtn = btns.Where (btn => {
				return btn.gameObject.name == "btn_leftHand";
			}).FirstOrDefault();

			var rightHandBtn = btns.Where (btn => {
				return btn.gameObject.name == "btn_rightHand";
			}).FirstOrDefault();

			if (leftHandBtn == null) {
				throw new Exception ("xxx");
			}
			if (rightHandBtn == null) {
				throw new Exception ("xxx");
			}

			leftHandBtn.GetComponentInChildren<Text> ().text = "左";
			rightHandBtn.GetComponentInChildren<Text> ().text = "右";

			var handBtns = new Button[]{ leftHandBtn, rightHandBtn };
			var handWeapons = model.MapPlayer.weapons.Where (item => {
				var cfg = ConfigItem.Get(item.prototype);
				return cfg.Position == ConfigWeaponPosition.ID_hand;
			}).ToList();

			for (var i = 0; i < handWeapons.Count; ++i) {
				var btn = handBtns [i];
				var weapon = handWeapons [i];
				var cfg = ConfigItem.Get(weapon.prototype);
				btn.GetComponentInChildren<Text> ().text = cfg.Name;
			}
			// 三個配件
			var a1Btn = btns.Where (btn => {
				return btn.gameObject.name == "btn_a1";
			}).FirstOrDefault();
			var a2Btn = btns.Where (btn => {
				return btn.gameObject.name == "btn_a2";
			}).FirstOrDefault();
			var a3Btn = btns.Where (btn => {
				return btn.gameObject.name == "btn_a3";
			}).FirstOrDefault();

			if (a1Btn == null) {
				throw new Exception ("xxx");
			}
			if (a2Btn == null) {
				throw new Exception ("xxx");
			}
			if (a3Btn == null) {
				throw new Exception ("xxx");
			}

			a1Btn.GetComponentInChildren<Text> ().text = "配件1";
			a2Btn.GetComponentInChildren<Text> ().text = "配件2";
			a3Btn.GetComponentInChildren<Text> ().text = "配件3";

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

		/// <summary>
		/// 顯示用的資料，在呼叫UpdateUI前要先設定
		/// </summary>
		IEnumerable<Item> data;
		public IEnumerable<Item> Data{
			set{
				data = value;
			}
			get{
				return data;
			}
		}

		/// <summary>
		/// 修改狀態列文字
		/// 指定顯示第currIndex個道具
		/// </summary>
		/// <param name="model">Model.</param>
		/// <param name="currIndex">Curr index.</param>
		public void CurrItemLabel(IModelGetter model, int currIndex){
			if (data == null) {
				Debug.LogWarning ("還沒有設定data");
				return;
			}
			if (currIndex <0 || currIndex >= data.Count ()) {
				txtCurrItem.text = "你沒有選擇任何道具";
				return;
			}
			var item = data.Skip (currIndex).First ();
			var cfg = ConfigItem.Get (item.prototype);
			txtCurrItem.text = string.Format ("你選擇{0}", cfg.Name);
		}

		public enum Mode{
			Normal, Equip
		}
		public Mode showMode;

		/// <summary>
		/// 列表文字顯示模式
		/// 當為Equip時會另外顯示裝備道具效果
		/// 在點擊到weapon時可以修改這個模式
		/// </summary>
		/// <value>The show mode.</value>
		public Mode ShowMode{
			set{
				showMode = value;
			}
		}

		/// <summary>
		/// 更新列表
		/// 注意要先設定Data
		/// </summary>
		/// <param name="model">Model.</param>
		public void UpdateDataView(IModelGetter model){
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
						if (cfg.Type == ConfigItemType.ID_weapon) {
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

		#region controller
		public IEnumerator HandleCommand(IModelGetter model, string msg, object args, Action<Exception> callback){
			switch (msg) {
			case "click_itemPopup_equip":
				{
					if (IsSelectNothing) {
						callback (new Exception ("你沒有選擇任何道具"));
						yield break;
					}
					// 防呆處理
					// 果為連續按裝備時道具會減少
					if (Data.Count() == 0) {
						callback (new Exception ("你沒有選擇任何道具"));
						yield break;
					}
					if (SelectIndex >= Data.Count ()) {
						ClearSelectIndex ();
						callback (new Exception ("你沒有選擇任何道具"));
						yield break;
					}
					var item = Data.ToList () [SelectIndex];
					Common.Common.Notify ("itemPopup_equip_item", item);
				}
				break;
			case "click_itemPopup_unequip":
				{
					if (HasLastPosition == false) {
						callback (new Exception ("你沒有選擇任何部位"));
						yield break;
					}
					var pos = "";
					var idx = 0;
					LastPosition(ref pos, ref idx);

					var item = model.MapPlayer.weapons.Where (i => {
						var cfg = ConfigItem.Get(i.prototype);
						return cfg.Position == pos;
					}).Skip(idx).FirstOrDefault();

					if (item.Equals (Item.Empty)) {
						callback (new Exception ("該部位沒有裝備"));
						yield break;
					}
					Common.Common.Notify ("itemPopup_unequip_item", item);
				}
				break;
			case "click_itemPopup_use":
				{
					if (IsSelectNothing) {
						callback (new Exception ("你沒有選擇任何道具"));
						yield break;
					}
					var item = Data.ToList () [SelectIndex];
					Common.Common.Notify ("itemPopup_use_item", item);
				}
				break;
			case "click_itemPopup_nouse":
				{
					if (IsSelectNothing) {
						callback (new Exception ("你沒有選擇任何道具"));
						yield break;
					}
					var item = Data.ToList () [SelectIndex];
					Common.Common.Notify ("itemPopup_sell_item", item);
				}
				break;
			case "click_itemPopup_normalMode":
				{
					var popup = this;
					// 重新顯示所有道具
					popup.Data = model.StorageInMap;
					popup.ShowMode = ItemPopup.Mode.Normal;
					popup.UpdateDataView (model);
				}
				break;
			case "click_itemPopup_head":
			case "click_itemPopup_body":
			case "click_itemPopup_foot":
			case "click_itemPopup_rightHand":
			case "click_itemPopup_leftHand":
			case "click_itemPopup_a1":
			case "click_itemPopup_a2":
			case "click_itemPopup_a3":
				{
					var popup = this;
					// 修改為武器顯示模式
					popup.ShowMode = ItemPopup.Mode.Equip;
					// 取得點擊部位
					var pos = "";
					var idx = 0;
					ParsePosition (msg, ref pos, ref idx);
					// 依部分過濾道具
					popup.Data = model.StorageInMap.Where (item => {
						var cfg = ConfigItem.Get(item.prototype);
						return cfg.Type == ConfigItemType.ID_weapon && cfg.Position == pos;
					});
					popup.Page = 0;
					// 修改列表內容
					popup.UpdateDataView (model);
					// 取消列表索引
					ClearSelectIndex ();
					// 更新狀態文字
					popup.CurrItemLabel (model, SelectIndex);
					// 記錄部位
					RecordLastPosition (msg);
				}
				break;
			case "click_itemPopup_item_0":
			case "click_itemPopup_item_1":
			case "click_itemPopup_item_2":
			case "click_itemPopup_item_3":
			case "click_itemPopup_item_4":
			case "click_itemPopup_item_5":
			case "click_itemPopup_item_6":
			case "click_itemPopup_item_7":
			case "click_itemPopup_item_8":
			case "click_itemPopup_item_9":
				{
					var popup = this;
					// 修改狀態文字
					var selectIdx = popup.CurrIndex (msg);
					popup.CurrItemLabel (model, selectIdx);
					// 修改列表內容
					var cfg = ConfigItem.Get (popup.Data.ToList() [selectIdx].prototype);
					popup.ShowMode = cfg.Type == ConfigItemType.ID_weapon ? ItemPopup.Mode.Equip : ItemPopup.Mode.Normal;
					popup.UpdateDataView (model);
					// 記錄最後一次點擊的索引
					RecordSelectIndex(selectIdx);
					// 取消部位
					ClearLastPositionCommand ();
				}
				break;
			case "click_itemPopup_pageup":
				{
					var popup = this;
					popup.Page -= 1;
					popup.UpdateDataView (model);
				}
				break;
			case "click_itemPopup_pagedown":
				{
					var popup = this;
					popup.Page += 1;
					popup.UpdateDataView (model);
				}
				break;
			}
			yield return null;
		}
		#endregion
		#region helper
		void ParsePosition(string cmd, ref string pos, ref int idx) {
			switch (cmd) {
			case "click_itemPopup_head":
				{
					pos = ConfigWeaponPosition.ID_head;
				}
				break;
			case "click_itemPopup_body":
				{
					pos = ConfigWeaponPosition.ID_body;
				}
				break;
			case "click_itemPopup_foot":
				{
					pos = ConfigWeaponPosition.ID_foot;
				}
				break;
			case "click_itemPopup_leftHand":
				{
					pos = ConfigWeaponPosition.ID_hand;
					idx = 0;
				}
				break;
			case "click_itemPopup_rightHand":
				{
					pos = ConfigWeaponPosition.ID_hand;
					idx = 1;
				}
				break;
			case "click_itemPopup_a1":
				{
					pos = ConfigWeaponPosition.ID_accessory;
					idx = 0;
				}
				break;
			case "click_itemPopup_a2":
				{
					pos = ConfigWeaponPosition.ID_accessory;
					idx = 1;
				}
				break;
			case "click_itemPopup_a3":
				{
					pos = ConfigWeaponPosition.ID_accessory;
					idx = 2;
				}
				break;
			default:
				throw new Exception ("xxxx");
			}
		}
		#endregion

		#region lastSelectIndex
		public int lastSelectItemIndex = -1;
		/// <summary>
		/// 取消列表索引，在點擊部位後呼叫，讓道具使用賣掉等功能失效
		/// </summary>
		public void ClearSelectIndex(){
			lastSelectItemIndex = -1;
		}

		/// <summary>
		/// 記錄最後一次點擊的索引
		/// </summary>
		/// <param name="idx">Index.</param>
		void RecordSelectIndex(int idx){
			lastSelectItemIndex = idx;
		}

		bool IsSelectNothing{
			get{
				return lastSelectItemIndex == -1;
			}
		}
		public int SelectIndex{
			get{
				return lastSelectItemIndex;
			}
		}
		#endregion

		#region lastPosition
		public string lastPositionCommand = "";
		/// <summary>
		/// 取消部位的選取
		/// 在點擊列表後呼叫，讓拆裝備失效
		/// </summary>
		public void ClearLastPositionCommand(){
			lastPositionCommand = "";
		}
		/// <summary>
		/// 記錄最後點擊的裝備部位，用來之後拆掉裝備
		/// </summary>
		/// <param name="cmd">Cmd.</param>
		public void RecordLastPosition(string cmd){
			lastPositionCommand = cmd;
		}
		public bool HasLastPosition {
			get {
				try{
					var pos = "";
					var idx = 0;
					LastPosition(ref pos, ref idx);
					return true;
				}catch(Exception){
					return false;
				}
			}
		}
		public void LastPosition(ref string pos, ref int idx) {
			ParsePosition (lastPositionCommand, ref pos, ref idx);
		}
		#endregion
	}
}

