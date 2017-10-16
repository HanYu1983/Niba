using System;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using Common;

namespace Model
{
	[Serializable]
	public class MapDataStore{
		#region map
		// Dictionary無法Serializable
		public List<Position> isPositionVisible = new List<Position>();
		public List<MapObject> mapObjects = new List<MapObject>();
		public List<ResourceInfo> resourceInfo = new List<ResourceInfo>();
		public List<MonsterInfo> monsterInfo = new List<MonsterInfo>();

		public List<MapObject> VisibleMapObjects {
			get {
				var posSet = new HashSet<Position> (isPositionVisible);
				var visiblePosition = mapObjects.Where (obj => {
					return posSet.Contains(obj.position);
				});
				return visiblePosition.ToList();
			}
		}
		public bool VisitPosition(Position pos, int expend){
			var posSet = new HashSet<Position> (isPositionVisible);
			for (var x = -expend; x <= expend; ++x) {
				var yexpend = expend - Math.Abs (x);
				for (var y = -yexpend; y <= yexpend; ++y) {
					Position newPos;
					newPos.x = x;
					newPos.y = y;
					posSet.Add (newPos);
				}
			}
			var newVisiblePosition = posSet.ToList ();
			var oldCnt = isPositionVisible.Count;
			var isDirty = newVisiblePosition.Count != oldCnt;

			isPositionVisible = newVisiblePosition;
			return isDirty;
		}

		public void GenMap(MapType type, int w, int h){
			for (var y = 0; y < h; ++y) {
				for (var x = 0; x < w; ++x) {
					var p = Mathf.PerlinNoise (x/(float)w, y/(float)h);
					Debug.Log (p);
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
							info.type = 2;
						} else if (p < 0.8f) {
							info.type = 1;
						}
						// assign back
						resourceInfo [mapObjects [key].infoKey] = info;

						// gen monster after assign item
						if (obj.type == MapObjectType.Resource) {
							var monsterKey = GenMonster (key, false);
							var monster = mapObjects [monsterKey];
							// change position
							monster.position = pos;
							// assign back
							mapObjects [monsterKey] = monster;
						}
					} else {
						// ignore
					}
				}
			}
		}
		public void ClearMap(){
			mapObjects.Clear ();
			isPositionVisible = null;
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
		public int GenMonster(int objKey, bool assignMonsterType, int monsterType = 0){
			var obj = mapObjects [objKey];
			var resInfo = resourceInfo [obj.infoKey];
			if (resInfo.type == 0) {
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
				m1Info.type = 1;
			}
			// assign back
			monsterInfo [m1Object.infoKey] = m1Info;
			return m1Key;
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
		public string GenEvent(PlayerDataStore store){
			return "Test Event One{0}";
		}
		#endregion

		#region action
		public IEnumerable<Common.Action> GetActions(PlayerDataStore store){
			return FindObjects (store.playerInMap.position).Aggregate (
				new List<Common.Action> (),
				(actions, currItem) => {
					Common.Action action = new Common.Action();
					action.target = currItem.key;
					actions.Add(action);
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
		#region player
		public MapPlayer playerInMap;
		public void InitPlayerPosition(){
			playerInMap.position.x = 5;
			playerInMap.position.y = 3;
		}
		public bool MovePlayerTo(Position pos){
			playerInMap.position.x = pos.x;
			playerInMap.position.y = pos.y;
			// TODO detect bound
			return true;
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