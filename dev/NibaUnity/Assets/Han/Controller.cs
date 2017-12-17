using System;
using UnityEngine;
using View;
using Model;
using System.Collections;
using System.Linq;

namespace Common
{
	public class Controller : MonoBehaviour
	{
		public HanView hanView;
		public Model.Model defaultModel;

		public IView view;
		public IModel model;

		void Start(){
			Common.OnEvent += Common_OnEvent;
			view = hanView;
			model = defaultModel;

			view.ModelGetter = model;
		}

		void HandleException(Exception e){
			Debug.LogError (e.Message);
		}

		Coroutine handleCommandCoroutine;

		void Common_OnEvent (string msg, object args)
		{
			if (handleCommandCoroutine != null) {
				Debug.LogWarning ("上一次的動畫處理還沒完成");
				return;
			}
			handleCommandCoroutine = StartCoroutine (HandleCommand (msg, args));
		}

		IEnumerator HandleCommand(string msg, object args){
			Debug.Log ("[Controller]:"+msg);
			Exception e = null;
			switch (msg) {
			case "hanview_use_item":
				{
				}
				break;
			case "hanview_equip_item":
				{
					var weapon = (Item)args;
					var err = model.EquipWeapon (weapon, model.MapPlayer);
					if (err != null) {
						HandleException (new Exception (err));
						yield break;
					}
					yield return view.ShowInfo (Info.ItemInMap, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_itemPopup_use":
			case "click_itemPopup_nouse":
			case "click_itemPopup_normalMode":
			case "click_itemPopup_head":
			case "click_itemPopup_leftHand":
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
			case "click_itemPopup_pageup":
			case "click_itemPopup_pagedown":
				yield return view.HandleCommand (msg, args);
				break;
			case "click_home_map":
				{
					yield return OpenMap ();
				}
				break;
			case "click_map_down":
			case "click_map_left":
			case "click_map_right":
			case "click_map_up":
				{
					if (msg == "click_map_down") {
						model.MoveDown ();
					}
					if (msg == "click_map_left") {
						model.MoveLeft ();
					}
					if (msg == "click_map_right") {
						model.MoveRight ();
					}
					if (msg == "click_map_up") {
						model.MoveUp ();
					}
					yield return HandleAfterMove ();
				}
				break;
			case "click_map_item":
				{
					yield return view.ShowInfo (Info.ItemInMap, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_map_work_0":
			case "click_map_work_1":
			case "click_map_work_2":
			case "click_map_work_3":
			case "click_map_work_4":
			case "click_map_work_5":
			case "click_map_work_6":
				{
					var idx = int.Parse(msg.Replace ("click_map_work_", ""));
					var selectWork = model.Works.ToList () [idx];
					model.StartWork (selectWork);
					model.ApplyWork ();
					yield return view.ShowInfo (Info.WorkResult, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
					yield return view.ShowInfo(Info.Map, e2=>{
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			}
			handleCommandCoroutine = null;
		}

		IEnumerator HandleAfterMove(){
			Exception e = null;
			var result = model.MoveResult;
			if (result.isMoveSuccess) {
				yield return view.ShowInfo(Info.Map, e2=>{
					e = e2;
				});
				if (e != null) {
					HandleException (e);
					yield break;
				}
				if (result.HasEvent) {
					yield return view.ShowInfo(Info.Event, e2=>{
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
			}
			model.ApplyMoveResult();
			model.ClearMoveResult ();
		}

		IEnumerator OpenMap(){
			Exception e = null;
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				HandleException (e);
				yield break;
			}
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				HandleException (e);
				yield break;
			}
			yield return view.ShowInfo(Info.Map, e2=>{
				e = e2;
			});
			if (e != null) {
				HandleException (e);
				yield break;
			}
		}
	}
}

