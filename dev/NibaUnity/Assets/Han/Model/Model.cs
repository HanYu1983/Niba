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

		public void NewGame(){
			/*
			playerData.playerInMap.skillExp.karate = 25;

			playerData.playerInMap.basicAbility.str = 20;
			playerData.playerInMap.basicAbility.vit = 20;
			playerData.playerInMap.basicAbility.agi = 20;
			playerData.playerInMap.basicAbility.dex = 20;
			playerData.playerInMap.basicAbility.Int = 20;
			playerData.playerInMap.basicAbility.luc = 20;
			Item item;
			item.count = 1;
			item.prototype = ConfigItem.ID_ironKen;
			playerData.playerInMap.weapons.Clear ();
			playerData.playerInMap.weapons.Add (item);
			*/
			mapData.ClearMap ();
			playerData.ClearVisibleMapObjects ();
			ClearMoveResult ();
			RequestSaveMap ();
			RequestSavePlayer ();
		}

		public IEnumerator LoadMap(MapType type, Action<Exception> callback){
			yield return null;
			mapData.GenMap (type, 10, 10, playerData);
			playerData.ClearVisibleMapObjects ();
			playerData.VisitPosition (playerData.playerInMap.position, visibleExtendLength);

			ClearMoveResult ();
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
		public List<Item> Storage{ get{ return playerData.storage; } }
		public MapPlayer HomePlayer { get { return playerData.player; } }
		public MapPlayer MapPlayer { get { return playerData.playerInMap; } }
		public IEnumerable<Description> Works{ get { return mapData.GetWorks (playerData); } }

		IEnumerable<Description> workResult;
		public IEnumerable<Description> WorkResults{ get{ return workResult; } }

		public void StartWork (Description work){
			mapData.StartWork (playerData, work);
		}
		public void CancelWork (){
			mapData.CancelWork (playerData);
		}
		public void ApplyWork(){
			workResult = mapData.ApplyWork (playerData);
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

		public void ApplyMoveResult(){
			if (tempMoveResult.HasEvent) {
				mapData.ApplyEvents (playerData, tempMoveResult.events);
			}
		}

		public void AddItemToStorage(Item item, MapPlayer who){
			playerData.AddItem (item, who);
			RequestSavePlayer ();
		}

		public int IsCanFusion (string prototype, MapPlayer who){
			return playerData.IsCanFusion (prototype, who);
		}

		public void Fusion (Item item, MapPlayer who){
			playerData.Fusion (item, who);
		}

		public void EquipWeapon (Item item, MapPlayer whosWeapon, MapPlayer whosStorage){
			playerData.EquipWeapon (item, whosWeapon, whosStorage);
			RequestSavePlayer ();
		}
		public void UnequipWeapon (Item item, MapPlayer whosWeapon, MapPlayer whosStorage){
			playerData.UnequipWeapon (item, whosWeapon, whosStorage);
			RequestSavePlayer ();
		}
		public void ClearStorage(MapPlayer who){
			if (who.Equals (playerData.player)) {
				playerData.player.storage.Clear ();
			} else if (who.Equals (playerData.playerInMap)) {
				playerData.playerInMap.storage.Clear ();
			} else {
				playerData.storage.Clear ();
			}
		}
		public IEnumerable<string> AvailableNpcMissions {
			get {
				return playerData.AvailableNpcMissions;
			}
		}
		public void AcceptMission(string id){
			playerData.AcceptMission (id);
			RequestSavePlayer ();
		}
		public List<string> CheckMissionStatus(){
			return playerData.CheckMissionStatus ();
		}
		public IEnumerable<AbstractItem> CompleteMission (string id){
			var ret = playerData.CompleteMission (id);
			RequestSavePlayer ();
			return ret;
		}

		BasicAbility tmpBasic;
		FightAbility tmpFight;

		public BasicAbility PlayerBasicAbility(MapPlayer who){
			Helper.CalcAbility (playerData, mapData, who, ref tmpBasic, ref tmpFight);
			return tmpBasic;
		}

		public FightAbility PlayerFightAbility(MapPlayer who){
			Helper.CalcAbility (playerData, mapData, who, ref tmpBasic, ref tmpFight);
			return tmpFight;
		}

		public IEnumerable<Item> CanFusionItems{ 
			get { 
				var ret = new List<Item> ();
				Item item;
				item.count = 1;
				for (var i = 0; i < ConfigItem.ID_COUNT; ++i) {
					var cfg = ConfigItem.Get (i);
					if (cfg.FusionRequire == null) {
						continue;
					}
					item.prototype = ConfigItem.Get (i).ID;
					ret.Add (item);
				}
				return ret;
			} 
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

