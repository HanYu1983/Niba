using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;

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
			callback (null);
		}
		public List<MapObject> MapObjects{ get{ return mapData.items; } }
		public List<ResourceInfo> ResourceInfos{ get { return mapData.resourceInfo; } }
		public List<MonsterInfo> MonsterInfos{ get { return mapData.monsterInfo; } }

		public MapPlayer MapPlayer { get { return playerData.playerInMap; } }
		public MoveResult MoveUp(){
			Position p;
			p.x = 0; p.y = -1;
			return Move (p);
		}
		public MoveResult MoveDown(){
			Position p;
			p.x = 0; p.y = 1;
			return Move (p);
		}
		public MoveResult MoveLeft(){
			Position p;
			p.x = -1; p.y = 0;
			return Move (p);
		}
		public MoveResult MoveRight(){
			Position p;
			p.x = 1; p.y = 0;
			return Move (p);
		}

		MoveResult Move(Position position){
			MoveResult rs = MoveResult.Empty;
			var p = playerData.playerInMap.position;
			p.x += position.x;
			p.y += position.y;
			if (playerData.MovePlayerTo (p)) {
				return rs;
			}
			rs.isMoveSuccess = true;
			RequestSavePlayer ();
			return rs;
		}
		void RequestSavePlayer(){

		}
		void RequestSaveMap(){

		}
	}
}

