using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System.Linq;
using Common;

namespace Model
{
	// 下[Serializable]的話，會自動存入本機和自動讀取，真是奇怪(方便?)的功能
	// 不使用上述的功能
	// 地圖的部分另外存，因為資料量比較大
	// 所以把比較長變動的資料移到PlayerDataStore
	public class MapDataStore{
		#region map
		// Dictionary無法Serializable
		public List<MapObject> mapObjects = new List<MapObject>();
		public List<ResourceInfo> resourceInfo = new List<ResourceInfo>();
		public List<MonsterInfo> monsterInfo = new List<MonsterInfo>();
		//public int width, height;
		/*
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
							GenMonster (player, pos, ConfigMonster.ID_bear);
						}
					} else {
						// ignore
					}
				}
			}
		}
*/
		MapType genMapType;
		public void GenMapStart(MapType type){
			genMapType = type;
		}

		public void GenMapWithPlayerVisible(PlayerDataStore player){
			GenMapWithPositions (mapObjects.Select (o => o.position), player);
		}

		public void GenMapWithPositions(IEnumerable<Position> posList, PlayerDataStore player){
			var factor = 1 / 10f;
			var alreadyPos = new HashSet<Position> (posList);
			foreach (var pos in player.isPositionVisible) {
				if (alreadyPos.Contains (pos)) {
					continue;
				}
				alreadyPos.Add (pos);
				var p = Mathf.PerlinNoise (pos.x * factor, pos.y * factor);
				//Debug.Log (p);
				if (p < 0.8f) {
					if (p < 0.3f) {
						GenResource (player, pos, ConfigResource.ID_rock);
					} else if (p < 0.8f) {
						GenResource (player, pos, ConfigResource.ID_grass);
					}
					// gen monster after assign item
					if (UnityEngine.Random.Range (0, 100) < 25) {
						GenMonster (player, pos, ConfigMonster.ID_bear);
					}
				} else {
					// ignore
				}
			}
		}
		public void ClearMap(){
			mapObjects.Clear ();
			resourceInfo.Clear ();
			monsterInfo.Clear ();
			//width = height = 0;
			genMapType = MapType.Unknown;
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

		public int WorkConsumpation(PlayerDataStore player, Description work){
			return 2;
		}

		public int MoveConsumption(PlayerDataStore player, Position a, Position b){
			if (a.Equals (b)) {
				return 0;
			}
			var offset = b.Add (a.Negative);
			if (Math.Abs (offset.x) > 1 || Math.Abs (offset.y) > 1) {
				return int.MaxValue;
			}
			return 10;
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
				player.AddItem (item, Place.Map);
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
							/*
							var des = Description.Empty;
							des.description = Description.EventLucklyFind;
							des.values = new NameValueCollection();
							des.values.Add("itemPrototype", ConfigItem.ID_wood);
							des.values.Add("count", 10+"");
							accu.Add(des);
							*/
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
			LabelProcessWork:
			switch (work.description) {
			case Description.WorkUseTurnSkill:
				{
					var skillId = work.values.Get ("skillId");
					var skill = ConfigSkill.Get (skillId);
					switch (skill.Effect) {
					case "{0}+{1}":
						player.playerInMap.hp += 20;
						var des = Description.Empty;
						des.description = Description.InfoUseSkill;
						des.values = new NameValueCollection ();
						des.values.Add ("skills", skill.Name);
						ret.Add (des);
						break;
					default:
						throw new Exception ("未處理的回合性招式:"+skill.ID);
					}
				}
				break;
			case Description.WorkCollectResource:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var obj = mapObjects [mapObjectId];
					obj.died = true;
					mapObjects [mapObjectId] = obj;
					var info = resourceInfo [obj.infoKey];
					var config = ConfigResource.Get (info.type);
					var items = Common.Common.ParseItemFromResource (config);
					foreach (var item in items) {
						player.AddItem (item, Place.Map);
					}
					var des = Description.Empty;
					des.description = Description.InfoCollectResource;
					des.values = new NameValueCollection ();
					foreach (var itemJson in items.Select(i=>JsonUtility.ToJson(i))) {
						des.values.Add ("items", itemJson);
					}
					ret.Add (des);

					// 發送任務更新
					foreach (var item in items) {
						player.NotifyMissionAddItemFromCollect (item);
					}

					// 增加採集經驗
					foreach (var item in items) {
						var cfg = ConfigItem.Get (item.prototype);
						if (cfg.SkillType != null) {
							player.playerInMap.AddExp (cfg.SkillType, 1);
						}
					}
				}
				break;
			case Description.WorkAttack:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var mapObject = mapObjects [mapObjectId];
					var monsterInf = monsterInfo[mapObject.infoKey];
					// 怪物逃走了
					if (monsterInf.IsDied) {
						Debug.LogWarning ("怪物已逃走");
						break;
					}
					// === 計算傷害 === //
					var monsterCfg = ConfigMonster.Get(monsterInf.type);
					var monsterAbility = BasicAbility.Get(monsterCfg).FightAbility;
					var playerBasic = BasicAbility.Zero;
					var playerAbility = FightAbility.Zero;
					// 先計算非針對怪物的能力
					Helper.CalcAbility (player, this, Place.Map, ref playerBasic, ref playerAbility);
					// 計算針對怪物的能力，例：如果對像是鳥，攻擊力*1.1之類
					var enforceEff = player.playerInMap.weapons.SelectMany (it => it.Effects).Where(it=>it.EffectOperator=="enforce");
					playerAbility = enforceEff.Aggregate (playerAbility, (accu, curr) => {
						// TODO 實做針對性能力
						return playerAbility;
					});
					// === 技能加成 === //
					var skills = Helper.AvailableSkills (player, Place.Map);
					// 只計算攻擊性技能
					skills = skills.Where (s => s.Condition == ConfigConditionType.ID_attack);
					// 取出發動的技能
					var triggered = skills.Where (s => {
						var rate = (int)(Helper.ComputeSkillTriggerRate (player.playerInMap, s) * 100);
						return UnityEngine.Random.Range(1, 101) < rate;
					});
					// 取出技能效果
					var triggeredEffect = triggered.SelectMany (Common.Common.Effect);
					playerAbility = triggeredEffect.Aggregate(playerAbility, (v,effect)=>{
						switch(effect.EffectOperator){
						case "unknown":
							{
								switch(effect.value){
								default:
									throw new NotImplementedException("未確定的招式:"+effect.value);
								}
							}
						default:
							{
								playerAbility = effect.Effect(playerAbility);
							}
							break;
						}
						return playerAbility;
					});

					// 判斷是否命中
					var accuracyRate = playerAbility.AccuracyRate (monsterAbility);
					var isHit = UnityEngine.Random.Range (1, 101) < (int)(accuracyRate * 100);
					if (isHit == false) {
						var des = Description.Empty;
						// === 回傳使用招式 === //
						if (triggered.Count () > 0) {
							des = Description.Empty;
							des.description = Description.InfoUseSkill;
							des.values = new NameValueCollection ();
							foreach (var s in triggered) {
								des.values.Add ("skills", s.Name);
							}
							ret.Add (des);
						}

						// === 回傳怪物回避攻擊 === //
						des = Description.Empty;
						des.description = Description.InfoMonsterDodge;
						des.values = new NameValueCollection ();
						des.values.Set ("mapObjectId", mapObjectId + "");
						ret.Add (des);
					} else {
						// 總傷害
						var damage = playerAbility.Damage (monsterAbility);
						var criRate = playerAbility.CriticalHitRate (monsterAbility);
						var isCriHit = UnityEngine.Random.Range (1, 101) < (int)(criRate * 100);
						if (isCriHit) {
							damage = (int)(damage*1.5f);
						}
						// === 套用傷害 === //
						monsterInf.hp -= Math.Max (0, damage);
						// 計算仇恨值
						monsterInf.BeAttacked (Math.Max (0, damage));
						if (monsterInf.IsDied) {
							mapObject.died = true;
							// 獲得獎勵
							var rewards = Common.Common.ParseItem (monsterCfg.Item);
							player.playerInMap.storage = rewards.Aggregate (player.playerInMap.storage, Helper.AddItem);
						}
						// === 套用結果 === //
						monsterInfo [mapObject.infoKey] = monsterInf;
						mapObjects [mapObjectId] = mapObject;

						// 增加武器經驗
						foreach (var item in player.playerInMap.weapons) {
							var cfg = ConfigItem.Get (item.prototype);
							if (cfg.Position != ConfigWeaponPosition.ID_hand) {
								continue;
							}
							if (cfg.SkillType != null) {
								player.playerInMap.AddExp (cfg.SkillType, 1);
							}
						}
						// === 處理武器壞掉 === //
						// 注意：使用ToList將陣列Copy
						var brokenWeapons = player.playerInMap.CheckHandWeaponBroken ().ToList ();
						// 刪除壞掉武器
						foreach (var broken in brokenWeapons) {
							player.playerInMap.weapons.Remove (broken);
						}
						// ====== 以下處理回傳 ====== //
						var des = Description.Empty;
						// === 回傳使用招式 === //
						if (triggered.Count () > 0) {
							des = Description.Empty;
							des.description = Description.InfoUseSkill;
							des.values = new NameValueCollection ();
							foreach (var s in triggered) {
								des.values.Add ("skills", s.Name);
							}
							ret.Add (des);
						}

						// === 回傳攻擊資訊 === //
						des = Description.Empty;
						des.description = Description.InfoAttack;
						des.values = new NameValueCollection ();
						des.values.Set ("mapObjectId", mapObjectId + "");
						des.values.Set ("damage", damage + "");
						des.values.Set ("isCriHit", isCriHit ? "1": "0");
						ret.Add (des);

						// === 回傳怪物死亡 === //
						if (monsterInf.IsDied) {
							des = Description.Empty;
							des.description = Description.InfoMonsterDied;
							des.values = new NameValueCollection ();
							des.values.Set ("mapObjectId", mapObjectId + "");
							// 獎勵資訊
							var rewards = Common.Common.ParseItem (monsterCfg.Item);
							foreach (var json in rewards.Select(i=>JsonUtility.ToJson(i))) {
								des.values.Add ("rewards", json);
							}
							ret.Add (des);
						}

						// === 回傳壞掉資訊 === //
						if (brokenWeapons.Count () > 0) {
							des = Description.Empty;
							des.description = Description.InfoWeaponBroken;
							des.values = new NameValueCollection ();
							foreach (var broken in brokenWeapons) {
								var jsonstr = JsonUtility.ToJson (broken);
								des.values.Add ("items", jsonstr);
							}
							ret.Add (des);
						}
					}
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
					Helper.CalcAbility (player, this, Place.Map, ref playerBasic, ref playerAbility);
					// 計算針對怪物的能力，例：如果對像是鳥，防禦力*1.1之類
					var enforceEff = player.playerInMap.weapons.SelectMany (it => it.Effects).Where(it=>it.EffectOperator=="enforce");
					playerAbility = enforceEff.Aggregate (playerAbility, (accu, curr) => {
						// TODO 實做針對性能力
						return playerAbility;
					});
					// 判斷是否命中
					var accuracyRate = playerAbility.AccuracyRate (monsterAbility);
					var isHit = UnityEngine.Random.Range (1, 101) < (int)(accuracyRate * 100);
					if (isHit == false) {
						// === 回傳回避攻擊 === //
						var des = Description.Empty;
						des.description = Description.InfoDodge;
						des.values = new NameValueCollection ();
						des.values.Set ("mapObjectId", mapObjectId + "");
						ret.Add (des);
						// 回避會增加速度經驗
						player.playerInMap.AddExp (ConfigAbility.ID_speed, 1);

					} else {
						var des = Description.Empty;

						// === 技能加成 === //
						var skills = Helper.AvailableSkills (player, Place.Map);
						// 只計算防禦性技能
						skills = skills.Where (s => s.Condition == ConfigConditionType.ID_deffence);
						// 取出發動的技能
						var triggered = skills.Where (s => {
							var rate = (int)(Helper.ComputeSkillTriggerRate (player.playerInMap, s) * 100);
							return UnityEngine.Random.Range(1, 101) < rate;
						});
						if (triggered.Count () > 0) {
							var onlyOneSkillCanTrigger = triggered.First ();
							switch (onlyOneSkillCanTrigger.Effect) {
							case "取消對方的攻擊，並對對方造成{1}倍普攻傷害.":
								{
									var counterDamage = playerAbility.Damage (monsterAbility);
									monsterInf.hp -= counterDamage;
									if (monsterInf.IsDied) {
										mapObject.died = true;
									}
									mapObjects [mapObjectId] = mapObject;
									monsterInfo [mapObject.infoKey] = monsterInf;

									des = Description.Empty;
									des.description = Description.InfoUseSkill;
									des.values = new NameValueCollection ();
									des.values.Add ("skills", onlyOneSkillCanTrigger.Name);
									ret.Add (des);
								}
								goto LabelProcessWork;
							case "取消對方的攻擊.":
								{
									des = Description.Empty;
									des.description = Description.InfoUseSkill;
									des.values = new NameValueCollection ();
									des.values.Add ("skills", onlyOneSkillCanTrigger.Name);
									ret.Add (des);
								}
								goto LabelProcessWork;
							}
						}


						var damage = monsterAbility.Damage (playerAbility);
						var criRate = playerAbility.CriticalHitRate (monsterAbility);
						var isCriHit = UnityEngine.Random.Range (1, 101) < (int)(criRate * 100);
						if (isCriHit) {
							damage = (int)(damage*1.5f);
						}
						player.playerInMap.hp -= Math.Max (0, damage);
						// 計算仇恨值
						monsterInf.AttackYou (playerAbility, Math.Max (0, damage));
						// 套用
						monsterInfo [mapObject.infoKey] = monsterInf;

						des.description = Description.InfoMonsterAttack;
						des.values = new NameValueCollection ();
						des.values.Set ("mapObjectId", mapObjectId + "");
						des.values.Set ("damage", damage + "");
						des.values.Set ("isCriHit", isCriHit ? "1": "0");
						ret.Add (des);

						if (player.playerInMap.IsDied == false) {
							// 增加防具經驗
							foreach (var item in player.playerInMap.weapons) {
								var cfg = ConfigItem.Get (item.prototype);
								if (cfg.Position == ConfigWeaponPosition.ID_hand) {
									continue;
								}
								if (cfg.SkillType != null) {
									player.playerInMap.AddExp (cfg.SkillType, 1);
								}
							}
						}
					}
				}
				break;
			case Description.EventMonsterEscape:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var mapObject = mapObjects [mapObjectId];
					var monsterInf = monsterInfo[mapObject.infoKey];
					monsterInf.hp = 0;
					monsterInfo [mapObject.infoKey] = monsterInf;

					var des = Description.Empty;
					des.description = Description.InfoMonsterEscape;
					des.values = new NameValueCollection ();
					des.values.Set ("mapObjectId", mapObjectId + "");
					ret.Add (des);
				}
				break;
			case Description.EventMonsterIdle:
				{
					var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
					var mapObject = mapObjects [mapObjectId];
					var monsterInf = monsterInfo[mapObject.infoKey];
					monsterInf.hp = 0;
					monsterInfo [mapObject.infoKey] = monsterInf;

					var des = Description.Empty;
					des.description = Description.InfoMonsterIdle;
					des.values = new NameValueCollection ();
					des.values.Set ("mapObjectId", mapObjectId + "");
					ret.Add (des);
				}
				break;
			default:
				throw new NotImplementedException (work.description);
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
							// 怪物已死亡，不產生任何動作
							if (info.IsDied) {
								break;
							}
							// 增減勇氣值
							info.StepBrave();
							info.StepHate();
							monsterInfo[currItem.infoKey] = info;

