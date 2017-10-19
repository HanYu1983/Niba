﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;
using UnityEngine;
using System.Linq;

namespace Common
{
	[Serializable]
	public struct Position : IEquatable<Position>{
		public int x, y;
		public bool Equals(Position other){
			return x == other.x && y == other.y;
		}
		public Position Add(int x, int y){
			var ret = Zero;
			ret.x += x;
			ret.y += y;
			return ret;
		}
		public Position Add(Position b){
			return Add (b.x, b.y);
		}
		public Position Max(int x, int y){
			var ret = this;
			ret.x = Math.Max (x, this.x);
			ret.y = Math.Max (y, this.y);
			return ret;
		}
		public Position Max(Position b){
			return Max (b.x, b.y);
		}
		public Position Min(int x, int y){
			var ret = this;
			ret.x = Math.Min (x, this.x);
			ret.y = Math.Min (y, this.y);
			return ret;
		}
		public static Position Zero;
	}

	[Serializable]
	public enum MapObjectType{
		Unknown = 0, 
		Resource = 1, 
		Monster = 2
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
		public int type;
		public static ResourceInfo Empty;
	}

	[Serializable]
	public struct MonsterInfo {
		public int type;
		// 棲息地(ResourceInfo.type)
		public int habitats;
		public static MonsterInfo Empty;
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

	public struct UserAction{
		public const string TypeAttack = "attack {mapObjectId[0]}";
		public const string TypeCaptureResource = "capture resource {mapObjectId[0]}";
		public string type;
		public List<int> mapObjectId;
		public static UserAction Empty;
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

	public enum Page{
		Unknown, Title, Game
	}

	public enum Popup{
		Unknown, Event
	}

	public interface IView {
		IModelGetter ModelGetter{ set; }
		/// <summary>
		/// 切換頁面
		/// callback(null if exception == null else exception)
		/// </summary>
		/// <returns>The page.</returns>
		/// <param name="page">Page.</param>
		/// <param name="callback">Callback.</param>
		IEnumerator ChangePage(Page page, Action<Exception> callback);
		IEnumerator OpenPopup(Popup page, Action<Exception> callback);
	}

	public interface IModelGetter{
		/// <summary>
		/// 地圖狀態
		/// </summary>
		/// <value>The map objects.</value>
		/// <code>
		/// var obj1 = MapObjects[0];
		/// switch(obj1.type){
		/// case MapObjectType.Resource:{
		/// 	var info = ResourceInfos[obj1.infoKey]
		/// 	// your process
		/// 	} break;
		/// case MapObjectType.Monster:{
		/// 	var info = MonsterInfos[obj1.infoKey]
		/// 	// your process
		/// 	} break;
		/// }
		/// </code>
		List<MapObject> MapObjects{ get; }
		List<ResourceInfo> ResourceInfos{ get; }
		List<MonsterInfo> MonsterInfos{ get; }
		int MapWidth{ get; }
		int MapHeight{ get; }
		/// <summary>
		/// 取得可視的tile
		/// </summary>
		/// <value>The visible map objects.</value>
		IEnumerable<MapObject> VisibleMapObjects{ get; }
		/// <summary>
		/// 取得玩家在地圖中的狀態
		/// 注意：回傳的是struct，千萬不要暫存它，不然會取得不正確的資料
		/// </summary>
		/// <value>The map player.</value>
		MapPlayer MapPlayer{ get; }
		IEnumerable<UserAction> UserActions{ get; }
		bool PerformUserAction (UserAction action);
	}

	public interface IModel : IModelGetter{
		/// <summary>
		/// 讀取地圖
		/// 任何一張地圖就是臨時創建的
		/// 同時間只能存在一張地圖
		/// 使用MapObjects取得地圖狀態
		/// </summary>
		/// <returns>The map.</returns>
		/// <param name="type">Type.</param>
		/// <param name="callback">Callback.</param>
		IEnumerator LoadMap(MapType type, Action<Exception> callback);
		/// <summary>
		/// 向上移動一格
		/// </summary>
		void MoveUp();
		/// <summary>
		/// 向下移動一格
		/// </summary>
		void MoveDown();
		/// <summary>
		/// 向左移動一格
		/// </summary>
		void MoveLeft();
		/// <summary>
		/// 向右移動一格
		/// </summary>
		void MoveRight();
		/// <summary>
		/// 取得移動結果
		/// 呼叫任何移動後就必須處理MoveResult，並呼叫ClearMoveResult來清除暫存
		/// </summary>
		/// <value>The move result.</value>
		MoveResult MoveResult{ get; }
		/// <summary>
		/// 清除移動結果的暫存
		/// </summary>
		void ClearMoveResult();
	}

	public class Common
	{
		public static event Action<string, object> OnEvent = delegate{};
        public static void Notify(string cmd, object args)
        {
            OnEvent(cmd, args);
        }

		/// <summary>
		/// 這個方法很像不需要了
		/// </summary>
		/// <returns>The map objects for center expend.</returns>
		/// <param name="model">Model.</param>
		/// <param name="center">Center.</param>
		/// <param name="w">The width.</param>
		/// <param name="h">The height.</param>
		public static List<MapObject> FilterMapObjectsForCenterExpend(IModelGetter model, Position center, int w, int h){
			return model.MapObjects.Where (obj => {
				var disX = Math.Abs (obj.position.x - center.x);
				if (disX > w) {
					return false;
				}
				var disY = Math.Abs (obj.position.y - center.y);
				if (disY > h) {
					return false;
				}
				return true;
			}).ToList ();
		}

		/// <summary>
		/// 平面化地圖物件
		/// </summary>
		/// <param name="model">Model.</param>
		/// <param name="data">Data.</param>
		/*
		MapObject[,] mapObjs;
		var leftTop = model.MapPlayer.position.Add (-5, -5).Max (0, 0);
		var rightBottom = leftTop.Add(10, 10).Min(model.MapWidth, model.MapHeight);
		FlattenMapObjects(model, MapObjectType.Resource, leftTop, rightBottom, out mapObjs);
		for (var x = 0; x < mapObjs.GetLength (1); ++x) {
			for (var y = 0; y < mapObjs.GetLength (2); ++y) {
				var obj = mapObjs[x,y];
				if(obj == MapObject.Empty){
					// 不可視的tile
				}
			}
		}
		*/ 
		public static void FlattenMapObjects(IModelGetter model, MapObjectType type, Position leftTop, Position rightBottom, out MapObject[,] data){
			var w = rightBottom.x - leftTop.x;
			var h = rightBottom.y - leftTop.y;
			data = new MapObject[w, h];
			for (var x = 0; x < w; ++x) {
				for (var y = 0; y < h; ++y) {
					var curr = Position.Zero.Add(leftTop);
					var sg = model.VisibleMapObjects.Where (obj => {
						return obj.type == type && obj.position.Equals(curr);
					})
						.GroupBy (obj => obj.type)
						.OrderByDescending (g => g.Count())
						.First ();
					var first = sg.FirstOrDefault ();
					data [x, y] = first;
				}
			}
		}
	}
}

