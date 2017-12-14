using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameView;
using Common;
using System.Linq;

namespace Model
{
	public class ModelViewTest : MonoBehaviour
	{
		public HandleDebug debug;
		public SimpleView gameView;

		void Start ()
		{
			View.ModelGetter = Model;
			StartCoroutine (TestAll());
		}

		IModel Model {
			get {
				var model = GetComponent<Model> ();
				if (model == null) {
					throw new UnityException ("model not found");
				}
				return model;
			}
		}

		IView View {
			get {
				if (gameView == null) {
					throw new UnityException ("view not found");
				}
				return gameView;
			}
		}

		IEnumerator TestAll(){
			yield return TestWeapon (Model, View);
			yield return TestFight (Model, View);
			yield return TestFusion (Model, View);
			yield return TestMap (Model, View);
			yield return TestShowInfo (Model, View);
		}

		static IEnumerator TestWeapon(IModel model, IView view){
			Exception e = null;

			var fight = model.PlayerFightAbility(model.MapPlayer);
			Debug.Log (fight);

			var weapon = Common.Item.Empty;
			weapon.prototype = ConfigItem.ID_woodSword;
			weapon.count = 1;

			model.AddItemToStorage (weapon, model.MapPlayer);
			model.EquipWeapon (weapon, model.MapPlayer);
			try{
				model.EquipWeapon (weapon, model.MapPlayer);
			}catch(Exception e2){
				if (e2.Message.IndexOf ("無法裝備，請檢查:沒有那個道具") == -1) {
					throw new Exception ("裝備沒有的裝備必須丟出例外");
				}
			}
			model.AddItemToStorage (weapon, model.MapPlayer);
			model.EquipWeapon (weapon, model.MapPlayer);
			try{
				model.AddItemToStorage (weapon, model.MapPlayer);
				model.EquipWeapon (weapon, model.MapPlayer);
			}catch(Exception e2){
				if (e2.Message.IndexOf ("無法裝備，請檢查:那個位置已經滿") == -1) {
					throw new Exception ("裝備超過最大數量限制必須丟出例外");
				}
			}
			weapon.prototype = ConfigItem.ID_powerRing;
			model.AddItemToStorage (weapon, model.MapPlayer);
			model.EquipWeapon (weapon, model.MapPlayer);

			fight = model.PlayerFightAbility(model.MapPlayer);
			Debug.Log (fight);
			yield return view.ShowInfo (Info.Ability, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return null;
		}

		static IEnumerator TestFight(IModel model, IView view){
			UnityEngine.Random.InitState (1);
			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ShowInfo (Info.Map, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			model.MoveRight ();
			yield return view.ShowInfo (Info.Map, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ShowInfo (Info.Ability, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);
			view.HideInfo (Info.Ability);

			yield return view.ShowInfo (Info.Work, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);

			var atkWork = model.Works.Where (w => {
				return w.description == Description.WorkAttack;
			}).FirstOrDefault ();
			if(atkWork.Equals(Description.Empty)){
				throw new Exception ("必須要有敵人可攻擊");
			}
			model.StartWork (atkWork);
			model.ApplyWork ();

			foreach (var result in model.WorkResults) {
				Debug.Log (result.description);
			}
			yield return view.ShowInfo (Info.WorkResult, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);
			view.HideInfo (Info.WorkResult);
		}

		static IEnumerator TestFusion(IModel model, IView view){
			UnityEngine.Random.InitState (1);

			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			var item = Common.Item.Empty;
			item.prototype = ConfigItem.ID_feather;
			item.count = 5;
			model.AddItemToStorage (item, model.MapPlayer);

			item.prototype = ConfigItem.ID_wood;
			item.count = 5;
			model.AddItemToStorage (item, model.MapPlayer);

			var canFusionArrows = model.IsCanFusion (ConfigItem.ID_arrows, model.MapPlayer);
			if (canFusionArrows == true) {
				throw new Exception ("少一個項目不能合成箭矢");
			}

			item.prototype = ConfigItem.ID_gravel;
			item.count = 5;
			model.AddItemToStorage (item, model.MapPlayer);

			foreach(var i in model.StorageInMap){
				Debug.Log (i);
			}
			yield return view.ShowInfo (Info.ItemInMap, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);
			canFusionArrows = model.IsCanFusion (ConfigItem.ID_arrows, model.MapPlayer);
			if (canFusionArrows == false) {
				throw new Exception ("必須能合成箭矢");
			}

			view.HideInfo (Info.ItemInMap);
			yield return new WaitForSeconds (2f);

			model.Fusion (ConfigItem.ID_arrows, model.MapPlayer);
			model.Fusion (ConfigItem.ID_arrows, model.MapPlayer);
			foreach(var i in model.StorageInMap){
				Debug.Log (i);
			}
			var arrows = model.StorageInMap.Where(it=>{
				return it.prototype == ConfigItem.ID_arrows;
			}).FirstOrDefault();
			if (arrows.Equals (Common.Item.Empty)) {
				throw new Exception ("必須有箭矢");
			}
			if (arrows.count != 2) {
				throw new Exception ("箭矢必須有2個");
			}
			yield return view.ShowInfo (Info.ItemInMap, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);
			view.HideInfo (Info.ItemInMap);
		}

		static IEnumerator TestShowInfo(IModel model, IView view){
			UnityEngine.Random.InitState (1);

			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			view.ShowInfo (Info.Work, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);

			model.MoveRight ();
			var result = model.MoveResult;
			if(result.isMoveSuccess){
				yield return view.ShowInfo (Info.Map, e2 => {
					e = e2;
				});
				if (e != null) {
					throw e;
				}
				if (result.HasEvent) {
					yield return view.ShowInfo (Info.Event, e2 => {
						e = e2;
					});
					if (e != null) {
						throw e;
					}
					yield return new WaitForSeconds (2f);
					view.HideInfo (Info.Event);
					yield return new WaitForSeconds (2f);
				}
			}
			model.ClearMoveResult();

			yield return view.ShowInfo (Info.Work, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);
			view.HideInfo (Info.Work);
			yield return new WaitForSeconds (2f);

			yield return view.ShowInfo (Info.Ability, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
		}

		static IEnumerator TestMap(IModel model, IView view){
			UnityEngine.Random.InitState (1);

			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			Debug.Log ("向右移20步");
			for (var i = 0; i < 20; ++i) {
				model.MoveRight ();
				var result = model.MoveResult;
				if(result.isMoveSuccess){
					yield return view.ShowInfo (Info.Map, e2 => {
						e = e2;
					});
					if (e != null) {
						throw e;
					}
				}
				model.ClearMoveResult();
				yield return new WaitForSeconds (0f);
			}
			Debug.Log ("向下移20步");
			for (var i = 0; i < 20; ++i) {
				model.MoveDown ();
				var result = model.MoveResult;
				if(result.isMoveSuccess){
					yield return view.ShowInfo (Info.Map, e2 => {
						e = e2;
					});
					if (e != null) {
						throw e;
					}
				}
				model.ClearMoveResult();
				yield return new WaitForSeconds (0f);
			}
			Debug.Log ("目前位置:" + model.MapPlayer.position);
			var objs = model.MapObjectsAt (model.MapPlayer.position);
			foreach (var obj in objs) {
				Debug.Log ("有物件:" + obj.type);
			}
			var works = model.Works;
			Debug.Log ("取得目前工作數量:" + works.Count ());
			if (works.Count () > 0) {
				if (model.MapPlayer.IsWorking) {
					throw new Exception ("現在必須沒有工作在身");
				}

				var firstWork = works.First ();
				Debug.Log ("開始第一件工作，工作為:"+firstWork.description);
				model.StartWork (firstWork);

				if (model.MapPlayer.IsWorking == false) {
					throw new Exception ("現在必須有工作在身");
				}
				var finishedTime = new DateTime (model.MapPlayer.workFinishedTime);
				Debug.Log ("工作結束時間為:"+finishedTime);

				model.ApplyWork ();

				switch (firstWork.description) {
				case Description.WorkCollectResource:
					{
						var collectTargetId = int.Parse (firstWork.values.Get ("mapObjectId"));
						var target = model.MapObjects [collectTargetId];
						var targetInfo = model.ResourceInfos [target.infoKey];
						Debug.Log ("采集"+targetInfo.type+"結束");
						if (target.died == false) {
							throw new Exception ("采集完的物件必須死亡");
						}
						yield return view.ShowInfo (Info.Map, e2 => {
							e = e2;
						});
						if (e != null) {
							throw e;
						}
						foreach (var item in model.StorageInMap) {
							Debug.Log ("擁有" + item.prototype +"/"+item.count);
						}
						yield return view.ShowInfo (Info.ItemInMap, e2 => {
							e = e2;
						});
						if (e != null) {
							throw e;
						}
						yield return new WaitForSeconds (2);
						view.HideInfo(Info.Map);
					}
					break;
				case Description.WorkAttack:
					break;
				}
			}
			Debug.Log ("上移1格");
			model.MoveUp ();
			yield return view.ShowInfo (Info.Map, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			model.ClearMoveResult();

			Debug.Log ("直接完成第1個工作");
			model.StartWork (model.Works.First());
			model.ApplyWork ();
			yield return view.ShowInfo (Info.Map, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
		}
	}
}

