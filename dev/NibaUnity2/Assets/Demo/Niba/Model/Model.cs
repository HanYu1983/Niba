﻿using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System.Linq;
using System.IO;
using System.Threading;
using System.Runtime.InteropServices;

namespace Niba
{
	public class Model : MonoBehaviour
	{
		public HandleDebug debug;
		public MapDataStore mapData = new MapDataStore();
		public PlayerDataStore playerData = new PlayerDataStore();
		UserSettings user = new UserSettings();

		public void NewGame(){
			ClearMoveResult ();
			mapData = new MapDataStore();
			playerData = new PlayerDataStore();

            foreach(var w in Enumerable.Range(0, ConfigItem.ID_COUNT).Select(ConfigItem.Get))
            {
                if(w.AutoCreateCount > 0)
                {
                    playerData.AddItem(new Item()
                    {
                        prototype = w.ID,
                        count = w.AutoCreateCount
                    }, Place.Pocket);
                }
            }

            //playerData.AddItem(new Item { prototype = ConfigItem.ID_grass, count = 20 }, Place.Pocket);

            /*
			playerData.player.basicAbility.vit = 100;
			playerData.AddItem (new Item () {
				prototype = ConfigItem.ID_woodBoat,
				count = 1
			}, Place.Storage);

            Item item;
            item.count = 1;
            for (var i = 0; i < ConfigItem.ID_COUNT; ++i)
            {
                item.prototype = ConfigItem.Get(i).ID;
                playerData.AddItem(item, Place.Storage);
                playerData.AddItem(item, Place.Storage);
                playerData.AddItem(item, Place.Storage);
                playerData.AddItem(item, Place.Storage);
                playerData.AddItem(item, Place.Storage);
                playerData.AddItem(item, Place.Storage);
            }
            */
            /*
			playerData.player.AddExp (ConfigAbility.ID_karate, 5);
			playerData.player.AddExp (ConfigAbility.ID_tailor, 1);
			*/
            RequestSaveMap ();
			RequestSavePlayer ();
			RequestSaveUserSettings ();
		}

		public bool LoadGame(){
			return Load ();
		}

		public void NewMap(MapType type){
			mapData.GenMapStart(type);
		}

		public IEnumerable<string> CheckMissionNotification(){
			var ret = new List<string> ();
			var missions = AvailableNpcMissions.Where(m=>{
				return user.IsMark("MissionNotify_"+m) == false;
			});
			ret.AddRange (missions);
			return ret;
		}

		public void MarkMissionNotification(string mid){
			user.Mark ("MissionNotify_"+mid);
			RequestSaveUserSettings ();
		}

