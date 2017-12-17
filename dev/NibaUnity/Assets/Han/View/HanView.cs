using System;
using UnityEngine;
using Common;
using System.Collections.Generic;
using System.Collections;
using System.Linq;

namespace View
{
	public class HanView : MonoBehaviour, IView
	{
		public ZUIManager mgr;
		public Menu menuHome, menuMap;
		public SideMenu menuInfo;
		public Popup msgPopup, itemPopup;

		IModelGetter model;
		public IModelGetter ModelGetter{ set{ model = value; } }
		public IEnumerator ChangePage(Page page, Action<Exception> callback){
			switch (page) {
			case Page.Title:
				mgr.OpenMenu (menuHome);
				callback (null);
				break;
			case Page.Game:
				mgr.OpenMenu (menuMap);
				callback (null);
				break;
			}
			yield return null;
		}
		public IEnumerator ShowInfo(Info info, Action<Exception> callback){
			switch (info) {
			case Info.ItemInMap:
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Data = model.StorageInMap;
					popup.UpdateUI (model);

					mgr.OpenPopup (itemPopup);
					callback (null);
					break;
				}
			case Info.Map:
				{
					var map = mgr.CurActiveMenu.GetComponent<MenuMap> ();
					if (map == null) {
						throw new Exception ("xxxx");
					}
					yield return map.UpdateMap (model);
					yield return map.UpdateWork (model);
					callback (null);
				}
				break;
			case Info.Work:
				{
					var map = mgr.CurActiveMenu.GetComponent<MenuMap> ();
					if (map == null) {
						throw new Exception ("xxxx");
					}
					yield return map.UpdateWork (model);
					callback (null);
				}
				break;
			case Info.WorkResult:
				{
					var results = model.WorkResults;
					var msg = string.Join("\n", results.Select (e => {
						Debug.LogWarning(e.description);
						switch (e.description) {
						case Description.EventLucklyFind:
							{
								var itemPrototype = e.values.Get("itemPrototype");
								var count = int.Parse(e.values.Get("count"));
								var config = ConfigItem.Get (itemPrototype);
								return "獲得item:" + config.Name + " 數量:" + count;
							}
						case Description.InfoAttack:
							{
								var mapObjectId = int.Parse (e.values.Get ("mapObjectId"));
								var mapObj = model.MapObjects [mapObjectId];
								var objInfo = model.MonsterInfos [mapObj.infoKey];
								var objCfg = ConfigMonster.Get (objInfo.type);
								var damage = int.Parse (e.values.Get ("damage"));
								return string.Format ("你攻擊{0}造成{1}傷害", objCfg.Name, damage);
							}
						case Description.InfoMonsterAttack:
							{
								var mapObjectId = int.Parse (e.values.Get ("mapObjectId"));
								var mapObj = model.MapObjects [mapObjectId];
								var objInfo = model.MonsterInfos [mapObj.infoKey];
								var objCfg = ConfigMonster.Get (objInfo.type);
								var damage = int.Parse (e.values.Get ("damage"));
								return string.Format ("{0}對你造成{1}傷害", objCfg.Name, damage);
							}
						default:
							throw new NotImplementedException();	
						}
					}).ToArray ());
					var popup = msgPopup.GetComponent<MessagePopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Message = msg;

					mgr.OpenPopup (msgPopup);
					callback (null);
				}
				break;
			case Info.Ability:
				{
					var popup = msgPopup.GetComponent<MessagePopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Message = model.PlayerFightAbility (model.MapPlayer).ToString();
					mgr.OpenPopup (msgPopup);
					callback (null);
				}
				break;
			case Info.Event:
				{
					var results = model.MoveResult;
					if (results.HasEvent == false) {
						yield break;
					}
					var msg = string.Join ("\n", results.events.Select (evt => {
						switch(evt.description){
						case Description.EventLucklyFind:
							{
								var itemPrototype = evt.values.Get("itemPrototype");
								var cnt = int.Parse(evt.values.Get("count"));
								var cfg = ConfigItem.Get(itemPrototype);
								return string.Format("你好運地發現了{0}{1}個", cfg.Name, cnt);
							}
						default:
							throw new NotImplementedException("沒實作的事件:"+evt.description);
						}
					}).ToArray ());
					var popup = msgPopup.GetComponent<MessagePopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Message = msg;
					mgr.OpenPopup (msgPopup);
					callback (null);
				}
				break;
			default:
				throw new NotImplementedException ("info:"+info.ToString());
			}
			yield return null;
		}

