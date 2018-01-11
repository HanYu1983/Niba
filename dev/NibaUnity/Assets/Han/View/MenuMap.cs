﻿using System;
using UnityEngine;
using Common;
using System.Collections;
using UnityEngine.UI;
using System.Linq;

namespace View
{
	public class MenuMap : MonoBehaviour
	{
		public GameObject gridLayout;
		public GameObject playerLayout;
		public GameObject[] workBtns;
		public Text txtInfo;

		GameObject[] grids;

		void Awake(){
			grids = new GameObject[100];
			var gridParent = gridLayout.transform.parent;
			for (var i = 0; i<grids.Length; ++i) {
				var go = Instantiate (gridLayout, gridParent, false);
				go.SetActive (true);
				grids [i] = go;
			}
		}

		public void UpdateUI(IModelGetter model){
			UpdateInfo (model);
			UpdateWork (model);
			UpdateMap (model);
		}

		public void UpdateInfo(IModelGetter model){
			var player = model.GetMapPlayer (Place.Map);
			var fight = model.PlayerFightAbility (Place.Map);
			txtInfo.text = string.Format ("hp:{0}/{1}", player.hp, (int)fight.hp);
		}

		public void UpdateWork(IModelGetter model){
			foreach (var btn in workBtns) {
				btn.SetActive (false);
			}
			var works = model.Works.ToList ();
			for (var i = 0; i < works.Count; ++i) {
				if (i >= workBtns.Length) {
					Debug.LogWarning ("工作按鈕不夠用，請增加");
					break;
				}
				var btn = workBtns [i];
				var w = works [i];
				var msg = "";
				switch (w.description) {
				case Description.WorkCollectResource:
					{
						var mapObjectId = int.Parse(w.values.Get("mapObjectId"));
						var mapObject = model.MapObjects[mapObjectId];
						var mapObjectInfo = model.ResourceInfos[mapObject.infoKey];
						var config = ConfigResource.Get(mapObjectInfo.type);
						msg = "采集[" + config.Name + "]";
					}
					break;
				case Description.WorkAttack:
					{
						var mapObjectId = int.Parse(w.values.Get("mapObjectId"));
						var mapObject = model.MapObjects[mapObjectId];
						var mapObjectInfo = model.MonsterInfos[mapObject.infoKey];
						var config = ConfigMonster.Get(mapObjectInfo.type);
						msg = "攻擊[" + config.Name + "]";
					}
					break;
				case Description.WorkSelectSkillForEnemy:
					{
						var mapObjectId = int.Parse(w.values.Get("mapObjectId")); 
						var mapObject = model.MapObjects[mapObjectId];
						var mapObjectInfo = model.MonsterInfos[mapObject.infoKey];
						var config = ConfigMonster.Get(mapObjectInfo.type);
						var skillIds = w.values.GetValues ("skillIds");
						msg = "選擇招式攻擊[" + config.Name + "]";
					}
					break;
				case Description.WorkUseSkillForEnemyAll:
					{
						var skillId = w.values.Get ("skillId");
						var cfg = ConfigSkill.Get (skillId);
						msg = string.Format ("使用{0}攻擊符合條件的目標", cfg.Name);
					}
					break;
				default:
					throw new NotImplementedException (w.description);
				}
				btn.GetComponentInChildren<Text> ().text = msg;
				btn.SetActive (true);
			}
		}

		public void UpdateMap(IModelGetter model){
			SetTileWithPlayerPositionCenterExpend (model);
		}

		void SetTileWithPlayerPositionCenterExpend(IModelGetter model){

			var gridParent = gridLayout.transform.parent;
			for (var i = 0; i<grids.Length; ++i) {
				grids [i].GetComponent<Text> ().text = "*";
			}

			MapObject[,] mapObjs;
			//var leftTop = model.MapPlayer.position.Add (-5, -5).Max (0, 0);
			//var rightBottom = leftTop.Add(10, 10).Min(model.MapWidth, model.MapHeight);
			var leftTop = model.GetMapPlayer(Place.Map).position.Add (-5, -5);
			var rightBottom = leftTop.Add(10, 10);
			Common.Common.FlattenMapObjects(model, MapObjectType.Resource, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var idx = y * 10 + x;
					var txt = grids [idx].GetComponent<Text> ();
					var mapObj = mapObjs[x,y];
					if (mapObj.position.Equals (model.GetMapPlayer(Place.Map).position)) {
						playerLayout.transform.SetParent (txt.transform, false);
					}
					if(mapObj.type == MapObjectType.Unknown){
						txt.text = "*";
						continue;
					}
					var info = model.ResourceInfos [mapObj.infoKey];
					var cfg = ConfigResource.Get (info.type);
					var name = cfg.Name;

					txt.text = name;
				}
			}

			Common.Common.FlattenMapObjects(model, MapObjectType.Monster, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var mapObj = mapObjs[x,y];
					if(mapObj.type == MapObjectType.Unknown){
						continue;
					}

				}
			}
		}
	}
}

