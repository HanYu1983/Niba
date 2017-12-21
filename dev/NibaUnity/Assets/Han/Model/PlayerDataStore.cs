using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System.Linq;
using Common;

namespace Model
{
	// 地圖的部分另外存，因為資料量比較大
	// 所以把比較長變動的資料移到PlayerDataStore
	[Serializable]
	public class MapDataStore{
		#region map
		// Dictionary無法Serializable
		public List<MapObject> mapObjects = new List<MapObject>();
		public List<ResourceInfo> resourceInfo = new List<ResourceInfo>();
		public List<MonsterInfo> monsterInfo = new List<MonsterInfo>();
		public int width, height;
		public void GenMap(MapType type, int w, int h, PlayerDataStore player){
			ClearMap ();

			width = w;
			height = h;
			for (var y = 0; y < h; ++y) {
				for (var x = 0; x < w; ++x) {
					var p = Mathf.PerlinNoise (x/(float)w, y/(float)h);
					//Debug.Log (p);
					if (p < 0.8f) {
						var pos = Position.Zero.Add (x, y);
						if (p < 0.3f) {
							GenResource (player, pos, ConfigResource.ID_rock);
						} else if (p < 0.8f) {
							GenResource (player, pos, ConfigResource.ID_grass);
						}
						// gen monster after assign item
						if (UnityEngine.Random.Range (0, 100) < 25) {
							GenMonster (player, pos, ConfigMonster.ID_ant);
						}
					} else {
						// ignore
					}
				}
			}
		}
		public void ClearMap(){
			mapObjects.Clear ();
			resourceInfo.Clear ();
			monsterInfo.Clear ();
			width = height = 0;
		}
		public int GenObject(MapObjectType type, string strKey){
			if (strKey != null) {
				if(FindObject (strKey).Equals(MapObject.Empty) == false){
					throw new UnityException ("item already exists!"+strKey);
				}
			}
			MapObject item = MapObject.Empty;
			item.type = type;
			if (strKey != null) {
				item.strKey = strKey;
			}
			switch (item.type) {
			case MapObjectType.Resource:
				item.infoKey = resourceInfo.Count;
				resourceInfo.Add (ResourceInfo.Empty);
				break;
			case MapObjectType.Monster:
				item.infoKey = monsterInfo.Count;
				monsterInfo.Add (MonsterInfo.Empty);
				break;
			}
			// 先取得數字鍵
			item.key = mapObjects.Count;
			// 再加入到串列
			mapObjects.Add (item);
			return item.key;
		}
		public int GenResource(PlayerDataStore player, Position pos, string resourceType){
			var key = GenObject (MapObjectType.Resource, null);
			var obj = mapObjects [key];
			obj.position = pos;
			mapObjects [key] = obj;

			var info = resourceInfo [mapObjects [key].infoKey];
			info.type = resourceType;
			resourceInfo [mapObjects [key].infoKey] = info;
			return key;
		}
		public int GenMonster(PlayerDataStore player, Position pos, string monsterType){
			var m1Key = GenObject (MapObjectType.Monster, null);

			var m1Object = mapObjects [m1Key];
			m1Object.position = pos;
			mapObjects [m1Key] = m1Object;

			var m1Info = monsterInfo [m1Object.infoKey];
			m1Info.type = monsterType;
			var ability = BasicAbility.Get (m1Info).FightAbility;
			m1Info.hp = (int)ability.hp;
			m1Info.mp = (int)ability.mp;
			monsterInfo [m1Object.infoKey] = m1Info;
			return m1Key;
		}

