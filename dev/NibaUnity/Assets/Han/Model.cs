using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using Common;
using System.Linq;

namespace Model
{
	public class Model : MonoBehaviour, IModel
	{
		public HandleDebug debug;
		public int visibleExtendLength = 3;

		MapDataStore mapData = new MapDataStore();
		PlayerDataStore playerData = new PlayerDataStore();

		public IEnumerator LoadMap(MapType type, Action<Exception> callback){
			yield return null;
			mapData.GenMap (type, 10, 10);
			playerData.ClearVisibleMapObjects ();
			playerData.playerInMap.position = Position.Zero;
			playerData.VisitPosition (playerData.playerInMap.position, visibleExtendLength);
			RequestSaveMap ();
			RequestSavePlayer ();
			callback (null);
		}
		public List<MapObject> MapObjects{ get{ return mapData.mapObjects; } }
		public List<ResourceInfo> ResourceInfos{ get { return mapData.resourceInfo; } }
		public List<MonsterInfo> MonsterInfos{ get { return mapData.monsterInfo; } }

		public int MapWidth{ get{ return mapData.width; } }
		public int MapHeight{ get{ return mapData.height; } }
		public IEnumerable<MapObject> VisibleMapObjects{ get { return playerData.VisibleMapObjects(mapData); } }
		public IEnumerable<MapObject> MapObjectsAt (Position pos){
			return mapData.FindObjects (pos);
		}
		public MapPlayer MapPlayer { get { return playerData.playerInMap; } }
		public IEnumerable<Description> Works{ get { return mapData.GetWorks (playerData); } }
		public List<Item> StorageInMap{ get { return playerData.storageInMap; }  }

		public void StartWork (Description work){
			mapData.StartWork (playerData, work);
		}
		public void CancelWork (){
			mapData.CancelWork (playerData);
		}
		public void ApplyWork(){
			mapData.ApplyWork (playerData);
		}

		MoveResult tempMoveResult;
		bool hasMoveResult;

		public void MoveUp(){
			Position p;
			p.x = 0; p.y = -1;
			Move (p);
		}
		public void MoveDown(){
			Position p;
			p.x = 0; p.y = 1;
			Move (p);
		}
		public void MoveLeft(){
			Position p;
			p.x = -1; p.y = 0;
			Move (p);
		}
		public void MoveRight(){
			Position p;
			p.x = 1; p.y = 0;
			Move (p);
		}
		public MoveResult MoveResult{ 
			get{
				if (hasMoveResult == false) {
					throw new UnityException ("沒有move result");
				}
				return tempMoveResult;
			} 
		}
		public void ClearMoveResult(){
			hasMoveResult = false;
		}

		void Move(Position position){
			if (hasMoveResult) {
				throw new UnityException ("必須先處理之前的move result並且呼叫ClearMoveResult");
			}
			MoveResult rs = MoveResult.Empty;
			var newPos = playerData.playerInMap.position;
			newPos.x += position.x;
			newPos.y += position.y;
			newPos = newPos.Max (Position.Zero).Min (mapData.width-1, mapData.height-1);
			var isPositionDirty = newPos.Equals (playerData.playerInMap.position) == false;
			// 移動位置
			playerData.MovePlayerTo (newPos);
			// 新增視野
			var isMapDirty = playerData.VisitPosition (playerData.playerInMap.position, visibleExtendLength);
			// 產生事件
			var events = mapData.GenEvent (playerData, newPos);
			// 準備回傳物件
			rs.isMoveSuccess = isPositionDirty;
			rs.events = events.ToList();
			tempMoveResult = rs;
			hasMoveResult = true;
			// 有更動就儲存
			if (isPositionDirty) {
				RequestSavePlayer ();
			}
			if (isMapDirty) {
				RequestSaveMap ();
			}
		}
		void RequestSavePlayer(){

		}
		void RequestSaveMap(){

		}
	}
}