							var cfg = ConfigMonster.Get(info.type);
							var ability = BasicAbility.Get(cfg);
							var fightAbility = ability.FightAbility;
							var priority = fightAbility.dodge;

							var thinking = Helper.MonsterThink(this, player, currItem.key);
							switch(thinking){
							case MonsterThinking.None:
								{
									var action = Description.Empty;
									action.description = Description.EventMonsterIdle;
									action.values = new NameValueCollection();
									action.values.Add("mapObjectId", currItem.key+"");

									var ret = Interaction.Empty;
									ret.description = action;
									ret.priority = priority;
									actions.Add(ret);
								}
								break;
							case MonsterThinking.AttackYou:
								{
									var action = Description.Empty;
									action.description = Description.EventMonsterAttackYou;
									action.values = new NameValueCollection();
									action.values.Add("mapObjectId", currItem.key+"");

									var ret = Interaction.Empty;
									ret.description = action;
									ret.priority = priority;
									actions.Add(ret);
								}
								break;
							case MonsterThinking.Escape:
								{
									var action = Description.Empty;
									action.description = Description.EventMonsterEscape;
									action.values = new NameValueCollection();
									action.values.Add("mapObjectId", currItem.key+"");

									var ret = Interaction.Empty;
									ret.description = action;
									ret.priority = priority;
									actions.Add(ret);
								}
								break;
							}
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
			if (player.playerInMap.IsDied) {
				throw new Exception ("冒險掛點，無法工作");
			}
			if (player.playerInMap.IsWorking) {
				throw new MessageException ("目前有工作在身:"+work.description);
			}
			var consumpation = WorkConsumpation (player, work);
			if (player.playerInMap.hp <= consumpation) {
				throw new Exception ("體力不足，無法工作");
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
			if (player.playerInMap.IsDied) {
				throw new Exception ("冒險掛點，無法工作");
			}
			if (player.playerInMap.IsWorking == false) {
				throw new MessageException ("沒有工作，不能應用");
			}
			player.playerInMap.ClearWork ();
			// 回合性招式
			var turnSkills = 
				Helper.AvailableSkills (player, Place.Map)
					.Where(s=>s.Condition == ConfigConditionType.ID_turn)
					.Select(MakeTurnSkillWork)
					.Select(w=>MakeInteraction(player,w));
			var work = player.playerInMap.currentWork;
			// 將工作轉為互動
			var interaction = MakeInteraction (player, work);
			// 取得場景互動
			var envirInteraction = GetInteraction (player);
			// 匯總所有互動
			var allInter = envirInteraction.Concat (Enumerable.Repeat (interaction, 1)).Concat(turnSkills);
			// 依優先權處理互動
			var ret = ApplyInteraction (player, allInter);
			// 減體力, 這裡可能導致冒險者死亡
			var consumpation = WorkConsumpation (player, work);
			player.AddPlayerHp (this, -consumpation);
			return ret;
		}