		public List<Item> Collect(PlayerDataStore player, int objKey){
			var ret = new List<Item> ();
			var obj = mapObjects [objKey];
			if (obj.died == true) {
				throw new MessageException ("不能採集已消除的物件:"+objKey);
			}
			if (obj.type != MapObjectType.Resource) {
				throw new MessageException ("非資源不得採集:"+obj.type);
			}
			obj.died = true;
			// assign back
			mapObjects [objKey] = obj;
			foreach (var item in ret) {
				player.AddItem (item, player.playerInMap);
			}
			return ret;
		}
		public MapObject FindObject(string strKey){
			return mapObjects.Find (item => {
				return item.strKey == strKey;
			});
		}
		public IEnumerable<MapObject> FindObjects(Position pos, bool filterDied = true){
			return mapObjects.Where (item => {
				if(filterDied & item.died){
					return false;
				}
				return item.position.Equals(pos);
			});
		}
		#endregion

		#region event
		public IEnumerable<Description> GenEvent(PlayerDataStore player, Position pos){
			var objs = FindObjects (pos);
			return objs.Aggregate(
				new List<Description>(),
				(accu, obj)=>{
					switch(obj.type){
					case MapObjectType.Resource:
						{
							var des = Description.Empty;
							des.description = Description.EventLucklyFind;
							des.values = new NameValueCollection();
							des.values.Add("itemPrototype", ConfigItem.ID_wood);
							des.values.Add("count", 10+"");
							accu.Add(des);
						}
						break;
					case MapObjectType.Monster:
						break;
					}
					return accu;
				}
			);
		}
		public void ApplyEvents(PlayerDataStore player, IEnumerable<Description> events){
			foreach (var evt in events) {
				switch (evt.description) {
				case Description.EventLucklyFind:
					{
						var itemPrototype = evt.values.Get("itemPrototype");
						var cnt = int.Parse(evt.values.Get("count"));
						Item item;
						item.prototype = itemPrototype;
						item.count = cnt;
						player.playerInMap.storage = Helper.AddItem (player.playerInMap.storage, item);
					}
					break;
				default:
					throw new NotImplementedException ("event:"+evt.description);
				}
			}
		}
		#endregion

		public IEnumerable<Description> ProcessWork(PlayerDataStore player, Description work){
			var ret = new List<Description>();
			switch (work.description) {
			case Description.WorkCollectResource:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var obj = mapObjects [mapObjectId];
					obj.died = true;
					mapObjects [mapObjectId] = obj;
					var info = resourceInfo [obj.infoKey];
					var config = ConfigResource.Get (info.type);
					foreach (var item in Common.Common.ParseItemFromResource(config)) {
						player.AddItem (item, player.playerInMap);
					}
				}
				break;
			case Description.WorkAttack:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var mapObject = mapObjects [mapObjectId];
					var monsterInf = monsterInfo[mapObject.infoKey];
					var monsterCfg = ConfigMonster.Get(monsterInf.type);
					var monsterAbility = BasicAbility.Get(monsterCfg).FightAbility;

					var playerBasic = BasicAbility.Zero;
					var playerAbility = FightAbility.Zero;
					// 先計算非針對怪物的能力
					Helper.CalcAbility (player, this, player.playerInMap, ref playerBasic, ref playerAbility);
					// 計算針對怪物的能力，例：如果對像是鳥，攻擊力*1.1之類
					var enforceEff = player.playerInMap.weapons.SelectMany (it => it.Effects).Where(it=>it.EffectOperator=="enforce");
					playerAbility = enforceEff.Aggregate (playerAbility, (accu, curr) => {
						// TODO 實做針對性能力
						return playerAbility;
					});
					var damage = playerAbility.Damage (monsterAbility);

					monsterInf.hp -= damage;
					if (monsterInf.IsDied) {
						mapObject.died = true;
					}
					// assign back
					monsterInfo [mapObject.infoKey] = monsterInf;
					mapObjects [mapObjectId] = mapObject;

					var des = Description.Empty;
					des.description = Description.InfoAttack;
					des.values = new NameValueCollection ();
					des.values.Set ("mapObjectId", mapObjectId+"");
					des.values.Set ("damage", damage+"");
					ret.Add (des);
				}
				break;
			case Description.EventMonsterAttackYou:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var mapObject = mapObjects [mapObjectId];
					var monsterInf = monsterInfo[mapObject.infoKey];
					var monsterCfg = ConfigMonster.Get(monsterInf.type);
					var monsterAbility = BasicAbility.Get(monsterCfg).FightAbility;

