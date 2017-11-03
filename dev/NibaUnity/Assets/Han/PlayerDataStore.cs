﻿using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System.Linq;
using Common;

namespace Model
{
	// 地圖的部分另外存，因為資料量比較大
	// 所以把比較長變動的資料移到PlayerDataStore
	[Serializable]
	public class MapDataStore{
		#region map
		// Dictionary無法Serializable
		public List<MapObject> mapObjects = new List<MapObject>();
		public List<ResourceInfo> resourceInfo = new List<ResourceInfo>();
		public List<MonsterInfo> monsterInfo = new List<MonsterInfo>();
		public int width, height;
		public void GenMap(MapType type, int w, int h){
			ClearMap ();

			width = w;
			height = h;
			for (var y = 0; y < h; ++y) {
				for (var x = 0; x < w; ++x) {
					var p = Mathf.PerlinNoise (x/(float)w, y/(float)h);
					//Debug.Log (p);
					if (p < 0.8f) {
						var key = GenObject (MapObjectType.Resource, null);
						var obj = mapObjects [key];
						// change position
						Position pos;
						pos.x = x;
						pos.y = y;
						obj.position = pos;
						// assign back
						mapObjects [key] = obj;

						// change type
						var info = resourceInfo [mapObjects [key].infoKey];
						if (p < 0.3f) {
							info.type = ConfigResource.ID_stone;
						} else if (p < 0.8f) {
							info.type = ConfigResource.ID_grass;
						}
						// assign back
						resourceInfo [mapObjects [key].infoKey] = info;

						// gen monster after assign item
						if (UnityEngine.Random.Range (0, 100) < 25) {
							if (obj.type == MapObjectType.Resource) {
								var monsterKey = GenMonster (key, false);
								var monster = mapObjects [monsterKey];
								// change position
								monster.position = pos;
								// assign back
								mapObjects [monsterKey] = monster;
							}
						}
					} else {
						// ignore
					}
				}
			}
		}
		public void ClearMap(){
			mapObjects.Clear ();
			resourceInfo.Clear ();
			monsterInfo.Clear ();
			width = height = 0;
		}
		public int GenObject(MapObjectType type, string strKey){
			if (strKey != null) {
				if(FindObject (strKey).Equals(MapObject.Empty) == false){
					throw new UnityException ("item already exists!"+strKey);
				}
			}
			MapObject item = MapObject.Empty;
			item.type = type;
			if (strKey != null) {
				item.strKey = strKey;
			}
			switch (item.type) {
			case MapObjectType.Resource:
				item.infoKey = resourceInfo.Count;
				resourceInfo.Add (ResourceInfo.Empty);
				break;
			case MapObjectType.Monster:
				item.infoKey = monsterInfo.Count;
				monsterInfo.Add (MonsterInfo.Empty);
				break;
			}
			// 先取得數字鍵
			item.key = mapObjects.Count;
			// 再加入到串列
			mapObjects.Add (item);
			return item.key;
		}
		public int GenMonster(int objKey, bool assignMonsterType, string monsterType = ""){
			var obj = mapObjects [objKey];
			var resInfo = resourceInfo [obj.infoKey];
			if (resInfo.type == "") {
				throw new UnityException ("resourceType type not defined. with object key:"+objKey);
			}
			var m1Key = GenObject (MapObjectType.Monster, null);
			var m1Object = mapObjects [m1Key];
			var m1Info = monsterInfo [m1Object.infoKey];
			m1Info.habitats = resInfo.type;
			if (assignMonsterType) {
				m1Info.type = monsterType;
			} else {
				// TODO
				m1Info.type = ConfigMonster.ID_snack;
			}
			// assign back
			monsterInfo [m1Object.infoKey] = m1Info;
			return m1Key;
		}
		public List<Item> Collect(PlayerDataStore player, int objKey){
			var ret = new List<Item> ();
			var obj = mapObjects [objKey];
			if (obj.died == true) {
				throw new MessageException ("不能採集已消除的物件:"+objKey);
			}
			if (obj.type != MapObjectType.Resource) {
				throw new MessageException ("非資源不得採集:"+obj.type);
			}
			obj.died = true;
			// assign back
			mapObjects [objKey] = obj;
			foreach (var item in ret) {
				player.AddItem (item);
			}
			return ret;
		}
		public MapObject FindObject(string strKey){
			return mapObjects.Find (item => {
				return item.strKey == strKey;
			});
		}
		public IEnumerable<MapObject> FindObjects(Position pos){
			return mapObjects.Where (item => {
				return item.position.Equals(pos);
			});
		}
		#endregion

		#region event
		public IEnumerable<Description> GenEvent(PlayerDataStore player, Position pos){
			var objs = FindObjects (pos);
			return objs.Aggregate(
				new List<Description>(),
				(accu, obj)=>{
					switch(obj.type){
					case MapObjectType.Resource:
						{
							var des = Description.Empty;
							des.description = Description.EventLucklyFind;
							des.values = new NameValueCollection();
							des.values.Add("itemPrototype", 1+"");
							des.values.Add("count", 2+"");
							accu.Add(des);
						}
						break;
					case MapObjectType.Monster:
						break;
					}
					return accu;
				}
			);
		}
		#endregion

		#region works
		public void StartWork(PlayerDataStore player, Description work){
			if (player.playerInMap.IsWorking) {
				throw new MessageException ("目前有工作在身:"+work.description);
			}
			player.playerInMap.currentWork = work;
			player.playerInMap.workFinishedTime = DateTime.Now.Add (TimeSpan.FromSeconds (5)).Ticks;
		}

