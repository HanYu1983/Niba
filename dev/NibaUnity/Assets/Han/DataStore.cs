using System;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace Model
{
	[Serializable]
	public struct Position{
		public int x, y;
	}

	[Serializable]
	public enum ItemType{
		Grass, Tree, Dog
	}

	[Serializable]
	public enum ItemLayer{
		Background,
		Foreground
	}

	[Serializable]
	public class Item{
		public string key;
		public Position position;
		public ItemLayer layer;
		public ItemType type;
	}

	[Serializable]
	public enum MapType{
		Test
	}

	[Serializable]
	public class MapPlayer{
		public Position position;
		public int mapHp, hp;
	}

	[Serializable]
	public class PlayerInformation{

	}

	public enum ActionType{
		Unknown
	}

	public struct Action{
		public ActionType type;
		public string target;
	}

	[Serializable]
	public class TempDataStore{
		#region map
		// Dictionary無法Serializable
		public List<Item> items = new List<Item>();

		public void GenMap(MapType type, int w, int h){
			
		}
		public void ClearMap(){
			items.Clear ();
		}
		public string GenItem(ItemType type, ItemLayer layer, Position pos, string key){
			if (key != null) {
				Item ignoreItem;
				if(GetItem (key, out ignoreItem)){
					throw new UnityException ("item already exists!"+key);
				}
			}
			var item = new Item ();
			item.type = type;
			item.layer = layer;
			item.position = pos;
			if (key != null) {
				item.key = key;
			} else {
				item.key =  System.Guid.NewGuid().ToString();
			}
			items.Add (item);
			return item.key;
		}
		public bool GetItem(string key, out Item find){
			find = items.Find (item => {
				return item.key == key;
			});
			if (find == null) {
				return false;
			}
			return true;
		}
		public IEnumerable<Item> GetItems(Position pos){
			return items.Where (item => {
				return item.position.Equals(pos);
			});
		}
		#endregion

		#region event
		public string GenEvent(DataStore store){
			return "Test Event One{0}";
		}
		#endregion

		#region action
		public IEnumerable<Action> GetActions(DataStore store){
			return GetItems (store.playerInMap.position).Aggregate (
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
		public static TempDataStore FromMemonto(string json){
			return JsonUtility.FromJson<TempDataStore>(json);
		}
		#endregion
	}

	[Serializable]
	public class DataStore
	{
		#region player
		public MapPlayer playerInMap = new MapPlayer();
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
		public static DataStore FromMemonto(string json){
			return JsonUtility.FromJson<DataStore>(json);
		}
		#endregion
	}
}