					var playerBasic = BasicAbility.Zero;
					var playerAbility = FightAbility.Zero;
					// 先計算非針對怪物的能力
					Helper.CalcAbility (player, this, player.playerInMap, ref playerBasic, ref playerAbility);
					// 計算針對怪物的能力，例：如果對像是鳥，防禦力*1.1之類
					var enforceEff = player.playerInMap.weapons.SelectMany (it => it.Effects).Where(it=>it.EffectOperator=="enforce");
					playerAbility = enforceEff.Aggregate (playerAbility, (accu, curr) => {
						// TODO 實做針對性能力
						return playerAbility;
					});
					var damage = monsterAbility.Damage (playerAbility);
					player.playerInMap.hp -= damage;

					var des = Description.Empty;
					des.description = Description.InfoMonsterAttack;
					des.values = new NameValueCollection ();
					des.values.Set ("mapObjectId", mapObjectId+"");
					des.values.Set ("damage", damage+"");
					ret.Add (des);
				}
				break;
			}
			return ret;
		}

		#region interaction
		// 應用所有互動並回傳結果
		public IEnumerable<Description> ApplyInteraction(PlayerDataStore player, IEnumerable<Interaction> interations){
			var sorted = interations.OrderByDescending (curr => {
				return curr.priority;
			});
			return sorted.SelectMany (work => { return ProcessWork (player, work.description);}).ToList(); // 呼叫ToList強迫墮性序列立即求值
		}

		// 玩家選擇一個工作後呼叫這個將選擇的工作轉為互動
		// 當中會計算這個互動的優先權
		public Interaction MakeInteraction(PlayerDataStore player, Description work){
			var ret = Interaction.Empty;
			ret.description = work;
			ret.priority = player.playerInMap.basicAbility.FightAbility.dodge;
			return ret;
		}

		// 場地與玩家互動列表
		// 玩家每執行一個互動前都要呼叫這個方法
		public IEnumerable<Interaction> GetInteraction(PlayerDataStore player){
			return FindObjects (player.playerInMap.position).Aggregate (
				new List<Interaction> (),
				(actions, currItem) => {
					switch(currItem.type){
					case MapObjectType.Monster:
						{
							var info = monsterInfo[currItem.infoKey];
							var cfg = ConfigMonster.Get(info.type);
							var ability = BasicAbility.Get(cfg);
							var fightAbility = ability.FightAbility;

							var action = Description.Empty;
							action.description = Description.EventMonsterAttackYou;
							action.values = new NameValueCollection();
							action.values.Add("mapObjectId", currItem.key+"");

							var ret = Interaction.Empty;
							ret.description = action;
							ret.priority = fightAbility.dodge;
							actions.Add(ret);
						}
						break;
					}
					return actions;
				}
			);
		}
		#endregion


		#region works
		public void StartWork(PlayerDataStore player, Description work){
			if (player.playerInMap.IsWorking) {
				throw new MessageException ("目前有工作在身:"+work.description);
			}
			player.playerInMap.currentWork = work;
			player.playerInMap.workFinishedTime = DateTime.Now.Add (TimeSpan.FromSeconds (5)).Ticks;
		}

		public void CancelWork(PlayerDataStore player){
			if (player.playerInMap.IsWorking == false) {
				Debug.LogWarning ("沒有工作，不必取消");
				return;
			}
			player.playerInMap.ClearWork ();
		}

		public IEnumerable<Description> ApplyWork(PlayerDataStore player){
			if (player.playerInMap.IsWorking == false) {
				throw new MessageException ("沒有工作，不能應用");
			}
			player.playerInMap.ClearWork ();

			var work = player.playerInMap.currentWork;
			// 將工作轉為互動
			var interaction = MakeInteraction (player, work);
			// 取得場景互動
			var envirInteraction = GetInteraction (player);
			// 匯總所有互動
			var allInter = envirInteraction.Concat (Enumerable.Repeat (interaction, 1));
			// 依優先權處理互動
			return ApplyInteraction (player, allInter);
			//return ProcessWork (player, work);
		}

		public IEnumerable<Description> GetWorks(PlayerDataStore player){
			return FindObjects (player.playerInMap.position).Aggregate (
				new List<Description> (),
				(actions, currItem) => {
					switch(currItem.type){
					case MapObjectType.Resource:
						{
							var action = Description.Empty;
							action.description = Description.WorkCollectResource;
							action.values = new NameValueCollection();
							action.values.Add("mapObjectId", currItem.key+"");
							actions.Add(action);
						}
						break;
					case MapObjectType.Monster:
						{
							var action = Description.Empty;
							action.description = Description.WorkAttack;
							action.values = new NameValueCollection();
							action.values.Add("mapObjectId", currItem.key+"");
							actions.Add(action);
						}
						break;
					}
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
		public static MapDataStore FromMemonto(string json){
			return JsonUtility.FromJson<MapDataStore>(json);
		}
		#endregion
	}

	[Serializable]
	public class PlayerDataStore
	{
		public MapPlayer player = MapPlayer.PlayerInHome;
		public MapPlayer playerInMap = MapPlayer.PlayerInMap;

		#region weapon
		public string IsCanEquip(Item item, MapPlayer who, MapPlayer whosStorage){
			if (who.Equals (MapPlayer.UnknowPlayer)) {
				throw new Exception ("只能裝備在家裡口袋或出門的冒險者");
			}
			var cfg = ConfigItem.Get (item.prototype);
			if (cfg.Type != ConfigItemType.ID_weapon) {
				return "只能裝備weapon類型，請檢查程式";
			}
			var weaponPosition = cfg.Position;
			var maxCount = ConfigWeaponPosition.Get (weaponPosition).SlotCount;
			Func<List<Item>, List<Item>, string> canEquip = (weapons, items) => {
				var haveCount = items.Count(i=>{
					return i.Equals(item);
				});
				if(haveCount <1){
					return "沒有那個道具:"+item;
				}
				var alreadyEquipCount = weapons.Count(i=>{
					return ConfigItem.Get (i.prototype).Position == weaponPosition;
				});
				if(alreadyEquipCount >= maxCount){
					return "那個位置已經滿, 最大為"+maxCount+":"+weaponPosition+". 所使用Weapon:"+who;
				}
				return null;
			};
			var useStorage = 
				whosStorage.Equals (player) ? player.storage :
				whosStorage.Equals (playerInMap) ? playerInMap.storage :
				storage;
			var useWeapon = 
				who.Equals (player) ? player.weapons :
				playerInMap.weapons;
			return canEquip (useWeapon, useStorage);
		}

		public void EquipWeapon(Item item, MapPlayer whosWeapon, MapPlayer whosStorage){
			var err = IsCanEquip (item, whosWeapon, whosStorage);
			if (err != null) {
				throw new Exception("無法裝備，請檢查:"+err);
			}
			if (whosStorage.Equals (player)) {
				player.storage.Remove (item);
			} else if (whosStorage.Equals (playerInMap)) {
				playerInMap.storage.Remove (item);
			} else {
				storage.Remove (item);
			}

			if (whosWeapon.Equals (player)) {
				player.weapons.Add (item);
			} else if (whosWeapon.Equals (playerInMap)) {
				playerInMap.weapons.Add (item);
			} else {
				throw new Exception ("無法裝備在UnknowPlayer");
			}
		}

		public void UnequipWeapon(Item item, MapPlayer whosWeapon, MapPlayer whosStorage){
			var isCanUnequip = whosWeapon.weapons.IndexOf (item) != -1;
			if (isCanUnequip == false) {
				throw new Exception ("無法拆掉：沒有那個裝備");
			}
			if (whosWeapon.Equals (player)) {
				player.weapons.Remove (item);
			} else if (whosWeapon.Equals (playerInMap)) {
				playerInMap.weapons.Remove (item);
			} else {
				throw new Exception ("無法拆掉裝備在unknow");
			}
			if (whosStorage.Equals (player)) {
				player.storage.Add (item);
			} else if (whosStorage.Equals (playerInMap)) {
				playerInMap.storage.Add (item);
			} else {
				storage.Add (item);
			}
		}
		#endregion

		#region playerInMap
		public void InitPlayerPosition(){
			playerInMap.position.x = 5;
			playerInMap.position.y = 3;
		}
		public void MovePlayerTo(Position pos){
			playerInMap.position = pos;
		}
		#endregion

		#region storage
		public List<Item> storage = new List<Item>();
		public void AddItem(Item item, MapPlayer who){
			if (who.Equals (player)) {
				player.storage = Helper.AddItem (player.storage, item);
			} else if (who.Equals (playerInMap)) {
				playerInMap.storage = Helper.AddItem (playerInMap.storage, item);
			} else {
				storage = Helper.AddItem (storage, item);
			}
		}
		#endregion

		#region fusion
		public void Fusion(Item fusionTarget, MapPlayer who){
			Func<List<Item>, List<Item>> fusion = (storage_)=>{
				var requires = Common.Common.ParseItem (ConfigItem.Get (fusionTarget.prototype).FusionRequire);
				var formatForSubstrct = requires.Select (item => {
					item.count = -(item.count*fusionTarget.count);
					return item;
				});
				var tempStorage = Enumerable.Aggregate (formatForSubstrct, storage_, Helper.AddItem);

				var fusionItem = fusionTarget;
				tempStorage = Helper.AddItem (tempStorage, fusionItem);
				return tempStorage;
			};
			if (who.Equals (player)) {
				throw new Exception("不能在口袋里合成");
			} else if (who.Equals (playerInMap)) {
				playerInMap.storage = fusion (playerInMap.storage);
			} else {
				storage = fusion (storage);
			}
		}

		public int IsCanFusion(string prototype, MapPlayer who){
			if (who.Equals (player)) {
				return Common.Common.IsCanFusion (prototype, player.storage);
			} else if (who.Equals (playerInMap)) {
				return Common.Common.IsCanFusion (prototype, playerInMap.storage);
			} else {
				return Common.Common.IsCanFusion (prototype, storage);
			}
		}
		#endregion

		#region visible map
		public List<Position> isPositionVisible = new List<Position>();
		public IEnumerable<MapObject> VisibleMapObjects(MapDataStore mapData) {
			var posSet = new HashSet<Position> (isPositionVisible);
			var visiblePosition = mapData.mapObjects.Where (obj => {
				return obj.died == false && posSet.Contains(obj.position);
			});
			return visiblePosition;
		}
		public bool VisitPosition(Position pos, int expend){
			var posSet = new HashSet<Position> (isPositionVisible);
			for (var x = -expend; x <= expend; ++x) {
				var yexpend = expend - Math.Abs (x);
				for (var y = -yexpend; y <= yexpend; ++y) {
					var newPos = pos.Add(x, y);
					posSet.Add (newPos);
				}
			}
			var newVisiblePosition = posSet.ToList ();
			var oldCnt = isPositionVisible.Count;
			var isDirty = newVisiblePosition.Count != oldCnt;

			isPositionVisible = newVisiblePosition;
			return isDirty;
		}
		public void ClearVisibleMapObjects(){
			isPositionVisible.Clear ();
		}
		#endregion

		#region store
		public string GetMemonto(){
			string json = JsonUtility.ToJson(this);
			return json;
		}
		public static PlayerDataStore FromMemonto(string json){
			return JsonUtility.FromJson<PlayerDataStore>(json);
		}
		#endregion
	}

	public class Helper{

		public static void CalcAbility(PlayerDataStore player, MapDataStore map,MapPlayer who, ref BasicAbility basic, ref FightAbility fight){
			if (who.weapons == null) {
				return;
			}
			var effects = who.weapons.SelectMany (it => it.Effects);
			var addEffect = effects.Where (ef => ef.EffectOperator == "+" || ef.EffectOperator == "-");
			var multiEffect = effects.Where (ef => ef.EffectOperator == "*");
			// 先處理基本能力
			var tmpBasic = who.basicAbility;
			// 先加減
			tmpBasic = addEffect.Aggregate (tmpBasic, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 後乘除
			tmpBasic = multiEffect.Aggregate (tmpBasic, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 處理後的基本能力轉成戰鬥力
			// 再處理戰鬥力
			var tmpFight = tmpBasic.FightAbility;
			// 先加減
			tmpFight = addEffect.Aggregate (tmpFight, (accu, curr) => {
				return curr.Effect(accu);
			});
			// 後乘除
			tmpFight = multiEffect.Aggregate (tmpFight, (accu, curr) => {
				return curr.Effect (accu);
			});
			basic = tmpBasic;
			fight = tmpFight;
		}

		public static int GetBasicDamage(PlayerDataStore player, MapDataStore map, int mapObjectId){
			var a = player.playerInMap.basicAbility.FightAbility;
			var monsterInfo = map.monsterInfo [map.mapObjects [mapObjectId].infoKey];
			var b = BasicAbility.Get (monsterInfo).FightAbility;
			return (int)(a.atk - b.def);
		}



		public static List<Item> AddItem(List<Item> input, Item item){
			var container = new List<Item> (input);
			var shouldArrange = true;
			var config = ConfigItem.Get (item.prototype);
			var maxCount = config.MaxCount;
			if (item.count < 0) {
				// 處理減
				var allCount = input.Sum (it => {
					return it.prototype == item.prototype ? it.count : 0;
				});
				var isEnougth = allCount + item.count >= 0;
				if (isEnougth == false) {
					throw new MessageException ("道具數量不足");
				}
				shouldArrange = true;
			} else {
				// 處理加
				for (var i = 0; i < container.Count; ++i) {
					var adjItem = container [i];
					if (adjItem.prototype != item.prototype) {
						continue;
					}
					if (adjItem.count + item.count > maxCount) {
						continue;
					}
					adjItem.count += item.count;
					container [i] = adjItem;
					shouldArrange = false;
					break;
				}
			}
			if (shouldArrange == false) {
				return container;
			}
			container.Add (item);
			// 計算同一種類的道具總數
			var sumOfCount = container.Where (obj => {
				return obj.prototype == item.prototype;
			}).Aggregate (0, (sum, obj) => {
				return sum + obj.count;
			});
			// 一個道具在一格中的最大數量限制
			var maxOfItem = maxCount;
			// 依最大限制重新計算分組
			var num = sumOfCount / maxOfItem;
			// 最後一個剩餘
			var remain = sumOfCount % maxOfItem;
			// 將拿來計算的道具抽出來
			var itemExcludeAddedItemPrototype = container.Where (obj => {
				return obj.prototype != item.prototype;
			});
			// 重建要新加入的道具
			var originItem = item;
			originItem.count = maxOfItem;
			var itemsShouldReAdd = Enumerable.Repeat (originItem, num);
			if (remain > 0) {
				originItem.count = remain;
				itemsShouldReAdd = itemsShouldReAdd.Concat (Enumerable.Repeat (originItem, 1));
			}
			// 加回去
			var newItems = itemExcludeAddedItemPrototype.Concat (itemsShouldReAdd);
			return newItems.ToList();
		}
	}
}