		public void CancelWork(PlayerDataStore player){
			if (player.playerInMap.IsWorking == false) {
				Debug.LogWarning ("沒有工作，不必取消");
				return;
			}
			player.playerInMap.workFinishedTime = DateTime.Now.Ticks;
		}

		public List<Description> ApplyWork(PlayerDataStore player){
			if (player.playerInMap.IsWorking == false) {
				throw new MessageException ("沒有工作，不能應用");
			}
			player.playerInMap.workFinishedTime = 0;

			var work = player.playerInMap.currentWork;
			switch (work.description) {
			case Description.WorkCollectResource:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var obj = mapObjects [mapObjectId];
					obj.died = true;
					mapObjects [mapObjectId] = obj;
					var item = Item.Empty;
					item.prototype = 1;
					item.count = 1;
					player.AddItem (item);
				}
				break;
			}
			return null;
		}

		public IEnumerable<Description> GetWorks(PlayerDataStore player){
			return FindObjects (player.playerInMap.position).Aggregate (
				new List<Description> (),
				(actions, currItem) => {
					switch(currItem.type){
					case MapObjectType.Resource:
						{
							var action = Description.Empty;
							action.description = Description.WorkCollectResource;
							action.values = new NameValueCollection();
							action.values.Add("mapObjectId", currItem.key+"");
							actions.Add(action);
						}
						break;
					case MapObjectType.Monster:
						{
							var action = Description.Empty;
							action.description = Description.WorkAttack;
							action.values = new NameValueCollection();
							action.values.Add("mapObjectId", currItem.key+"");
							actions.Add(action);
						}
						break;
					}
					return actions;
				}
			);
		}
		#endregion

		#region store
		public string GetMemonto(){
			string json = JsonUtility.ToJson(this);
			return json;
		}
		public static MapDataStore FromMemonto(string json){
			return JsonUtility.FromJson<MapDataStore>(json);
		}
		#endregion
	}

	[Serializable]
	public class PlayerDataStore
	{
		#region playerInMap
		public MapPlayer playerInMap;
		public void InitPlayerPosition(){
			playerInMap.position.x = 5;
			playerInMap.position.y = 3;
		}
		public void MovePlayerTo(Position pos){
			playerInMap.position = pos;
		}
		#endregion

		#region visible map
		public List<Position> isPositionVisible = new List<Position>();
		public IEnumerable<MapObject> VisibleMapObjects(MapDataStore mapData) {
			var posSet = new HashSet<Position> (isPositionVisible);
			var visiblePosition = mapData.mapObjects.Where (obj => {
				return obj.died == false && posSet.Contains(obj.position);
			});
			return visiblePosition;
		}
		public bool VisitPosition(Position pos, int expend){
			var posSet = new HashSet<Position> (isPositionVisible);
			for (var x = -expend; x <= expend; ++x) {
				var yexpend = expend - Math.Abs (x);
				for (var y = -yexpend; y <= yexpend; ++y) {
					var newPos = pos.Add(x, y);
					posSet.Add (newPos);
				}
			}
			var newVisiblePosition = posSet.ToList ();
			var oldCnt = isPositionVisible.Count;
			var isDirty = newVisiblePosition.Count != oldCnt;

			isPositionVisible = newVisiblePosition;
			return isDirty;
		}
		public void ClearVisibleMapObjects(){
			isPositionVisible.Clear ();
		}
		#endregion

		#region storageInMap
		public List<Item> storageInMap;
		public void AddItem(Item item){
			if (storageInMap == null) {
				storageInMap = new List<Item> ();
			}
			var shouldArrange = true;
			for (var i = 0; i < storageInMap.Count; ++i) {
				var adjItem = storageInMap [i];
				if (adjItem.prototype != item.prototype) {
					continue;
				}
				if (adjItem.count + item.count > 99) {
					continue;
				}
				adjItem.count += item.count;
				storageInMap [i] = adjItem;
				shouldArrange = false;
				break;
			}
			if (shouldArrange == false) {
				return;
			}
			storageInMap.Add (item);
			// 計算同一種類的道具總數
			var sumOfCount = storageInMap.Where (obj => {
				return obj.prototype == item.prototype;
			}).Aggregate (0, (sum, obj) => {
				return sum + obj.count;
			});
			// 一個道具在一格中的最大數量限制
			var maxOfItem = 99;
			// 依最大限制重新計算分組
			var num = sumOfCount / maxOfItem;
			// 最後一個剩餘
			var remain = sumOfCount % maxOfItem;
			// 將拿來計算的道具抽出來
			var itemExcludeAddedItemPrototype = storageInMap.Where (obj => {
				return obj.prototype != item.prototype;
			});
			// 重建要新加入的道具
			var originItem = item;
			originItem.count = maxOfItem;
			var itemsShouldReAdd = Enumerable.Repeat (originItem, num);
			if (remain > 0) {
				originItem.count = remain;
				itemsShouldReAdd = itemsShouldReAdd.Concat (Enumerable.Repeat (originItem, 1));
			}
			// 加回去
			var newItems = itemExcludeAddedItemPrototype.Concat (itemsShouldReAdd);
			// 替換
			storageInMap = newItems.ToList();
		}
		#endregion

		#region store
		public string GetMemonto(){
			string json = JsonUtility.ToJson(this);
			return json;
		}
		public static PlayerDataStore FromMemonto(string json){
			return JsonUtility.FromJson<PlayerDataStore>(json);
		}
		#endregion
	}
}