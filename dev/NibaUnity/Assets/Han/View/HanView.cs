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
			}
			yield return null;
		}
		public void HideInfo(Info page){

		}
	}
}

