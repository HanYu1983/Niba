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

		void Awake(){
			view = hanView;
			model = defaultModel;
			view.ModelGetter = model;
		}

		void Start(){
			Common.OnEvent += Common_OnEvent;
			StartCoroutine (view.ChangePage (Page.Title, e => {
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
			case "click_title_newgame":
				{
					model.NewGame ();
					yield return view.ChangePage (Page.Home, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
					// 自動領取任務
					foreach (var m in model.AvailableNpcMissions) {
						model.AcceptMission (m);
					}
				}
				break;
			case "click_title_load":
				{
					if (model.LoadGame () == false) {
						HandleException (new Exception ("你沒有存檔"));
						yield break;
					}
					var nextPage = model.PlayState == PlayState.Play ?
						Page.Game : Page.Home;
					yield return view.ChangePage (nextPage, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
					if (nextPage == Page.Game) {
						yield return view.ShowInfo(Info.Map, e2=>{
							e = e2;
						});
						if (e != null) {
							HandleException (e);
							yield break;
						}
					}
				}
				break;
			case "fusionRequireView_ok":
				{
					var info = (object[])args;
					var fusionTarget = (Item)info [0];
					var who = (Place)info [1];
					try{
						model.Fusion (fusionTarget, who);
					}catch(Exception e2){
						HandleException(e2);
						yield break;
					}
				}
				break;
			case "itemPopup_move_item":
				{
					var info = (object[])args;
					var item = (Item)info [0];
					//var whosWeapon = (MapPlayer)info [1];
					var whosStorage = (Place)info [2];
					// 如果現在是家裡箱子，就移動到口袋
					// 反之就相反
					var toStorage = whosStorage == Place.Pocket ?
						Place.Home : Place.Pocket;
					try{
						model.MoveItem(whosStorage, toStorage, item);
					}catch(Exception e2){
						HandleException(e2);
						yield break;
					}
					var returnTo = 
						whosStorage == Place.Map ? Info.Item :
						whosStorage == Place.Pocket ? Info.ItemInHomePocket :
						Info.ItemInHome;
					yield return view.ShowInfo (returnTo, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
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
					var whosWeapon = (Place)info [1];
					var whosStorage = (Place)info [2];
					try{
						model.EquipWeapon (weapon, whosWeapon, whosStorage);
					}catch(Exception e2){
						HandleException (e2);
						yield break;
					}
					var returnTo = 
						whosStorage == Place.Map ? Info.Item :
						whosStorage == Place.Pocket ? Info.ItemInHomePocket :
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
					var whosWeapon = (Place)info [1];
					var whosStorage = (Place)info [2];
					try{
						model.UnequipWeapon (weapon, whosWeapon, whosStorage);
					}catch(Exception e2){
						HandleException (e2);
						yield break;
					}
					var returnTo = 
						whosStorage == Place.Home ? Info.ItemInHome :
						whosStorage == Place.Pocket ? Info.ItemInHomePocket :
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
			case "missionPopup_completeMission":
				{
					if (model.PlayState != PlayState.Home) {
						HandleException (new Exception ("在家裡才能完成任務"));
						yield break;
					}
					var id = (string)args;
					try{
						var rewards = model.CompleteMission (id);
						view.Alert(string.Join(",", rewards.Select(i=>i.ToString()).ToArray()));
					}catch(Exception e2){
						e = e2;
					}
					if (e != null) {
						HandleException (e);
						yield break;
					}
					yield return view.ShowInfo (Info.Mission, e2 => {
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
					// 創新地圖
					yield return model.NewMap (MapType.Unknown, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
					// 再進入
					model.EnterMap ();
					yield return view.ChangePage (Page.Game, e2 => {
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
			case "click_home_mission":
				{
					yield return view.ShowInfo (Info.Mission, e2 => {
						e = e2;
					});
					if (e != null) {
						HandleException (e);
						yield break;
					}
				}
				break;
			case "click_home_skill":
				{
					yield return view.ShowInfo (Info.Skill, e2 => {
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
					model.ExitMap ();
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
					var missionOK = model.CheckMissionStatus ();
					if (missionOK.Count > 0) {
						view.Alert ("mission ok");
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
	}
}

