using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using Common;
using System.Linq;
using System.IO;
using System.Threading;
using HanRPGAPI;

namespace Model
{
	public class Model : MonoBehaviour, IModel
	{
		public HandleDebug debug;
		public int visibleExtendLength = 3;

		MapDataStore mapData = new MapDataStore();
		PlayerDataStore playerData = new PlayerDataStore();

		public void NewGame(){
			ClearMoveResult ();
			mapData = new MapDataStore();
			playerData = new PlayerDataStore();
			playerData.player.basicAbility.vit = 100;
			playerData.AddItem (new Item () {
				prototype = ConfigItem.ID_woodBoat,
				count = 1
			}, Place.Storage);
			/*
			playerData.player.AddExp (ConfigAbility.ID_karate, 5);
			playerData.player.AddExp (ConfigAbility.ID_tailor, 1);
			*/
			RequestSaveMap ();
			RequestSavePlayer ();
		}

		public bool LoadGame(){
			return Load ();
		}

		public void NewMap(MapType type){
			mapData.GenMapStart(type);
		}
		public void EnterMap (){
			ClearMoveResult ();
			// 重設位置
			playerData.playerInMap.position = Position.Zero;
			// 先探明初始視野
			playerData.ClearVisibleMapObjects ();
			playerData.VisitPosition (playerData.playerInMap.position);
			// 清除地圖
			mapData.ClearMap();
			// 自動生成視野內的地圖
			mapData.GenMapWithPlayerVisible (playerData);
			// 進入地圖
			playerData.EnterMap (mapData);
			RequestSavePlayer ();
			RequestSaveMap ();
		}
		public void ExitMap (){
			playerData.ExitMap ();
			RequestSavePlayer ();
		}
		public List<MapObject> MapObjects{ get{ return mapData.mapObjects; } }
		public List<ResourceInfo> ResourceInfos{ get { return mapData.resourceInfo; } }
		public List<MonsterInfo> MonsterInfos{ get { return mapData.monsterInfo; } }
		/*
		public int MapWidth{ get{ return mapData.width; } }
		public int MapHeight{ get{ return mapData.height; } }
		*/
		public IEnumerable<MapObject> VisibleMapObjects{ get { return playerData.VisibleMapObjects(mapData); } }
		public IEnumerable<MapObject> MapObjectsAt (Position pos){
			return mapData.FindObjects (pos);
		}
		//public List<Item> Storage{ get{ return playerData.storage; } }
		/*
		public MapPlayer HomePlayer { get { return playerData.player; } }
		public MapPlayer MapPlayer { get { return playerData.playerInMap; } }
		*/
		public MapPlayer GetMapPlayer (Place place){
			return playerData.GetMapPlayer (place);
		}
		public IEnumerable<Description> Works{ get { return mapData.GetWorks (playerData); } }

		IEnumerable<Description> workResult;
		public IEnumerable<Description> WorkResults{ get{ return workResult; } }

