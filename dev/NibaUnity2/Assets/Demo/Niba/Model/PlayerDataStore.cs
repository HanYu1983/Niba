using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System.Linq;

namespace Niba
{

    /// <summary>
    /// 使用Serializable在struct時，對JsonUtility.FromJson的支援度很像不太完整
    /// 會有其怪的問題，比如
    /// class A{
    /// 	MapPlayer a, b; // MapPlayer is struct
    /// }
    /// 在解析回來後，裡面如果有陣列的話，陣列的值很像會指到同一個
    /// 所以要將MapPlayer改為class
    /// </summary>
    [Serializable]
    public class MapPlayer
    {
        public Position position;
        public BasicAbility basicAbility;
        public int hp, mp;
        public bool IsDied
        {
            get
            {
                return hp <= 0;
            }
        }
        // 注意: 非公開的變數無法序列化成JSON. 必須加上[SerializeField]標示
        [SerializeField]
        List<Item> storage = new List<Item>();
        public List<Item> Storage { get { return storage; } }
        // === work === //
        public Description currentWork;
        public long workFinishedTime;
        public bool IsWorking
        {
            get
            {
                return DateTime.Now.Ticks < workFinishedTime;
            }
        }
        public void ClearWork()
        {
            workFinishedTime = 0;
        }
        // === weapon === //
        [SerializeField]
        List<Item> weapons = new List<Item>();
        public List<Item> Weapons { get { return weapons; } }
        /// <summary>
        /// 判斷武器有沒有壞，每次擊中對手時呼叫
        /// </summary>
        /// <returns>壞掉的武器</returns>
        public IEnumerable<Item> CheckHandWeaponBroken()
        {
            return Alg.CheckHandWeaponBroken(weapons);
        }
        /// <summary>
        /// 判斷防具有沒有壞，每次被擊中時呼叫
        /// </summary>
        /// <returns>壞掉的防具</returns>
        public IEnumerable<Item> CheckElseWeaponBroken()
        {
            return Alg.CheckElseWeaponBroken(weapons);
        }
        // === skill exp === //
        [SerializeField]
        List<AbstractItem> exps = new List<AbstractItem>();
        public void AddExp(string id, int exp)
        {
            var ai = new AbstractItem()
            {
                prototype = id,
                count = exp
            };
            Alg.AddItem(exps, ai);
        }
        public int Exp(string skillType)
        {
            var ai = exps.Where(i => i.prototype == skillType).FirstOrDefault();
            if (ai.Equals(AbstractItem.Empty))
            {
                return 0;
            }
            return ai.count;
        }
        public int MaxSkillSlotCount
        {
            get
            {
                if (exps == null)
                {
                    Debug.LogWarning("exps還沒初始化, 回傳0");
                    return 0;
                }
                var total = exps.Sum(i => i.count) / 5;
                return total;
            }
        }

        // === skill === //
        [SerializeField]
        List<string> skills = new List<string>();
        public List<string> Skills { get { return skills; } }
        public void AddSkill(string id)
        {
            if (skills.Contains(id))
            {
                throw new Exception(string.Format("招式已裝備:{0}", id));
            }
            var cfg = ConfigSkill.Get(id);
            var totalCnt = cfg.SlotCount + SkillSlotUsed;
            if (totalCnt > MaxSkillSlotCount)
            {
                throw new Exception(string.Format("招式欄位不足:{0}/{1}, 所新加招式為{2}", totalCnt, MaxSkillSlotCount, id));
            }
            skills.Add(id);
        }
        public void RemoveSkill(string id)
        {
            if (skills.Contains(id) == false)
            {
                throw new Exception(string.Format("招式已取消", id));
            }
            skills.Remove(id);
        }

        public int SkillSlotUsed
        {
            get
            {
                return skills.Select(ConfigSkill.Get).Select(cfg => cfg.SlotCount).Sum();
            }
        }