		static Description MakeTurnSkillWork(ConfigSkill skill){
			var des = Description.Empty;
			des.description = Description.WorkUseTurnSkill;
			des.values.Set ("skillId", skill.ID);
			return des;
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

	public class PlayerDataStore
	{
		public MapPlayer playerInStorage = MapPlayer.Empty;
		public MapPlayer player = MapPlayer.Empty;
		public MapPlayer playerInMap = MapPlayer.Empty;

		public MapPlayer GetMapPlayer (Place place){
			switch (place) {
			case Place.Home:
				return playerInStorage;
			case Place.Pocket:
				return player;
			case Place.Map:
				return playerInMap;
			}
			throw new Exception ("xxx:"+place.ToString());
		}

		public void AddPlayerHp(MapDataStore map, int v){
			var basic = BasicAbility.Zero;
			var fight = FightAbility.Zero;
			Helper.CalcAbility (this, map, Place.Map, ref basic, ref fight);
			var maxHp = (int)fight.hp;
			playerInMap.hp += v;
			if (playerInMap.hp >= maxHp) {
				playerInMap.hp = maxHp;
			}
			if (playerInMap.hp < 0) {
				playerInMap.hp = 0;
			}
		}

		#region skill
		public void EquipSkill (Place who, string skillId){
			switch (who) {
			case Place.Home:
			case Place.Pocket:
				player.AddSkill (skillId);
				break;
			case Place.Map:
				playerInMap.AddSkill (skillId);
				break;
			default:
				throw new Exception ("EquipSkill:"+skillId);
			}
		}

		public void UnequipSkill (Place who, string skillId){
			switch (who) {
			case Place.Home:
			case Place.Pocket:
				player.RemoveSkill (skillId);
				break;
			case Place.Map:
				playerInMap.RemoveSkill (skillId);
				break;
			default:
				throw new Exception ("EquipSkill:"+skillId);
			}
		}
		#endregion

		#region weapon
		public string IsCanEquip(Item item, Place who, Place whosStorage){
			if (who == Place.Home) {
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
				whosStorage == Place.Pocket ? player.storage :
				whosStorage == Place.Map ? playerInMap.storage :
				playerInStorage.storage;
			var useWeapon = 
				whosStorage == Place.Pocket ? player.weapons :
				playerInMap.weapons;
			return canEquip (useWeapon, useStorage);
		}

		public void EquipWeapon(Item item, Place whosWeapon, Place whosStorage){
			var err = IsCanEquip (item, whosWeapon, whosStorage);
			if (err != null) {
				throw new Exception("無法裝備，請檢查:"+err);
			}
			if (whosStorage == Place.Pocket) {
				player.storage.Remove (item);
			} else if (whosStorage == Place.Map) {
				playerInMap.storage.Remove (item);
			} else {
				playerInStorage.storage.Remove (item);
			}

			if (whosWeapon == Place.Pocket) {
				player.weapons.Add (item);
			} else if (whosWeapon == Place.Map) {
				playerInMap.weapons.Add (item);
			} else {
				throw new Exception ("無法裝備在Place.Home");
			}
		}

		public void UnequipWeapon(Item item, Place whosWeapon, Place whosStorage){
			if (whosWeapon == Place.Pocket) {
				var isCanUnequip = player.weapons.IndexOf (item) != -1;
				if (isCanUnequip == false) {
					throw new Exception ("無法拆掉：沒有那個裝備");
				}
				player.weapons.Remove (item);
			} else if (whosWeapon == Place.Map) {
				var isCanUnequip = playerInMap.weapons.IndexOf (item) != -1;
				if (isCanUnequip == false) {
					throw new Exception ("無法拆掉：沒有那個裝備");
				}
				playerInMap.weapons.Remove (item);
			} else {
				throw new Exception ("無法拆掉裝備在unknow");
			}
			if (whosStorage == Place.Pocket) {
				player.storage.Add (item);
			} else if (whosStorage == Place.Map) {
				playerInMap.storage.Add (item);
			} else {
				playerInStorage.storage.Add (item);
			}
		}
		#endregion

		#region playerInMap
		public void InitPlayerPosition(){
			playerInMap.position.x = 5;
			playerInMap.position.y = 3;
		}
		public MoveResult Move(MapDataStore mapData, Position offset, ref bool mapDirtyFlag, ref bool playerDirtyFlag){
			if (playerInMap.IsDied) {
				throw new Exception ("冒險者掛點，無法移動");
			}
			if (playState != PlayState.Play) {
				throw new Exception ("這時必須是Play狀態，請檢查程式:"+playState.ToString());
			}
			var originPos = playerInMap.position;
			var newPos = originPos.Add (offset);
			var moveConsumpation = mapData.MoveConsumption (this, originPos, newPos);
			if (playerInMap.hp - moveConsumpation < 0) {
				throw new Exception ("體力不足，無法移動:"+playerInMap.hp);
			}
			MoveResult rs = MoveResult.Empty;
			var isPositionDirty = newPos.Equals (playerInMap.position) == false;
			// 移動位置
			playerInMap.position = newPos;
			// 新增視野
			var isMapDirty = VisitPosition (playerInMap.position, 3);
			// 產生事件
			var events = mapData.GenEvent (this, newPos);
			if (isMapDirty) {
				// 生成新地圖
				mapData.GenMapWithPlayerVisible (this);
			}
			if (isPositionDirty) {
				// 增加移動經驗
				playerInMap.AddExp (ConfigAbility.ID_move, 1);
				// 體力減少
				playerInMap.hp -= moveConsumpation;
			}
			// 準備回傳物件
			rs.isMoveSuccess = isPositionDirty;
			rs.events = events.ToList();

			mapDirtyFlag = isMapDirty;
			playerDirtyFlag = isPositionDirty;
			return rs;
		}
		#endregion

		#region storage
		//public List<Item> storage = new List<Item>();
		public void AddItem(Item item, Place who){
			switch (who) {
			case Place.Home:
				playerInStorage.storage = Helper.AddItem (playerInStorage.storage, item);
				// 從家裡新增的Item才要更新任務
				NotifyMissionAddItem (item);
				break;
			case Place.Pocket:
				player.storage = Helper.AddItem (player.storage, item);
				break;
			case Place.Map:
				playerInMap.storage = Helper.AddItem (playerInMap.storage, item);
				break;
			default:
				throw new Exception (who.ToString ());
			}
		}
		public void MoveItem(Place a, Place b, Item item){
			List<Item> fromStorage;
			switch (a) {
			case Place.Home:
				fromStorage = playerInStorage.storage;
				break;
			case Place.Pocket:
				fromStorage = player.storage;
				break;
			case Place.Map:
				throw new Exception ("冒險中不能移動道具");
			default:
				throw new Exception ("XXX");
			}
			if (fromStorage.Contains (item) == false) {
				throw new Exception ("沒有這個道具，不能移動:"+item);
			}
			fromStorage.Remove (item);
			switch (b) {
			case Place.Home:
				playerInStorage.storage = Helper.AddItem (playerInStorage.storage, item);
				break;
			case Place.Pocket:
				player.storage = Helper.AddItem (player.storage, item);
				break;
			case Place.Map:
				throw new Exception ("道具不能直接移動到冒險者");
			default:
				throw new Exception ("XXX");
			}
		}
		#endregion
		#region fusion
		public void Fusion(Item fusionTarget, Place who){
			Func<List<Item>, List<Item>> fusion = (storage_)=>{
				var requires = Common.Common.ParseItem (ConfigItem.Get (fusionTarget.prototype).FusionRequire);
				var formatForSubstrct = requires.Select (item => {
					item.count = -(item.count*fusionTarget.count);
					return item;
				});
				var tempStorage = Enumerable.Aggregate (formatForSubstrct, storage_, Helper.AddItem);

				var fusionItem = fusionTarget;
				tempStorage = Helper.AddItem (tempStorage, fusionItem);

				if(who == Place.Home){
					// 從家裡新增的Item才要更新任務
					NotifyMissionAddItem (fusionItem);
				}
				return tempStorage;
			};
			if (who == Place.Pocket) {
				throw new Exception("不能在口袋里合成");
				//player.storage = fusion (player.storage);
			} else if (who == Place.Map) {
				playerInMap.storage = fusion (playerInMap.storage);
			} else {
				playerInStorage.storage = fusion (playerInStorage.storage);
			}
		}

		public int IsCanFusion(string prototype, Place who){
			if (who == Place.Pocket) {
				return Common.Common.IsCanFusion (player, prototype, player.storage);
			} else if (who == Place.Map) {
				return Common.Common.IsCanFusion (playerInMap, prototype, playerInMap.storage);
			} else {
				return Common.Common.IsCanFusion (playerInStorage, prototype, playerInStorage.storage);
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

		#region status
		public int money;
		public int advLevel;
		public PlayState playState;

		public void ClearPlayState(){
			playState = PlayState.Home;
		}
		public void EnterMap(MapDataStore map){
			if (playState != PlayState.Home) {
				throw new Exception ("這時必須是Home狀態，請檢查程式:"+playState.ToString());
			}
			// 轉移道具
			playerInMap.GetData (player);
			// 回滿體力
			AddPlayerHp (map, 99999999);
			playState = PlayState.Play;
		}

		public void ExitMap(){
			player.GetData (playerInMap);
			playState = PlayState.Home;
		}
		#endregion

		#region mission
		// 領取過的任務
		public List<string> missions = new List<string>();
		// 完成的任務
		public List<string> completedMission = new List<string>();
		// 執行中的任務與狀態，完成後要從這個列表移除
		public List<NpcMission> missionStatus = new List<NpcMission>();

		public bool MissionCompleted(string id){
			return completedMission.Contains (id);
		}

		public IEnumerable<string> AvailableNpcMissions {
			get {
				return 
					Enumerable.Range (0, ConfigNpcMission.ID_COUNT)
						.Select (ConfigNpcMission.Get)
						.Where (cfg => cfg.Level <= advLevel)
						.Where(cfg=>MissionCompleted(cfg.ID) == false)
						.Where (cfg => {
							if (cfg.Dependency != null) {
								var items = Common.Common.ParseAbstractItem (cfg.Dependency);
								foreach (var item in items) {
									var missionId = item.prototype;
									var isCompleted = MissionCompleted (missionId);
									if (isCompleted == false) {
										return false;
									}
								}
								return true;
							}
							return true;
						})
						.Select (cfg => cfg.ID);
			}
		}
		/// <summary>
		/// 領取任務
		/// </summary>
		/// <param name="id">Identifier.</param>
		public void AcceptMission(string id){
			var cfg = ConfigNpcMission.Get(id);
			if (cfg.Level > advLevel) {
				throw new Exception ("等級不足");
			}
			if (missions.Exists (i => {
				return i == id;
			})) {
				Debug.LogWarning ("任務已領取:"+id);
				return;
			}
			missions.Add (id);

			var mission = NpcMission.Default;
			mission.prototype = id;
			missionStatus.Add (mission);
		}

		public void NotifyMissionAddItemFromCollect(Item item){
			for (var i = 0; i < missionStatus.Count; ++i) {
				missionStatus [i].itemGot.Add (item);
			}
		}

		public void NotifyMissionAddItem(Item item){
			// ignore
		}

		public void NotifyMissionMonsterKill(string monsterPrototype){
			for (var i = 0; i < missionStatus.Count; ++i) {
				missionStatus [i].monsterSkilled.Add (monsterPrototype);
			}
		}

		/// <summary>
		/// 判斷任務是否完成，每次互動後可以呼叫一次
		/// </summary>
		/// <returns>完成的任務</returns>
		public List<string> CheckMissionStatus(){
			var completedMission = new List<string> ();
			for (var i = 0; i < missionStatus.Count; ++i) {
				var mission = missionStatus [i];
				var cfg = ConfigNpcMission.Get (mission.prototype);
				if (cfg.RequireItem != null) {
					var isCompleted = true;
					var requireItems = Common.Common.ParseItem (cfg.RequireItem);
					foreach (var requireItem in requireItems) {
						var itemCount = mission.itemGot
							.Where(item=>item.prototype == requireItem.prototype)
							.Sum(item=>item.count);
						if (itemCount < requireItem.count) {
							isCompleted = false;
							break;
						}
					}
					if (isCompleted) {
						completedMission.Add (mission.prototype);
					}
				}

				if (cfg.RequireKill != null) {
					var isCompleted = true;
					var requireItems = Common.Common.ParseAbstractItem (cfg.RequireKill);
					foreach (var requireItem in requireItems) {
						var itemCount = mission.monsterSkilled
							.Where (id => id == requireItem.prototype)
							.Count ();
						if (itemCount < requireItem.count) {
							isCompleted = false;
							break;
						}
					}
					if (isCompleted) {
						completedMission.Add (mission.prototype);
					}
				}

				if (cfg.RequireStatus != null) {
					var isCompleted = true;
					var requireItems = Common.Common.ParseAbstractItem (cfg.RequireKill);
					foreach (var requireItem in requireItems) {
						if (requireItem.prototype == "money") {
							// TODO
						}
					}
					if (isCompleted) {
						completedMission.Add (mission.prototype);
					}
				}
			}
			return completedMission;
		}
		/// <summary>
		/// 將呼叫CheckMissionStatus取得的任務輸入這個方法，完成那個任務並取得獲得的獎勵資訊
		/// </summary>
		/// <returns>The mission.</returns>
		/// <param name="id">Identifier.</param>
		public IEnumerable<AbstractItem> CompleteMission(string id){
			if (missions.Contains (id) == false) {
				throw new Exception ("這個任務沒有領取:"+id);
			}
			if (completedMission.Contains (id)) {
				throw new Exception ("這個任務已完成過了:"+id);
			}
			var checkAgain = CheckMissionStatus ().Contains (id);
			if (checkAgain == false) {
				throw new Exception ("這個任務還沒達成條件:"+id);
			}
			completedMission.Add (id);
			// 刪去任務狀態
			for (var i = 0; i < missionStatus.Count; ++i) {
				var m = missionStatus [i];
				if (m.prototype == id) {
					missionStatus.RemoveAt (i);
					break;
				}
			}
			var cfg = ConfigNpcMission.Get (id);
			var rewards = Common.Common.ParseAbstractItem (cfg.Reward);
			foreach (var reward in rewards) {
				switch (reward.prototype) {
				case "money":
					{
						// TODO
					}
					break;
				default:
					{
						AddItem (reward.Item, Place.Pocket);
					}
					break;
				}
			}
			return rewards;
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
		public static MonsterThinking MonsterThink(MapDataStore map, PlayerDataStore player, int monsterId){
			var objInfo = map.mapObjects [monsterId];
			var monsterInfo = map.monsterInfo [objInfo.infoKey];
			//var cfg = ConfigMonster.Get (monsterInfo.type);
			// 想要攻擊主要是仇恨值
			var wantAttack = 
				monsterInfo.NormalHate * 0.8f + 
				monsterInfo.NormalHate > 0 ? (monsterInfo.NormalBrave*0.2f) : 0;
			var wantEscape = 1 - (
				monsterInfo.NormalBrave * (2/3f) +
				monsterInfo.NormalHate * (1/3f)
			);

			var actions = new MonsterThinking[] {
				MonsterThinking.AttackYou, MonsterThinking.Escape
			};
			var values = new float[]{ wantAttack, wantEscape };
			var selectValue = values.OrderByDescending (v => v).First ();
			if (selectValue < 0.2) {
				return MonsterThinking.None;
			}
			for (var i = 0; i < values.Length; ++i) {
				if (selectValue == values [i]) {
					return actions [i];
				}
			}
			throw new Exception ("必須要回傳一個動作");
		}

		/// <summary>
		/// 計算招式發動率
		/// </summary>
		/// <returns>The trigger rate.</returns>
		/// <param name="who">Who.</param>
		/// <param name="skill">Skill.</param>
		public static float ComputeSkillTriggerRate(MapPlayer who, ConfigSkill skill){
			var ais = Common.Common.ParseAbstractItem (skill.SkillTypeRequire);
			var needExp = ais.Sum (ai => ai.count);
			var maxExp = needExp << 1;
			var haveExp = ais.Sum (ai => who.Exp(ai.prototype));
			var rate = (float)(haveExp - needExp) / (maxExp - needExp);
			var bouns = skill.TriggerBouns;
			return rate + bouns;
		}

		/// <summary>
		/// 取得可用招式列表
		/// </summary>
		/// <returns>The skills.</returns>
		/// <param name="player">Player.</param>
		/// <param name="who">Who.</param>
		public static IEnumerable<ConfigSkill> AvailableSkills(PlayerDataStore player, Place who_){
			var who = player.GetMapPlayer (who_);
			// 先取得欄位上的招式
			var slotSkills = who.skills.Select (ConfigSkill.Get);
			var handWeapons = who.weapons.Select(i=>ConfigItem.Get(i.prototype)).Where(i=>i.Position == ConfigWeaponPosition.ID_hand);
			var hasHandWeapons = handWeapons.Count () > 0;
			if (hasHandWeapons == false) {
				return slotSkills;
			}
			// 再取得武器本身的招式
			var skills = Enumerable
				.Range(0, ConfigSkill.ID_COUNT)
				.Select(ConfigSkill.Get);
			var weaponSkills = handWeapons.SelectMany (w => {
				return skills.Where(s=>{
					return s.SlotCount == 0 && s.SkillTypeRequire.Contains(w.SkillType);
				});
			}).Distinct();
			return slotSkills.Concat (weaponSkills);

			/*
			var skills = Enumerable
				.Range(0, ConfigSkill.ID_COUNT)
				.Select(ConfigSkill.Get);
			var who = player.GetMapPlayer (who_);
			var weapons = who.weapons;
			var useWeaponTypes = weapons.Select (i => ConfigItem.Get (i.prototype).SkillType);
			return skills.Where (cfg => {
				// 判斷技能類型需求
				// 比如：需要拳術5級和劍術3級
				var ais = Common.Common.ParseAbstractItem(cfg.SkillTypeRequire);
				foreach(var ai in ais){
					var skillType = ai.prototype;
					var skillLevel = ai.count;
					// 其中一項不符就回傳
					if(who.Exp(skillType) < skillLevel){
						return false;
					}
				}
				// 判斷這個技能是不是需要武器
				var isNeedWeapon = cfg.SlotCount == 0;
				if(isNeedWeapon == true){
					// 以第一個需求技能的代表武器為主
					var firstSkill = ais.FirstOrDefault();
					// 有需要武器一定要有所需技能類型
					var isInvalidConfig = firstSkill.Item.Equals(Item.Empty);
					if(isInvalidConfig){
						throw new Exception("錯誤的設定:"+cfg.SkillTypeRequire);
					}
					var skillType = firstSkill.prototype;
					// 判斷有沒有裝備該類技能類型的武器
					var isMatch = useWeaponTypes.Where(st=>st==skillType).Count()>0;
					if(isMatch == false){
						return false;
					}
				} else {
					// slot的招式
					// TODO 判斷有沒有裝備這個招式
				}
				return true;
			});
			*/
		}
		/// <summary>
		/// 計算基礎能力和戰鬥能力
		/// </summary>
		/// <param name="player">Player.</param>
		/// <param name="map">Map.</param>
		/// <param name="who">Who.</param>
		/// <param name="basic">Basic.</param>
		/// <param name="fight">Fight.</param>
		public static void CalcAbility(PlayerDataStore player, MapDataStore map, Place who_, ref BasicAbility basic, ref FightAbility fight){
			if (who_ == Place.Home) {
				throw new Exception ("計算能力時不能傳入UnknowPlayer");
			}
			var who = player.GetMapPlayer (who_);

			var tmpBasic = BasicAbility.Default;
			var skillbonus = Enumerable.Range (0, ConfigSkillType.ID_COUNT).Select (ConfigSkillType.Get)
				.Select (cfg => cfg.ID).Select (ConfigAbility.Get)
				.Select (cfg => {
					var exp = who.Exp(cfg.ID);
					var bonus = new BasicAbility(){
						str = cfg.Str,
						vit = cfg.Vit,
						agi = cfg.Agi,
						dex = cfg.Dex,
						Int = cfg.Int,
						luc = cfg.Luc
					};
					return bonus.Multiply(exp);
			})
				.Aggregate (BasicAbility.Zero, (total, cur) => {
					return total.Add(cur);
			});
			tmpBasic = tmpBasic.Add(skillbonus);
			tmpBasic = tmpBasic.Add(who.basicAbility);
			if (who.weapons == null) {
				throw new Exception ("weapon不該為null");
			}
			var effects = who.weapons.SelectMany (it => it.Effects);
			var addEffect = effects.Where (ef => ef.EffectOperator == "+" || ef.EffectOperator == "-");
			var multiEffect = effects.Where (ef => ef.EffectOperator == "*");
			// 先處理基本能力
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
		/// <summary>
		/// 計算普攻傷害
		/// </summary>
		/// <returns>The basic damage.</returns>
		/// <param name="player">Player.</param>
		/// <param name="map">Map.</param>
		/// <param name="mapObjectId">Map object identifier.</param>
		public static int GetBasicDamage(PlayerDataStore player, MapDataStore map, int mapObjectId){
			var a = player.playerInMap.basicAbility.FightAbility;
			var monsterInfo = map.monsterInfo [map.mapObjects [mapObjectId].infoKey];
			var b = BasicAbility.Get (monsterInfo).FightAbility;
			return (int)(a.atk - b.def);
		}

		public static Func<int> GetMaxCountFromItem(Item item){
			return () => {
				var config = ConfigItem.Get (item.prototype);
				var maxCount = config.MaxCount;
				return maxCount;
			};
		}

		public static List<Item> AddItem(List<Item> input, Item item){
			return AddItemWithFn (input, item, GetMaxCountFromItem (item));
		}

		/// <summary>
		/// 加入道具到指定列表
		/// </summary>
		/// <returns>The item.</returns>
		/// <param name="input">Input.</param>
		/// <param name="item">Item.</param>
		public static List<Item> AddItemWithFn(List<Item> input, Item item, Func<int> maxCountFn){
			var container = new List<Item> (input);
			var shouldArrange = true;
			var maxCount = maxCountFn ();
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