		public void EnterMap (){
			ClearMoveResult ();
			// 重設位置
			playerData.GetMapPlayer(Place.Map).position = Position.Zero;
			// 先探明初始視野
			playerData.ClearVisibleMapObjects ();
			playerData.VisitPosition (playerData.GetMapPlayer(Place.Map).position);
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
		public List<MapObject> MapObjects{ get{ return mapData.MapObjects; } }
		public List<ResourceInfo> ResourceInfos{ get { return mapData.ResourceInfo; } }
		public List<MonsterInfo> MonsterInfos{ get { return mapData.MonsterInfo; } }
		public IEnumerable<MapObject> VisibleMapObjects{ get { return playerData.VisibleMapObjects(mapData); } }
		public IEnumerable<MapObject> MapObjectsAt (Position pos){
			return mapData.FindObjects (pos);
		}
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

		public string IsCanFusion (string prototype, Place who, ref int fusionCnt){
			return playerData.IsCanFusion (prototype, who, ref fusionCnt);
		}

		public void Fusion (Item item, Place who){
            var fusionCnt = 0;
            var msg = IsCanFusion(item.prototype, who, ref fusionCnt);
            if(msg != null)
            {
                throw new Exception(msg);
            }
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

		public void EquipSkill (PlayState who, string skillId){
			playerData.EquipSkill (who, skillId);
			RequestSavePlayer ();
		}

		public void UnequipSkill (PlayState who, string skillId){
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
				return playerData.PlayState;
			}
		}

        public int Money { get { return playerData.Money; } }

        public void AddPlayerHp(int v)
        {
            playerData.AddPlayerHp(mapData, v);
            RequestSavePlayer();
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
		}

        #region persistent

#if UNITY_STANDALONE || UNITY_IOS || UNITY_ANDROID || UNITY_EDITOR
        bool Load()
        {
            var persistentDataPath = Application.persistentDataPath;

            var playerPath = persistentDataPath + "/playerData.json";
            if (File.Exists(playerPath) == false)
            {
                return false;
            }
            else
            {
                var playerMemoto = File.ReadAllText(playerPath);
                playerData = PlayerDataStore.FromMemonto(playerMemoto);
            }

            var mapPath = persistentDataPath + "/mapData.json";
            if (File.Exists(mapPath) == false)
            {
                return false;
            }
            else
            {
                var mapMemoto = File.ReadAllText(mapPath);
                mapData = MapDataStore.FromMemonto(mapMemoto);
            }

            var userSettingsPath = persistentDataPath + "/userSettings.json";
            // userSettings不存在的話沒差
            if (File.Exists(userSettingsPath) == false)
            {
                // ignore
            }
            else
            {
                var userMemoto = File.ReadAllText(userSettingsPath);
                user = UserSettings.FromMemonto(userMemoto);
            }
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
		void RequestSaveUserSettings(){
			SavePlayerDiskWorker (Application.persistentDataPath);
			saveTargets.Add ("user");
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
					if(saveTargets.Contains("user")){
						Debug.LogWarning("save user settings...");
						var memonto = user.GetMemonto ();
						var path = persistentDataPath + "/userSettings.json";
						File.WriteAllText(path, memonto);
						saveTargets.Remove("user");
					}
					if(saveTargets.Contains("player")){
						var memonto = playerData.GetMemonto ();
						var path = persistentDataPath + "/playerData.json";
                        Debug.LogWarning("save player:" + path);
                        File.WriteAllText(path, memonto);
						saveTargets.Remove("player");
					}
					if(saveTargets.Contains("map")){
						var memonto = mapData.GetMemonto ();
						var path = persistentDataPath + "/mapData.json";
                        Debug.LogWarning("save map:"+path);
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
#elif UNITY_WEBGL
        [DllImport("__Internal")]
        public static extern string PersistentDataPath();
        [DllImport("__Internal")]
        public static extern bool IsFileExist(string path);
        [DllImport("__Internal")]
        public static extern string ReadAllText(string path);
        [DllImport("__Internal")]
        public static extern void DeleteFile(string path);
        [DllImport("__Internal")]
        public static extern void WriteAllText(string path, string data);

        bool Load()
        {
            var persistentDataPath = "niba";

            var playerPath = persistentDataPath + "/playerData.json";
            if (IsFileExist(playerPath) == false)
            {
                return false;
            }
            else
            {
                var playerMemoto = ReadAllText(playerPath);
                playerData = PlayerDataStore.FromMemonto(playerMemoto);
            }

            var mapPath = persistentDataPath + "/mapData.json";
            if (IsFileExist(mapPath) == false)
            {
                return false;
            }
            else
            {
                var mapMemoto = ReadAllText(mapPath);
                mapData = MapDataStore.FromMemonto(mapMemoto);
            }

            var userSettingsPath = persistentDataPath + "/userSettings.json";
            // userSettings不存在的話沒差
            if (IsFileExist(userSettingsPath) == false)
            {
                // ignore
            }
            else
            {
                var userMemoto = ReadAllText(userSettingsPath);
                user = UserSettings.FromMemonto(userMemoto);
            }
            return true;
        }

        void RequestSavePlayer()
        {
            var memonto = playerData.GetMemonto();
            WriteAllText("niba/playerData.json", memonto);
        }
        void RequestSaveMap()
        {
            var memonto = mapData.GetMemonto();
            WriteAllText("niba/mapData.json", memonto);
        }
        void RequestSaveUserSettings()
        {
            var memonto = user.GetMemonto();
            WriteAllText("niba/userSettings.json", memonto);
        }
#endif

            #endregion
        }
}