        /// <summary>
        /// 這個方法很重要
        /// 必須要注意那些資料要deep copy
        /// </summary>
        /// <param name="other">Other.</param>
        public void GetData(MapPlayer other)
        {
            basicAbility = other.basicAbility;
            exps = new List<AbstractItem>(other.exps);
            storage = new List<Item>(other.storage);
            weapons = new List<Item>(other.weapons);
            skills = new List<string>(other.skills);
        }
    }

    public enum Place
    {
        Storage,    // 倉庫
        Pocket,     // 準備中的背包或口袋
        Map         // 地圖中
    }

    public enum PlayState
    {
        Home, Play
    }

    public class PlayerDataStore
    {
        public MapPlayer playerInStorage = new MapPlayer();
        public MapPlayer player = new MapPlayer();
        public MapPlayer playerInMap = new MapPlayer();

        public MapPlayer GetMapPlayer(Place place)
        {
            switch (place)
            {
                case Place.Storage:
                    return playerInStorage;
                case Place.Pocket:
                    return player;
                case Place.Map:
                    return playerInMap;
            }
            throw new Exception("xxx:" + place.ToString());
        }

        public void AddPlayerHp(MapDataStore map, int v)
        {
            var basic = BasicAbility.Zero;
            var fight = FightAbility.Zero;
            Helper.CalcAbility(this, map, Place.Map, ref basic, ref fight);
            var maxHp = (int)fight.hp;
            playerInMap.hp += v;
            if (playerInMap.hp >= maxHp)
            {
                playerInMap.hp = maxHp;
            }
            if (playerInMap.hp < 0)
            {
                playerInMap.hp = 0;
            }
        }

        #region skill
        public void EquipSkill(PlayState state, string skillId)
        {
            var who = GetMapPlayer(Helper.PlaceAt(state));
            var cfg = ConfigSkill.Get(skillId);
            if (cfg.SkillTypeRequire != null)
            {
                var requires = Alg.ParseAbstractItem(cfg.SkillTypeRequire);
                foreach (var r in requires)
                {
                    var skillTypeRequire = r.prototype;
                    var levelRequire = r.count;
                    var skillExp = who.Exp(skillTypeRequire);
                    if (skillExp <= levelRequire)
                    {
                        var skillTypeName = ConfigSkillType.Get(skillTypeRequire).Name;
                        throw new Exception("技能需求經驗不足:" + skillTypeName);
                    }
                }
            }
            who.AddSkill(skillId);
        }

        public void UnequipSkill(PlayState state, string skillId)
        {
            GetMapPlayer(Helper.PlaceAt(state)).RemoveSkill(skillId);
        }
        #endregion

        #region weapon
        public string IsCanEquip(Item item, Place who, Place whosStorage)
        {
            if (who == Place.Storage)
            {
                throw new Exception("只能裝備在家裡口袋或出門的冒險者");
            }
            Func<List<Item>, List<Item>, string> canEquip = (weapons, items) =>
            {
                var haveCount = items.Count(i =>
                {
                    return i.Equals(item);
                });
                if (haveCount < 1)
                {
                    return "沒有那個道具:" + item;
                }
                return Alg.IsCanEquip(weapons, item);
            };
            return canEquip(GetMapPlayer(who).Weapons, GetMapPlayer(whosStorage).Storage);
        }

        public void EquipWeapon(Item item, Place whosWeapon, Place whosStorage)
        {
            var err = IsCanEquip(item, whosWeapon, whosStorage);
            if (err != null)
            {
                throw new Exception("無法裝備，請檢查:" + err);
            }
            if(whosWeapon == Place.Storage)
            {
                throw new Exception("無法裝備在Place.Storage");
            }
            GetMapPlayer(whosStorage).Storage.Remove(item);
            GetMapPlayer(whosWeapon).Weapons.Add(item);
        }

        public void UnequipWeapon(Item item, Place whosWeapon, Place whosStorage)
        {
            var fromPlayer = GetMapPlayer(whosWeapon);
            var toPlayer = GetMapPlayer(whosStorage);
            var isCanUnequip = fromPlayer.Weapons.IndexOf(item) != -1;
            if (isCanUnequip == false)
            {
                throw new Exception("無法拆掉：沒有那個裝備");
            }
            fromPlayer.Weapons.Remove(item);
            Alg.AddItem(toPlayer.Storage, item);
        }
        #endregion

