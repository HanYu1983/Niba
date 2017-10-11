using System;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace Model
{
	[Serializable]
	public class MapDataStore{
		#region map
		// Dictionary無法Serializable
		public List<MapObject> items = new List<MapObject>();
		public List<ResourceInfo> resourceInfo = new List<ResourceInfo>();
		public List<MonsterInfo> monsterInfo = new List<MonsterInfo>();

		public void GenMap(MapType type, int w, int h){
			for (var y = 0; y < h; ++y) {
				for (var x = 0; x < w; ++x) {
					var p = Mathf.PerlinNoise (x, y);
					if (p < 0.8f) {
						var key = GenObject (MapObjectType.Resource, null);
						var obj = items [key];
						Position pos;
						pos.x = x;
						pos.y = y;
						obj.position = pos;
						var info = resourceInfo [items [key].infoKey];
						if (p < 0.3f) {
							info.type = ResourceType.Tree;
						} else if (p < 0.8f) {
							info.type = ResourceType.Grass;
						}
						// assign back
						resourceInfo [items [key].infoKey] = info;
						items [key] = obj;
						// gen monster after assign item
						if (obj.type == MapObjectType.Resource) {
							GenMonster (key, false);
						}
					} else {
						// ignore
					}
				}
			}
		}
		public void ClearMap(){
			items.Clear ();
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
				ResourceInfo ri;
				ri.type = ResourceType.Unknown;
				resourceInfo.Add (ri);
				break;
			case MapObjectType.Monster:
				item.infoKey = monsterInfo.Count;
				MonsterInfo mi;
				mi.type = MonsterType.Unknown;
				mi.habitats = ResourceType.Unknown;
				monsterInfo.Add (mi);
				break;
			}
			// 先取得數字鍵
			item.key = items.Count;
			// 再加入到串列
			items.Add (item);
			return item.key;
		}
		public int GenMonster(int objKey, bool assignMonsterType, MonsterType monsterType = MonsterType.Unknown){
			var obj = items [objKey];
			var resInfo = resourceInfo [obj.infoKey];
			if (resInfo.type == ResourceType.Unknown) {
				throw new UnityException ("resourceType type not defined. with object key:"+objKey);
			}
			var m1Key = GenObject (MapObjectType.Monster, null);
			var m1Object = items [m1Key];
			var m1Info = monsterInfo [m1Object.infoKey];
			m1Info.habitats = resInfo.type;
			if (assignMonsterType) {
				m1Info.type = monsterType;
			} else {
				// TODO
				m1Info.type = MonsterType.Dog;
			}
			// assign back
			monsterInfo [m1Object.infoKey] = m1Info;
			return m1Key;
		}
		public MapObject FindObject(string strKey){
			return items.Find (item => {
				return item.strKey == strKey;
			});
		}
		public IEnumerable<MapObject> FindObjects(Position pos){
			return items.Where (item => {
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
		public IEnumerable<Action> GetActions(PlayerDataStore store){
			return FindObjects (store.playerInMap.position).Aggregate (
				new List<Action> (),
				(actions, currItem) => {
					Action action = new Action();
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
		public bool MovePlayerTo(int x, int y){
			playerInMap.position.x = x;
			playerInMap.position.y = y;
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