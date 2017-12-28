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

			StartCoroutine (view.ChangePage (Page.Home, e => {
				if (e != null) {
					HandleException (e);
				}
			}));

			/*Item item;
			item.count = 1;
			for (var i = 0; i < ConfigItem.ID_COUNT; ++i) {
				item.prototype = ConfigItem.Get (i).ID;
				model.AddItemToStorage (item, model.MapPlayer);
			}*/
		}

		void HandleException(Exception e){
			view.Alert (e.Message);
			Debug.LogError (e.Message);
			handleCommandCoroutine = null;
		}

		Coroutine handleCommandCoroutine;

		void Common_OnEvent (string msg, object args)
		{
			if (handleCommandCoroutine != null) {
				Debug.LogWarning ("上一次的動畫處理還沒完成:"+msg);
				return;
			}
			handleCommandCoroutine = StartCoroutine (HandleCommand (msg, args));
		}

		IEnumerator HandleCommand(string msg, object args){
			Debug.Log ("[Controller]:"+msg);
			Exception e = null;
			switch (msg) {
			case "fusionRequireView_ok":
				{
					var info = (object[])args;
					var fusionTarget = (Item)info [0];
					var who = (MapPlayer)info [1];
					try{
						model.Fusion (fusionTarget, who);
					}catch(Exception e2){
						HandleException(e2);
						yield break;
					}
				}
				break;
			case "itemPopup_use_item":
				{
				}
				break;
			case "itemPopup_equip_item":
				{
					var info = (object[])args;
					var weapon = (Item)info [0];
					var whosWeapon = (MapPlayer)info [1];
					var whosStorage = (MapPlayer)info [2];
					try{
						model.EquipWeapon (weapon, whosWeapon, whosStorage);
					}catch(Exception e2){
						HandleException (e2);
						yield break;
					}
					var returnTo = 
						whosStorage.Equals (MapPlayer.PlayerInMap) ? Info.Item :
						whosStorage.Equals (MapPlayer.PlayerInHome) ? Info.ItemInHomePocket :
						Info.ItemInHome;
					yield return view.ShowInfo (returnTo, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
					yield return view.HandleCommand (msg, args, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "itemPopup_unequip_item":
				{
					var info = (object[])args;
					var weapon = (Item)info [0];
					var whosWeapon = (MapPlayer)info [1];
					var whosStorage = (MapPlayer)info [2];
					try{
						model.UnequipWeapon (weapon, whosWeapon, whosStorage);
					}catch(Exception e2){
						HandleException (e2);
						yield break;
					}
					var returnTo = 
						whosStorage.Equals (MapPlayer.UnknowPlayer) ? Info.ItemInHome :
						whosStorage.Equals (MapPlayer.PlayerInHome) ? Info.ItemInHomePocket :
						Info.Item;
					yield return view.ShowInfo (returnTo, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
					yield return view.HandleCommand (msg, args, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_home_map":
				{
					yield return OpenMap ();
				}
				break;
			case "click_home_item":
				{
					yield return view.ShowInfo (Info.ItemInHome, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_home_pocket":
				{
					yield return view.ShowInfo (Info.ItemInHomePocket, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_home_fusion":
				{
					yield return view.ShowInfo (Info.FusionInHome, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_map_home":
				{
					yield return view.ChangePage (Page.Home, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_map_fusion":
				{
					yield return view.ShowInfo(Info.Fusion, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
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
					yield return view.ShowInfo (Info.Item, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_map_ability":
				{
					yield return view.ShowInfo (Info.Ability, e2 => {
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
			default:
				yield return view.HandleCommand (msg, args, e2=>{
					e = e2;
				});
				if (e != null) {
					HandleException (e);
					yield break;
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