        #region playerInMap
        public void InitPlayerPosition()
        {
            playerInMap.position.x = 5;
            playerInMap.position.y = 3;
        }
        public MoveResult Move(MapDataStore mapData, Position offset, ref bool mapDirtyFlag, ref bool playerDirtyFlag)
        {
            if (playerInMap.IsDied)
            {
                throw new Exception("冒險者掛點，無法移動");
            }
            if (playState != PlayState.Play)
            {
                throw new Exception("這時必須是Play狀態，請檢查程式:" + playState.ToString());
            }
            var originPos = playerInMap.position;
            var newPos = originPos.Add(offset);

            var infoList = mapData.FindObjects(newPos)
                .Where(obj => obj.type == MapObjectType.Resource)
                .Select(obj => mapData.resourceInfo[obj.infoKey])
                .Select(info => new AbstractItem()
                {
                    prototype = info.type,
                    count = 1
                }); ;
            var terrianId = Alg.Terrian(infoList);
            var terrian = ConfigTerrian.Get(terrianId);
            if (terrian.MoveRequire != null)
            {
                var moveRequire = Alg.ParseAbstractItem(terrian.MoveRequire);
                var fusionCnt = 0;
                var msg = Alg.IsCanFusion(moveRequire, playerInMap.Storage.Select(i => i.AbstractItem), ref fusionCnt);
                if (msg != null)
                {
                    throw new Exception("缺少必要交通工具，無法移動");
                }
            }

            var moveConsumpation = mapData.MoveConsumption(this, originPos, newPos);
            if (playerInMap.hp - moveConsumpation <= 0)
            {
                throw new Exception("體力不足，無法移動:" + playerInMap.hp);
            }
            MoveResult rs = MoveResult.Empty;
            var isPositionDirty = newPos.Equals(playerInMap.position) == false;
            // 移動位置
            playerInMap.position = newPos;
            // 新增視野
            var isMapDirty = VisitPosition(playerInMap.position);
            // 產生事件
            var events = mapData.GenEvent(this, newPos);
            if (isMapDirty)
            {
                // 生成新地圖
                mapData.GenMapWithPlayerVisible(this);
            }
            if (isPositionDirty)
            {
                // 增加移動經驗
                playerInMap.AddExp(ConfigAbility.ID_move, 1);
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
        public void AddItem(Item item, Place who)
        {
            Alg.AddItem(GetMapPlayer(who).Storage, item);
            if(who == Place.Storage)
            {
                // 從家裡新增的Item才要更新任務
                NotifyMissionAddItem(item);
            }
        }
        public void MoveItem(Place a, Place b, Item item)
        {
            switch (a)
            {
                case Place.Map:
                    throw new Exception("冒險中不能移動道具");
            }
            switch (b)
            {
                case Place.Map:
                    throw new Exception("道具不能直接移動到冒險者");
            }
            var fromPlayer = GetMapPlayer(a);
            if (fromPlayer.Storage.Contains(item) == false)
            {
                throw new Exception("沒有這個道具，不能移動:" + item);
            }
            fromPlayer.Storage.Remove(item);
            var toPlayer = GetMapPlayer(b);
            Alg.AddItem(toPlayer.Storage, item);
        }
        #endregion

        #region fusion
        public void Fusion(Item fusionTarget, Place who)
        {
            if (who == Place.Storage)
            {
                throw new Exception("不能在倉庫里合成");
            }
            Alg.Fusion(fusionTarget, GetMapPlayer(who).Storage);
            if (who == Place.Pocket)
            {
                // 從家裡新增的Item才要更新任務
                NotifyMissionAddItem(fusionTarget);
            }
        }

        public string IsCanFusion(string prototype, Place who, ref int fusionCnt)
        {
            var player = GetMapPlayer(who);
            return Alg.IsCanFusion(Common.SkillExpFn(player), prototype, player.Storage, ref fusionCnt);
        }
        #endregion

        #region visible map
        public List<Position> isPositionVisible = new List<Position>();
        public IEnumerable<MapObject> VisibleMapObjects(MapDataStore mapData)
        {
            var posSet = new HashSet<Position>(isPositionVisible);
            var visiblePosition = mapData.mapObjects.Where(obj =>
            {
                return obj.died == false && posSet.Contains(obj.position);
            });
            return visiblePosition;
        }
        public bool VisitPosition(Position pos)
        {
            var expend = ConfigConst.Get(ConfigConst.ID_visibleRange).Int;
            var posSet = new HashSet<Position>(isPositionVisible);
            for (var x = -expend; x <= expend; ++x)
            {
                var yexpend = expend - Math.Abs(x);
                for (var y = -yexpend; y <= yexpend; ++y)
                {
                    var newPos = pos.Add(x, y);
                    posSet.Add(newPos);
                }
            }
            var newVisiblePosition = posSet.ToList();
            var oldCnt = isPositionVisible.Count;
            var isDirty = newVisiblePosition.Count != oldCnt;

            isPositionVisible = newVisiblePosition;
            return isDirty;
        }
        public void ClearVisibleMapObjects()
        {
            isPositionVisible.Clear();
        }
        #endregion

        #region status
        public int money;
        public int advLevel;
        public PlayState playState;

        public void ClearPlayState()
        {
            playState = PlayState.Home;
        }
        public void EnterMap(MapDataStore map)
        {
            if (playState != PlayState.Home)
            {
                throw new Exception("這時必須是Home狀態，請檢查程式:" + playState.ToString());
            }
            // 轉移道具
            playerInMap.GetData(player);
            // 回滿體力
            AddPlayerHp(map, 99999999);
            playState = PlayState.Play;
        }

        public void ExitMap()
        {
            player.GetData(playerInMap);
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

        public bool MissionCompleted(string id)
        {
            return completedMission.Contains(id);
        }

        public IEnumerable<string> AvailableNpcMissions
        {
            get
            {
                return Alg.AvailableNpcMissions(MissionCompleted, advLevel);
            }
        }
        /// <summary>
        /// 領取任務
        /// </summary>
        /// <param name="id">Identifier.</param>
        public void AcceptMission(string id)
        {
            var cfg = ConfigNpcMission.Get(id);
            if (cfg.Level > advLevel)
            {
                throw new Exception("等級不足");
            }
            if (missions.Exists(i =>
            {
                return i == id;
            }))
            {
                Debug.LogWarning("任務已領取:" + id);
                return;
            }
            missions.Add(id);

            var mission = NpcMission.Default;
            mission.prototype = id;
            missionStatus.Add(mission);
        }

        public NpcMission GetNpcMission(string id)
        {
            var mis = missionStatus.Where(m => m.prototype == id).FirstOrDefault();
            return mis;
        }

        public void NotifyMissionAddItemFromCollect(Item item)
        {
            /*
            Debug.Log("NotifyMissionAddItemFromCollect:" + ConfigItem.Get(item.prototype).Name);
            for (var i = 0; i < missionStatus.Count; ++i)
            {
                var cfg = ConfigNpcMission.Get(missionStatus[i].prototype);
                var needItems = Alg.ParseAbstractItem(cfg.RequireItem);
                var isNeedItem = needItems.Any(it => it.prototype == item.prototype);
                if(isNeedItem == false)
                {
                    continue;
                }
                missionStatus[i].itemGot.Add(item);
                Debug.Log("mission:" + missionStatus[i]);
            }
            */
        }

        public void NotifyMissionAddItem(Item item)
        {
            // ignore
        }

        public void NotifyMissionMonsterKill(string monsterPrototype)
        {
            Debug.Log("NotifyMissionMonsterKill:"+ConfigMonster.Get(monsterPrototype).Name);
            for (var i = 0; i < missionStatus.Count; ++i)
            {
                var cfg = ConfigNpcMission.Get(missionStatus[i].prototype);
                var needItems = Alg.ParseAbstractItem(cfg.RequireKill);
                var isNeedItem = needItems.Any(it => it.prototype == monsterPrototype);
                if (isNeedItem == false)
                {
                    continue;
                }
                missionStatus[i].monsterSkilled.Add(monsterPrototype);
                Debug.Log("mission:" + missionStatus[i]);
            }
        }

        public void ClearMissionStatus()
        {
            for (var i = 0; i < missionStatus.Count; ++i)
            {
                missionStatus[i].itemGot.Clear();
                missionStatus[i].monsterSkilled.Clear();
            }
        }
        /// <summary>
        /// 判斷任務是否完成，每次互動後可以呼叫一次
        /// </summary>
        /// <returns>完成的任務</returns>
        public List<string> CheckMissionStatus()
        {
            return Alg.CheckMissionStatus(this, missionStatus);
        }
        /// <summary>
        /// 將呼叫CheckMissionStatus取得的任務輸入這個方法，完成那個任務並取得獲得的獎勵資訊
        /// </summary>
        /// <returns>The mission.</returns>
        /// <param name="id">Identifier.</param>
        public IEnumerable<AbstractItem> CompleteMission(string id)
        {
            if (missions.Contains(id) == false)
            {
                throw new Exception("這個任務沒有領取:" + id);
            }
            if (completedMission.Contains(id))
            {
                throw new Exception("這個任務已完成過了:" + id);
            }
            var errs = Alg.GetMissionWantCompleteMessage(this, id);
            if (errs != null)
            {
                throw new Exception("這個任務還沒達成條件:" + string.Join(",", errs.ToArray()));
            }
            completedMission.Add(id);
            // 刪去任務狀態
            for (var i = 0; i < missionStatus.Count; ++i)
            {
                var m = missionStatus[i];
                if (m.prototype == id)
                {
                    missionStatus.RemoveAt(i);
                    break;
                }
            }
            var cfg = ConfigNpcMission.Get(id);
            var requireItems = Alg.ParseAbstractItem(cfg.RequireItem);
            foreach(var i in requireItems)
            {
                Alg.AddItem(GetMapPlayer(Place.Pocket).Storage, i.Item.Negative);
            }

            var rewards = Alg.ParseAbstractItem(cfg.Reward);
            foreach (var reward in rewards)
            {
                switch (reward.prototype)
                {
                    case "money":
                        {
                            money += reward.count;
                        }
                        break;
                    default:
                        {
                            AddItem(reward.Item, Place.Pocket);
                        }
                        break;
                }
            }
            return rewards;
        }

        #endregion

        #region store
        public string GetMemonto()
        {
            string json = JsonUtility.ToJson(this);
            return json;
        }
        public static PlayerDataStore FromMemonto(string json)
        {
            return JsonUtility.FromJson<PlayerDataStore>(json);
        }
        #endregion
    }

    public class Helper
    {
        public static Place PlaceAt(PlayState state)
        {
            switch (state)
            {
                case PlayState.Home:
                    return Place.Pocket;
                case PlayState.Play:
                    return Place.Map;
                default:
                    throw new Exception("PlaceAt:" + state);
            }
        }

        public static Buf GetBuf(ConfigSkill skill)
        {
            switch (skill.ID)
            {
                case ConfigSkill.ID_bokyoryokuhakai:
                    return new Buf()
                    {
                        skillId = skill.ID,
                        turn = 3
                    };
                default:
                    throw new Exception("這招沒buf:" + skill.ID);
            }
        }

        public static MonsterThinking MonsterThink(MapDataStore map, PlayerDataStore player, int monsterId)
        {
            if (true)
            {
                return MonsterThinking.AttackYou;
            }
            var objInfo = map.mapObjects[monsterId];
            var monsterInfo = map.monsterInfo[objInfo.infoKey];
            //var cfg = ConfigMonster.Get (monsterInfo.type);
            // 想要攻擊主要是仇恨值
            var wantAttack =
                monsterInfo.NormalHate * 0.8f +
                monsterInfo.NormalHate > 0 ? (monsterInfo.NormalBrave * 0.2f) : 0;
            var wantEscape = 1 - (
                monsterInfo.NormalBrave * (2 / 3f) +
                monsterInfo.NormalHate * (1 / 3f)
            );

            var actions = new MonsterThinking[] {
                MonsterThinking.AttackYou, MonsterThinking.Escape
            };
            var values = new float[] { wantAttack, wantEscape };
            var selectValue = values.OrderByDescending(v => v).First();
            if (selectValue < 0.2)
            {
                return MonsterThinking.None;
            }
            for (var i = 0; i < values.Length; ++i)
            {
                if (selectValue == values[i])
                {
                    return actions[i];
                }
            }
            throw new Exception("必須要回傳一個動作");
        }

        /// <summary>
        /// 計算招式發動率
        /// </summary>
        /// <returns>The trigger rate.</returns>
        /// <param name="who">Who.</param>
        /// <param name="skill">Skill.</param>
        public static float ComputeSkillTriggerRate(MapPlayer who, ConfigSkill skill)
        {
            var ais = Alg.ParseAbstractItem(skill.SkillTypeRequire);
            var needExp = ais.Sum(ai => ai.count);
            var maxExp = needExp << 1;
            var haveExp = ais.Sum(ai => who.Exp(ai.prototype));
            var rate = (float)(haveExp - needExp) / (maxExp - needExp);
            var bouns = skill.TriggerBonus;
            return rate + bouns;
        }

        /// <summary>
        /// 取得可用招式列表
        /// </summary>
        /// <returns>The skills.</returns>
        /// <param name="player">Player.</param>
        /// <param name="who">Who.</param>
        public static IEnumerable<ConfigSkill> AvailableSkills(PlayerDataStore player, Place who_)
        {
            var who = player.GetMapPlayer(who_);
            // 先取得欄位上的招式
            var slotSkills = who.Skills;
            return Alg.AvailableSkills(slotSkills, who.Weapons).Select(ConfigSkill.Get);
        }
        /// <summary>
        /// 計算基礎能力和戰鬥能力
        /// </summary>
        /// <param name="player">Player.</param>
        /// <param name="map">Map.</param>
        /// <param name="who">Who.</param>
        /// <param name="basic">Basic.</param>
        /// <param name="fight">Fight.</param>
        public static void CalcAbility(PlayerDataStore player, MapDataStore map, Place who_, ref BasicAbility basic, ref FightAbility fight)
        {
            if (who_ == Place.Storage)
            {
                throw new Exception("計算能力時不能傳入UnknowPlayer");
            }
            var who = player.GetMapPlayer(who_);
            var tmpFight = FightAbility.Zero;
            var tmpBasic = Alg.CalcAbility(Common.SkillExpFn(who), who.Weapons, null, BasicAbility.Default.Add(who.basicAbility), ref tmpFight);
            basic = tmpBasic;
            fight = tmpFight;
        }

        public static BasicAbility CalcMonsterAbility(PlayerDataStore player, MapDataStore map, int mapObjectId)
        {
            var mapObject = map.mapObjects[mapObjectId];
            var monsterInfo = map.monsterInfo[mapObject.infoKey];
            var tmpBasic = Alg.GetBasicAbility(ConfigMonster.Get(monsterInfo.type));
            var effects = monsterInfo.Bufs.SelectMany(it => it.Effects);
            var fight = FightAbility.Zero;
            return Alg.CalcAbility(null, null, effects, tmpBasic, ref fight);
        }
        /// <summary>
        /// 計算普攻傷害
        /// </summary>
        /// <returns>The basic damage.</returns>
        /// <param name="player">Player.</param>
        /// <param name="map">Map.</param>
        /// <param name="mapObjectId">Map object identifier.</param>
        public static int GetBasicDamage(PlayerDataStore player, MapDataStore map, int mapObjectId)
        {
            var a = player.playerInMap.basicAbility.FightAbility;
            var monsterInfo = map.monsterInfo[map.mapObjects[mapObjectId].infoKey];
            var b = Alg.GetBasicAbility(ConfigMonster.Get(monsterInfo.type)).FightAbility;
            return (int)(a.atk - b.def);
        }
    }
}