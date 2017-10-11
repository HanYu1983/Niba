using System;
using System.Collections;

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
		
	}
	#endregion


	#region view data

	#endregion

	public interface IView {

	}

	public interface IModel {
		IEnumerator LoadMap<T>(MapType type, Action<Exception, T> callback);
		MapPlayer GetMapPlayer{ get; }
		MoveResult MoveUp();
		MoveResult MoveDown();
		MoveResult MoveLeft();
		MoveResult MoveRight();
	}

	public class Data
	{
		
	}
}

