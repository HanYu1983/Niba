using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using Common;

namespace Model
{
	public class Model : MonoBehaviour, IModel
	{
		public HandleDebug debug;

		MapDataStore mapData = new MapDataStore();
		PlayerDataStore playerData = new PlayerDataStore();

		public IEnumerator LoadMap(MapType type, Action<Exception> callback){
			yield return null;
			mapData.GenMap (type, 10, 10);
			mapData.VisitPosition (playerData.playerInMap.position, 10);
			RequestSaveMap ();
			callback (null);
		}
		public List<MapObject> MapObjects{ get{ return mapData.VisibleMapObjects; } }
		public List<ResourceInfo> ResourceInfos{ get { return mapData.resourceInfo; } }
		public List<MonsterInfo> MonsterInfos{ get { return mapData.monsterInfo; } }

		public MapPlayer MapPlayer { get { return playerData.playerInMap; } }

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
			var p = playerData.playerInMap.position;
			p.x += position.x;
			p.y += position.y;
			if (playerData.MovePlayerTo (p)) {
				return;
			}
			rs.isMoveSuccess = true;
			RequestSavePlayer ();

			if (mapData.VisitPosition (playerData.playerInMap.position, 3)) {
				RequestSaveMap ();
			}
			tempMoveResult = rs;
			hasMoveResult = true;
		}
		void RequestSavePlayer(){

		}
		void RequestSaveMap(){

		}
	}
}