		public void HideInfo(Info page){
			switch (page)
			{
			case Info.Map:
			case Info.Work:
				{
					// nothing to do
				}
				break;
			case Info.Event:
				{
					mgr.ClosePopup (msgPopup);
				}
				break;
			case Info.ItemInMap:
				{
					mgr.ClosePopup (itemPopup);
				}
				break;
			case Info.WorkResult:
				{
					mgr.ClosePopup (msgPopup);
				}
				break;
			case Info.Ability:
				{
					mgr.ClosePopup (msgPopup);
				}
				break;
			default:
				throw new NotImplementedException ();
			}
		}

		public int lastSelectItemIndex;

		public IEnumerator HandleCommand(string msg, object args){
			switch (msg) {
			case "click_itemPopup_use":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					var item = popup.Data.ToList () [lastSelectItemIndex];
					var cfg = ConfigItem.Get (item.prototype);
					if (cfg.Type == "weapon") {
						Common.Common.Notify ("hanview_equip_item", item);
					} else {
						Common.Common.Notify ("hanview_use_item", item);
					}
				}
				break;
			case "click_itemPopup_nouse":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					var item = popup.Data.ToList () [lastSelectItemIndex];
					var cfg = ConfigItem.Get (item.prototype);
					if (cfg.Type == "weapon") {
						Common.Common.Notify ("hanview_unequip_item", item);
					} else {
						Common.Common.Notify ("hanview_sell_item", item);
					}
				}
				break;
			case "click_itemPopup_normalMode":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Data = model.StorageInMap;
					popup.ShowMode = ItemPopup.Mode.Normal;
					popup.UpdateUI (model);
				}
				break;
			case "click_itemPopup_leftHand":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Data = model.StorageInMap.Where (item => {
						var cfg = ConfigItem.Get(item.prototype);
						return cfg.Type == "weapon" && cfg.Position == ConfigWeaponPosition.ID_hand;
					});
					popup.ShowMode = ItemPopup.Mode.Equip;
					popup.UpdateUI (model);
				}
				break;
			case "click_itemPopup_head":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Data = model.StorageInMap.Where (item => {
						var cfg = ConfigItem.Get(item.prototype);
						return cfg.Type == "weapon" && cfg.Position == ConfigWeaponPosition.ID_head;
					});
					popup.UpdateUI (model);
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
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					var selectIdx = popup.CurrIndex (msg);
					popup.CurrItemLabel (model, selectIdx);

					var cfg = ConfigItem.Get (popup.Data.ToList() [selectIdx].prototype);
					popup.ShowMode = cfg.Type == "weapon" ? ItemPopup.Mode.Equip : ItemPopup.Mode.Normal;
					popup.UpdateUI (model);

					lastSelectItemIndex = selectIdx;

					//Common.Common.Notify ("click_itemPopup_item_modelIndex", selectIdx);
				}
				break;
			case "click_itemPopup_pageup":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Page -= 1;
					popup.UpdateUI (model);
				}
				break;
			case "click_itemPopup_pagedown":
				{
					var popup = itemPopup.GetComponent<ItemPopup> ();
					if (popup == null) {
						throw new Exception ("xxxx");
					}
					popup.Page += 1;
					popup.UpdateUI (model);
				}
				break;
			}
			yield return null;
		}

	}
}