		public void StartWork (Description work){
			mapData.StartWork (playerData, work);
			RequestSaveMap ();
		}
		public void CancelWork (){
			mapData.CancelWork (playerData);
			RequestSaveMap ();
		}
		public void ApplyWork(){
			workResult = mapData.ApplyWork (playerData);
			RequestSaveMap ();
			RequestSavePlayer ();
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

		public void AddItemToStorage(Item item, Place who){
			playerData.AddItem (item, who);
			RequestSavePlayer ();
		}

		public void MoveItem(Place a, Place b, Item item){
			playerData.MoveItem (a, b, item);
			RequestSavePlayer ();
		}

		public int IsCanFusion (string prototype, Place who){
			return playerData.IsCanFusion (prototype, who);
		}

		public void Fusion (Item item, Place who){
			playerData.Fusion (item, who);
			RequestSavePlayer ();
		}

		public void EquipWeapon (Item item, Place whosWeapon, Place whosStorage){
			playerData.EquipWeapon (item, whosWeapon, whosStorage);
			RequestSavePlayer ();
		}
		public void UnequipWeapon (Item item, Place whosWeapon, Place whosStorage){
			playerData.UnequipWeapon (item, whosWeapon, whosStorage);
			RequestSavePlayer ();
		}
		public void ClearStorage(Place who){
			if (who == Place.Pocket) {
				playerData.player.storage.Clear ();
			} else if (who == Place.Map) {
				playerData.playerInMap.storage.Clear ();
			} else {
				playerData.playerInStorage.storage.Clear ();
			}
		}
		public IEnumerable<string> AvailableNpcMissions {
			get {
				return playerData.AvailableNpcMissions;
			}
		}
		public IEnumerable<string> AvailableSkills(Place who){
			return Helper.AvailableSkills (playerData, who).Select(cfg=>cfg.ID);
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
		public void ClearMissionStatus(){
			playerData.ClearMissionStatus ();
		}

		public void EquipSkill (Place who, string skillId){
			playerData.EquipSkill (who, skillId);
			RequestSavePlayer ();
		}

		public void UnequipSkill (Place who, string skillId){
			playerData.UnequipSkill (who, skillId);
			RequestSavePlayer ();
		}

		BasicAbility tmpBasic;
		FightAbility tmpFight;

		public BasicAbility PlayerBasicAbility(Place who){
			Helper.CalcAbility (playerData, mapData, who, ref tmpBasic, ref tmpFight);
			return tmpBasic;
		}

		public FightAbility PlayerFightAbility(Place who){
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

		public PlayState PlayState{ 
			get{
				return playerData.playState;
			}
		}

		void Move(Position offset){
			if (hasMoveResult) {
				throw new Exception ("必須先處理之前的move result並且呼叫ClearMoveResult");
			}
			var isPositionDirty = false;
			var isMapDirty = false;
			tempMoveResult = playerData.Move (mapData, offset, ref isMapDirty, ref isPositionDirty);
			hasMoveResult = true;
			// 有更動就儲存
			if (isPositionDirty) {
				RequestSavePlayer ();
			}
			if (isMapDirty) {
				RequestSaveMap ();
			}
			/*
			if (playerData.playerInMap.IsDied) {
				throw new Exception ("冒險者掛點，無法移動");
			}
			if (playerData.playState != PlayState.Play) {
				throw new Exception ("這時必須是Play狀態，請檢查程式:"+playerData.playState.ToString());
			}
			if (hasMoveResult) {
				throw new Exception ("必須先處理之前的move result並且呼叫ClearMoveResult");
			}
			var originPos = playerData.playerInMap.position;
			var newPos = originPos.Add (position);
			var moveConsumpation = mapData.MoveConsumption (playerData, originPos, newPos);
			if (playerData.playerInMap.hp - moveConsumpation < 0) {
				throw new Exception ("體力不足，無法移動:"+playerData.playerInMap.hp);
			}
			MoveResult rs = MoveResult.Empty;
			//newPos = newPos.Max (Position.Zero).Min (mapData.width-1, mapData.height-1);
			var isPositionDirty = newPos.Equals (playerData.playerInMap.position) == false;
			// 移動位置
			playerData.MovePlayerTo (newPos);
			// 新增視野
			var isMapDirty = playerData.VisitPosition (playerData.playerInMap.position, visibleExtendLength);
			// 產生事件
			var events = mapData.GenEvent (playerData, newPos);
			if (isMapDirty) {
				// 生成新地圖
				mapData.GenMapWithPlayerVisible (playerData);
			}
			if (isPositionDirty) {
				// 增加移動經驗
				playerData.playerInMap.AddExp (ConfigAbility.ID_move, 1);
				// 體力減少
				playerData.playerInMap.hp -= moveConsumpation;
			}
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
			*/
		}

		#region persistent
		bool Load(){
			var persistentDataPath = Application.persistentDataPath;
			var playerPath = persistentDataPath + "/playerData.json";
			var mapPath = persistentDataPath + "/mapData.json";
			if (File.Exists (playerPath) == false) {
				return false;
			}
			if (File.Exists (mapPath) == false) {
				return false;
			}
			var playerMemoto = File.ReadAllText (playerPath);
			var mapMemoto = File.ReadAllText (mapPath);
			playerData = PlayerDataStore.FromMemonto (playerMemoto);
			mapData = MapDataStore.FromMemonto (mapMemoto);
			return true;
		}
		HashSet<string> saveTargets = new HashSet<string>();
		void RequestSavePlayer(){
			SavePlayerDiskWorker (Application.persistentDataPath);
			saveTargets.Add ("player");
			lock (saveTargets) {
				Monitor.PulseAll (saveTargets);
			}
		}
		void RequestSaveMap(){
			SavePlayerDiskWorker (Application.persistentDataPath);
			saveTargets.Add ("map");
			lock (saveTargets) {
				Monitor.PulseAll (saveTargets);
			}
		}
		Thread savingThread;
		void SavePlayerDiskWorker(string persistentDataPath){
			if (savingThread != null) {
				return;
			}
			savingThread = new Thread (() => {
				while(true){
					if(saveTargets.Contains("player")){
						Debug.LogWarning("save player...");
						var memonto = playerData.GetMemonto ();
						var path = persistentDataPath + "/playerData.json";
						File.WriteAllText(path, memonto);
						saveTargets.Remove("player");
					}
					if(saveTargets.Contains("map")){
						Debug.LogWarning("save map...");
						var memonto = mapData.GetMemonto ();
						var path = persistentDataPath + "/mapData.json";
						File.WriteAllText(path, memonto);
						saveTargets.Remove("map");
					}
					lock (saveTargets) {
						if(saveTargets.Count == 0){
							Debug.LogWarning("waiting for save...");
							Monitor.Wait(saveTargets);
						}
					}
				}
			});
			savingThread.Start ();
		}
		#endregion
	}
}

