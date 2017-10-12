using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using UnityEngine;

namespace Model
{
	#region model data
	[Serializable]
	public struct Position{
		public int x, y;
		public static Position Empty;
	}

	[Serializable]
	public enum MapObjectType{
		Unknown = 0, 
		Resource = 1, 
		Monster = 2
	}

	[Serializable]
	public enum ResourceType{
		Unknown = 0, 
		Grass = 1, 
		Tree = 2, 
		Sky = 3, 
		Rock = 4
	}

	[Serializable]
	public enum MonsterType{
		Unknown = 0, 
		Dog = 1, 
		Bufferfly = 2
	}

	[Serializable]
	public struct MapObject{
		public int key;
		public string strKey;
		public Position position;
		// info的主鍵為(type, infoKey)
		public MapObjectType type;
		public int infoKey;
		public static MapObject Empty;
	}

	[Serializable]
	public struct ResourceInfo{
		public ResourceType type;
	}

	[Serializable]
	public struct MonsterInfo {
		public MonsterType type;
		// 棲息地
		public ResourceType habitats;
	}

	[Serializable]
	public enum MapType{
		Unknown = 0
	}

	[Serializable]
	public struct MapPlayer{
		public Position position;
		public int mapHp, hp;
	}

	[Serializable]
	public struct PlayerInformation{

	}

	public enum ActionType{
		Unknown
	}

	public struct Action{
		public ActionType type;
		public int target;
	}

	public struct MoveResult{
		public bool isMoveSuccess;
		public List<string> events;
		public bool HasEvent{
			get{
				return events != null && events.Count > 0;
			}
		}
		public static string BuildEvent(String eventName, NameValueCollection args){
			return string.Format ("?eventName={0}&{1}", eventName, args.ToString ());
		}
		public static string ParseEvent(string eventDescription, NameValueCollection args){
			HanUtil.Native.ParseQueryString (eventDescription, Encoding.UTF8, args);
			var hasEventName = new List<string> (args.AllKeys).Contains("eventName");
			if (hasEventName == false) {
				throw new UnityException ("unknown event");
			}
			var eventName = args.Get ("eventName");
			return eventName;
		}
		public static MoveResult Empty;
	}
	#endregion


	#region view data

	#endregion

	public interface IView {
		IEnumerator ChangePage(string page, IModelGetter model, Action<Exception> callback);
	}

	public interface IModelGetter{
		List<MapObject> MapObjects{ get; }
		List<ResourceInfo> ResourceInfos{ get; }
		List<MonsterInfo> MonsterInfos{ get; }
		MapPlayer MapPlayer{ get; }
	}

	public interface IModel : IModelGetter{
		IEnumerator LoadMap(MapType type, Action<Exception> callback);
		MoveResult MoveUp();
		MoveResult MoveDown();
		MoveResult MoveLeft();
		MoveResult MoveRight();
	}

	public class Data
	{
		
	}
}

