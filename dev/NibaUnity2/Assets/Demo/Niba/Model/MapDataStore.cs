using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System.Linq;

namespace Niba
{
    [Serializable]
    public enum MapObjectType
    {
        Unknown = 0,
        Resource = 1,
        Monster = 2
    }

    [Serializable]
    public struct MapObject
    {
        public int key;
        public string strKey;
        public Position position;
        // info的主鍵為(type, infoKey)
        public MapObjectType type;
        public int infoKey;
        public bool died;
        public static MapObject Empty;
    }

    [Serializable]
    public struct ResourceInfo
    {
        public string type;
        public static ResourceInfo Empty;
    }

    public enum MonsterThinking
    {
        None, AttackYou, Escape
    }

    [Serializable]
    public class MonsterInfo
    {
        public string type;
        public int hp, mp;
        [SerializeField]
        List<Buf> bufs = new List<Buf>();
        public void AddBuf(Buf buf)
        {
            bufs.Add(buf);
        }
        public List<Buf> Bufs { get { return bufs; } }

        public bool IsDied { get { return hp <= 0; } }
        /// <summary>
        /// 勇氣值0~1
        /// </summary>
        public float brave;
        public float NormalBrave
        {
            get
            {
                return Mathf.Max(0, Mathf.Min(1, brave));
            }
        }
        // 打你越痛勇氣值越高
        public void AttackYou(FightAbility you, int damage)
        {
            var maxHp = you.hp;
            var rate = Mathf.Max(0, Mathf.Min(1, damage / maxHp)) - 0.5f;
            brave += rate;
        }
        // 每回合勇氣值會自動增減
        public void StepBrave()
        {
            var offset = (brave - 0.5f) / 10f;
            brave += offset;
        }
        /// <summary>
        /// 仇恨值0~1
        /// </summary>
        float hate;
        public float NormalHate
        {
            get
            {
                return Mathf.Max(0, Mathf.Min(1, hate));
            }
        }
        // 越痛仇恨值越大
        public void BeAttacked(int damage)
        {
            var rate = Mathf.Max(0, Mathf.Min(1, (float)damage / MaxHP));
            hate += rate;
        }
        public void StepHate()
        {
            hate -= 0.05f;
            if (hate < 0)
            {
                hate = 0;
            }
        }

        public int MaxHP
        {
            get
            {
                return (int)Alg.GetBasicAbility(ConfigMonster.Get(type)).FightAbility.hp;
            }
        }
    }

    [Serializable]
    public enum MapType
    {
        Unknown, Random, Pattern, Test1
    }

    [Serializable]
    public struct Description
    {
        public const string WorkAttack = "[work]attack {mapObjectId}";
        public const string WorkUseTurnSkill = "[work]use turn skill {skillId}";
        public const string WorkSelectSkillForEnemy = "[work]select {skillId} in {skillIds} for {mapObjectId}";
        public const string WorkUseSkillForEnemyAll = "[work]use {skillId} for {mapObjectIds}";
        public const string WorkCollectResource = "[work]collect resource {mapObjectId}";
        public const string EventLucklyFind = "[event]luckly find {itemPrototype} {count}";
        public const string EventMonsterAttackYou = "[event]{mapObjectId} attack you";
        public const string EventMonsterEscape = "[event]{mapObjectId} escape you";
        public const string EventMonsterIdle = "[event]{mapObjectId} idle";
        public const string InfoAttack = "[info]you attack {mapObjectId} and deal damage {damage}. {isCriHit}";
        public const string InfoDodge = "[info]you dodge the attack from {mapObjectId}";
        public const string InfoMonsterDied = "[info]{mapObjectId} is died. you get {rewards}"; // rewards is array of json string
        public const string InfoMonsterDodge = "[info]{mapObjectId} is dodge.";
        public const string InfoMonsterEscape = "[info]{mapObjectId} is escape.";
        public const string InfoMonsterIdle = "[info]{mapObjectId} is idle.";
        public const string InfoMonsterAttack = "[info]{mapObjectId} attack you and deal damage {damage}";
        public const string InfoWeaponBroken = "[info]{items} is broken.";  // items is array of json string
        public const string InfoUseSkill = "[info]you use {skills}.";
        public const string InfoCollectResource = "[info]you collect {items}."; // items is array of json string
        public const string InfoMessage = "[info]{msg}";
        public string description;
        public NameValueCollection values;
        public static Description Empty;
    }

    public struct Interaction
    {
        public Description description;
        public float priority;
        public static Interaction Empty;
    }
    // 下[Serializable]的話，會自動存入本機和自動讀取，真是奇怪(方便?)的功能
    // 不使用上述的功能
    // 地圖的部分另外存，因為資料量比較大
    // 所以把比較長變動的資料移到PlayerDataStore
    public class MapDataStore
    {
        #region map
        // Dictionary無法Serializable
        private List<MapObject> mapObjects = new List<MapObject>();
        private List<ResourceInfo> resourceInfo = new List<ResourceInfo>();
        private List<MonsterInfo> monsterInfo = new List<MonsterInfo>();

        public List<MapObject> MapObjects { get { return mapObjects;  } }
        public List<ResourceInfo> ResourceInfo { get { return resourceInfo; } }
        public List<MonsterInfo> MonsterInfo { get { return monsterInfo; } }

        [SerializeField]
        MapType genMapType;

        public void GenMapStart(MapType mapType)
        {
            genMapType = mapType;
        }

        public void GenMapWithPlayerVisible(PlayerDataStore player)
        {
            GenMapWithPositions(mapObjects.Select(o => o.position), player);
        }

        public void GenMapWithPositions(IEnumerable<Position> posList, PlayerDataStore player)
        {
            if (genMapType == MapType.Unknown)
            {
                throw new Exception("還沒指定地圖類型");
            }
            Func<Position, IEnumerable<AbstractItem>> genResFn = null;
            Func<Position, IEnumerable<AbstractItem>, IEnumerable<AbstractItem>> genMonFn = null;
            switch (genMapType)
            {
                case MapType.Pattern:
                    {
                        genResFn = Alg.GenResourcePattern(4000, 25);
                    }
                    break;
            }
            genMonFn = Alg.GenMonsterPattern;

            var alreadyPos = new HashSet<Position>(posList);
            foreach (var pos in player.IsPositionVisible)
            {
                if (alreadyPos.Contains(pos))
                {
                    continue;
                }
                alreadyPos.Add(pos);

                switch (genMapType)
                {
                    case MapType.Test1:
                        {
                            GenResource(player, pos, ConfigResource.ID_grass);
                            GenResource(player, pos, ConfigResource.ID_tree);
                            GenMonster(player, pos, ConfigMonster.ID_ant);
                        }
                        break;
                    case MapType.Random:
                        {
                            for (var i = 0; i < ConfigResource.ID_COUNT; ++i)
                            {
                                var dice = UnityEngine.Random.Range(0, 100);
                                if (dice < 60)
                                {
                                    var id = ConfigResource.Get(i).ID;
                                    GenResource(player, pos, id);
                                }
                            }

                            var infoList = FindObjects(pos)
                                .Where(obj => obj.type == MapObjectType.Resource)
                                .Select(obj => resourceInfo[obj.infoKey])
                                .Select(info => new AbstractItem()
                                {
                                    prototype = info.type,
                                    count = 1
                                });

                            for (var i = 0; i < ConfigMonster.ID_COUNT; ++i)
                            {
                                var terrianId = Alg.Terrian(infoList);
                                var monster = ConfigMonster.Get(i);

                                if(monster.Terrian != null && monster.Terrian.Contains(terrianId))
                                {
                                    var rate = 30;
                                    var rates = Alg.ParseAbstractItem(monster.AppearRate);
                                    foreach (var appearRate in rates)
                                    {
                                        if (appearRate.prototype == terrianId)
                                        {
                                            rate = appearRate.count;
                                        }
                                    }

                                    var dice = UnityEngine.Random.Range(0, 100);
                                    if (dice < rate)
                                    {
                                        var id = monster.ID;
                                        GenMonster(player, pos, id);
                                    }
                                }
                            }
                        }
                        break;
                    case MapType.Pattern:
                        {
                            var res = genResFn(pos);
                            var mon = genMonFn(pos, res);
                            foreach (var ai in res)
                            {
                                for (var i = 0; i < ai.count; ++i)
                                {
                                    GenResource(player, pos, ai.prototype);
                                }
                            }
                            foreach (var ai in mon)
                            {
                                for (var i = 0; i < ai.count; ++i)
                                {
                                    GenMonster(player, pos, ai.prototype);
                                }
                            }
                        }
                        break;
                }
            }
        }

        public void ClearMap()
        {
            mapObjects.Clear();
            resourceInfo.Clear();
            monsterInfo.Clear();
        }

        public int GenObject(MapObjectType type, string strKey)
        {
            if (strKey != null)
            {
                if (FindObject(strKey).Equals(MapObject.Empty) == false)
                {
                    throw new UnityException("item already exists!" + strKey);
                }
            }
            MapObject item = MapObject.Empty;
            item.type = type;
            if (strKey != null)
            {
                item.strKey = strKey;
            }
            switch (item.type)
            {
                case MapObjectType.Resource:
                    item.infoKey = resourceInfo.Count;
                    resourceInfo.Add(Niba.ResourceInfo.Empty);
                    break;
                case MapObjectType.Monster:
                    item.infoKey = monsterInfo.Count;
                    monsterInfo.Add(new MonsterInfo());
                    break;
            }
            // 先取得數字鍵
            item.key = mapObjects.Count;
            // 再加入到串列
            mapObjects.Add(item);
            return item.key;
        }

        public int GenResource(PlayerDataStore player, Position pos, string resourceType)
        {
            var key = GenObject(MapObjectType.Resource, null);
            var obj = mapObjects[key];
            obj.position = pos;
            mapObjects[key] = obj;

            var info = resourceInfo[mapObjects[key].infoKey];
            info.type = resourceType;
            resourceInfo[mapObjects[key].infoKey] = info;
            return key;
        }

        public int GenMonster(PlayerDataStore player, Position pos, string monsterType)
        {
            var m1Key = GenObject(MapObjectType.Monster, null);

            var m1Object = mapObjects[m1Key];
            m1Object.position = pos;
            mapObjects[m1Key] = m1Object;

            var m1Info = monsterInfo[m1Object.infoKey];
            m1Info.type = monsterType;
            var basic = Alg.GetBasicAbility(ConfigMonster.Get(m1Info.type));
            var fight = basic.FightAbility;
            m1Info.hp = (int)fight.hp;
            m1Info.mp = (int)fight.mp;
            m1Info.brave = ConfigMonster.Get(m1Info.type).ActiveRate / 100.0f;
            return m1Key;
        }

        public int WorkConsumpation(PlayerDataStore player, Description work)
        {
            return ConfigConst.Get(ConfigConst.ID_workConsumpation).Int;
        }

        public int MoveConsumption(PlayerDataStore player, Position a, Position b)
        {
            if (a.Equals(b))
            {
                return 0;
            }
            var offset = b.Add(a.Negative);
            if (Math.Abs(offset.x) > 1 || Math.Abs(offset.y) > 1)
            {
                return int.MaxValue;
            }
            return ConfigConst.Get(ConfigConst.ID_moveConsumpation).Int; ;
        }

        public List<Item> Collect(PlayerDataStore player, int objKey)
        {
            var ret = new List<Item>();
            var obj = mapObjects[objKey];
            if (obj.died == true)
            {
                throw new Exception("不能採集已消除的物件:" + objKey);
            }
            if (obj.type != MapObjectType.Resource)
            {
                throw new Exception("非資源不得採集:" + obj.type);
            }
            obj.died = true;
            // assign back
            mapObjects[objKey] = obj;
            foreach (var item in ret)
            {
                player.AddItem(item, Place.Map);
            }
            return ret;
        }

        public MapObject FindObject(string strKey)
        {
            return mapObjects.Find(item =>
            {
                return item.strKey == strKey;
            });
        }
        public IEnumerable<MapObject> FindObjects(Position pos, bool filterDied = true)
        {
            return mapObjects.Where(item =>
            {
                if (filterDied & item.died)
                {
                    return false;
                }
                return item.position.Equals(pos);
            });
        }

        #endregion

        #region event
        public IEnumerable<Description> GenEvent(PlayerDataStore player, Position pos)
        {
            var objs = FindObjects(pos);
            return objs.Aggregate(
                new List<Description>(),
                (accu, obj) =>
                {
                    switch (obj.type)
                    {
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
        public void ApplyEvents(PlayerDataStore player, IEnumerable<Description> events)
        {
            foreach (var evt in events)
            {
                switch (evt.description)
                {
                    case Description.EventLucklyFind:
                        {
                            var itemPrototype = evt.values.Get("itemPrototype");
                            var cnt = int.Parse(evt.values.Get("count"));
                            Item item;
                            item.prototype = itemPrototype;
                            item.count = cnt;
                            //Alg.AddItem(player.playerInMap.Storage, item);
                            Alg.AddItem(player.GetMapPlayer(Place.Map).Storage, item);
                        }
                        break;
                    default:
                        throw new NotImplementedException("event:" + evt.description);
                }
            }
        }
        #endregion

        #region process work
        // 武器壞掉
        IEnumerable<Description> ProcessWeaponBroken(PlayerDataStore player)
        {
            // 注意：使用ToList將陣列Copy
            var brokenWeapons = player.GetMapPlayer(Place.Map).CheckHandWeaponBroken().ToList();
            // 刪除壞掉武器
            foreach (var broken in brokenWeapons)
            {
                player.GetMapPlayer(Place.Map).Weapons.Remove(broken);
            }
            // === 回傳壞掉資訊 === //
            if (brokenWeapons.Count() == 0)
            {
                return new List<Description>();
            }
            var des = Description.Empty;
            des.description = Description.InfoWeaponBroken;
            des.values = new NameValueCollection();
            foreach (var broken in brokenWeapons)
            {
                var jsonstr = JsonUtility.ToJson(broken);
                des.values.Add("items", jsonstr);
            }
            return new List<Description>() { des };
        }
        // 傷害
        IEnumerable<Description> ProccessDamageWork(PlayerDataStore player, int mapObjectId, int damage)
        {
            var ret = new List<Description>();

            var mapObject = mapObjects[mapObjectId];
            var monsterInf = monsterInfo[mapObject.infoKey];
            var monsterCfg = ConfigMonster.Get(monsterInf.type);

            monsterInf.hp -= damage;
            // 計算仇恨值
            monsterInf.BeAttacked(damage);

            var getReward = new List<Item>();
            if (monsterInf.IsDied)
            {
                mapObject.died = true;
                // 獎勵
                var rewards = Alg.ParseItem(monsterCfg.Item);
                var rewardsRate = Alg.ParseItem(monsterCfg.ItemAppearRate);

                foreach (var reward in rewards)
                {
                    var rate = 30;
                    foreach(var itemRate in rewardsRate)
                    {
                        if(itemRate.prototype == reward.prototype)
                        {
                            rate = itemRate.count;
                        }
                    }
                    var dice = UnityEngine.Random.Range(0, 99);
                    Debug.Log("dice:"+dice+" target rate:"+rate);
                    if(dice < rate)
                    {
                        Alg.AddItem(player.GetMapPlayer(Place.Map).Storage, reward);
                        getReward.Add(reward);
                    }
                }
            }
            monsterInfo[mapObject.infoKey] = monsterInf;
            mapObjects[mapObjectId] = mapObject;

            // 傷害事件
            var des = Description.Empty;
            des.description = Description.InfoAttack;
            des.values = new NameValueCollection();
            des.values.Set("mapObjectId", mapObjectId + "");
            des.values.Set("damage", damage + "");
            des.values.Set("isCriHit", "0");
            ret.Add(des);

            // 怪物死亡事件
            if (monsterInf.IsDied)
            {
                player.NotifyMissionMonsterKill(monsterInf.type);

                des = Description.Empty;
                des.description = Description.InfoMonsterDied;
                des.values = new NameValueCollection();
                des.values.Set("mapObjectId", mapObjectId + "");
                // 獎勵資訊
                var rewards = getReward;
                foreach (var json in rewards.Select(i => JsonUtility.ToJson(i)))
                {
                    des.values.Add("rewards", json);
                }
                ret.Add(des);
            }

            return ret;
        }

        public IEnumerable<Description> ProcessWork(PlayerDataStore player, Description work)
        {
            var ret = new List<Description>();
            LabelProcessWork:
            switch (work.description)
            {
                case Description.WorkUseSkillForEnemyAll:
                    {
                        var des = Description.Empty;
                        if (player.GetMapPlayer(Place.Map).IsDied)
                        {
                            des = Description.Empty;
                            des.description = Description.InfoMessage;
                            des.values = new NameValueCollection();
                            des.values.Set("msg", "玩家死亡, 無法行動");
                            ret.Add(des);
                            break;
                        }

                        var skillId = work.values.Get("skillId");
                        var mapObjectIds = work.values.GetValues("mapObjectIds").Select(int.Parse).ToList();
                        var skill = ConfigSkill.Get(skillId);

                        var playerBasic = BasicAbility.Zero;
                        var playerAbility = FightAbility.Zero;
                        Helper.CalcAbility(player, this, Place.Map, ref playerBasic, ref playerAbility);
                        var damage = playerBasic.agi * playerBasic.dex;
                        damage = Math.Max(0, damage);

                        des = Description.Empty;
                        des.description = Description.InfoUseSkill;
                        des.values = new NameValueCollection();
                        des.values.Add("skills", skill.ID);
                        ret.Add(des);

                        foreach (var mapObjectId in mapObjectIds)
                        {
                            var mapObject = mapObjects[mapObjectId];
                            var monsterInf = monsterInfo[mapObject.infoKey];
                            if (monsterInf.IsDied)
                            {
                                Debug.LogWarning("怪物已無法戰鬥");
                                continue;
                            }
                            switch (skill.ID)
                            {
                                case ConfigSkill.ID_spinAttack:
                                    {
                                        var infos = ProccessDamageWork(player, mapObjectId, (int)damage);
                                        infos.Concat(ProcessWeaponBroken(player));

                                        ret.AddRange(infos);
                                    }
                                    break;
                            }
                        }
                    }
                    break;
                case Description.WorkSelectSkillForEnemy:
                    {
                        var des = Description.Empty;
                        if (player.GetMapPlayer(Place.Map).IsDied)
                        {
                            des = Description.Empty;
                            des.description = Description.InfoMessage;
                            des.values = new NameValueCollection();
                            des.values.Set("msg", "玩家死亡, 無法行動");
                            ret.Add(des);
                            break;
                        }

                        var skillId = work.values.Get("skillId");
                        var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
                        var mapObject = mapObjects[mapObjectId];
                        var monsterInf = monsterInfo[mapObject.infoKey];
                        if (monsterInf.IsDied)
                        {
                            Debug.LogWarning("怪物已無法戰鬥");
                            goto LabelProcessWork;
                        }

                        des = Description.Empty;
                        des.description = Description.InfoUseSkill;
                        des.values = new NameValueCollection();
                        des.values.Add("skills", skillId);
                        ret.Add(des);

                        var skill = ConfigSkill.Get(skillId);
                        switch (skill.ID)
                        {
                            case ConfigSkill.ID_karadaAttack:
                                {
                                    // 身體撞擊
                                    var playerBasic = BasicAbility.Zero;
                                    var playerAbility = FightAbility.Zero;
                                    Helper.CalcAbility(player, this, Place.Map, ref playerBasic, ref playerAbility);
                                    var damage = playerBasic.agi * playerAbility.def;
                                    damage = (int)Math.Max(0, damage);

                                    var infos = ProccessDamageWork(player, mapObjectId, (int)damage);
                                    ret.AddRange(infos);
                                }
                                break;
                            case ConfigSkill.ID_bokyoryokuhakai:
                                {
                                    // 防禦破壞
                                    monsterInf.AddBuf(Helper.GetBuf(skill));
                                    monsterInfo[mapObject.infoKey] = monsterInf;
                                }
                                break;
                        }
                    }
                    break;
                case Description.WorkUseTurnSkill:
                    {
                        var des = Description.Empty;
                        if (player.GetMapPlayer(Place.Map).IsDied)
                        {
                            des = Description.Empty;
                            des.description = Description.InfoMessage;
                            des.values = new NameValueCollection();
                            des.values.Set("msg", "玩家死亡, 無法行動");
                            ret.Add(des);
                            break;
                        }
                        var skillId = work.values.Get("skillId");
                        var skill = ConfigSkill.Get(skillId);
                        switch (skill.Effect)
                        {
                            case "{0}+{1}":
                                player.GetMapPlayer(Place.Map).hp += 20;
                                des = Description.Empty;
                                des.description = Description.InfoUseSkill;
                                des.values = new NameValueCollection();
                                des.values.Add("skills", skill.ID);
                                ret.Add(des);
                                break;
                            default:
                                throw new Exception("未處理的回合性招式:" + skill.ID);
                        }
                    }
                    break;
                case Description.WorkCollectResource:
                    {
                        var des = Description.Empty;
                        if (player.GetMapPlayer(Place.Map).IsDied)
                        {
                            des = Description.Empty;
                            des.description = Description.InfoMessage;
                            des.values = new NameValueCollection();
                            des.values.Set("msg", "玩家死亡, 無法行動");
                            ret.Add(des);
                            break;
                        }
                        var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
                        var obj = mapObjects[mapObjectId];
                        var info = resourceInfo[obj.infoKey];
                        var config = ConfigResource.Get(info.type);
                        var breakRate = 100 / config.UseCount;
                        if(UnityEngine.Random.Range(0, 99) < breakRate)
                        {
                            obj.died = true;
                            mapObjects[mapObjectId] = obj;
                        }
                        var hasItem = config.Item != null;
                        if (hasItem)
                        {
                            var items = Alg.ParseItemFromResource(config);
                            foreach (var item in items)
                            {
                                player.AddItem(item, Place.Map);
                            }
                            // 增加採集經驗
                            foreach (var item in items)
                            {
                                var cfg = ConfigItem.Get(item.prototype);
                                if (cfg.SkillType != null)
                                {
                                    player.GetMapPlayer(Place.Map).AddExp(cfg.SkillType, 1);
                                }
                            }

                            // 發送任務更新
                            foreach (var item in items)
                            {
                                player.NotifyMissionAddItemFromCollect(item);
                            }

                            des = Description.Empty;
                            des.description = Description.InfoCollectResource;
                            des.values = new NameValueCollection();
                            foreach (var itemJson in items.Select(i => JsonUtility.ToJson(i)))
                            {
                                des.values.Add("items", itemJson);
                            }
                            ret.Add(des);
                        }
                    }
                    break;
                case Description.WorkAttack:
                    {
                        var des = Description.Empty;
                        if (player.GetMapPlayer(Place.Map).IsDied)
                        {
                            des = Description.Empty;
                            des.description = Description.InfoMessage;
                            des.values = new NameValueCollection();
                            des.values.Set("msg", "玩家死亡, 無法行動");
                            ret.Add(des);
                            break;
                        }
                        var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
                        var mapObject = mapObjects[mapObjectId];
                        var monsterInf = monsterInfo[mapObject.infoKey];
                        // 怪物逃走了
                        if (monsterInf.IsDied)
                        {
                            des = Description.Empty;
                            des.description = Description.InfoMessage;
                            des.values = new NameValueCollection();
                            des.values.Set("msg", "怪物已逃走");
                            ret.Add(des);
                            break;
                        }
                        // === 計算傷害 === //
                        var monsterCfg = ConfigMonster.Get(monsterInf.type);
                        var monsterAbility = Helper.CalcMonsterAbility(player, this, mapObjectId).FightAbility;
                        var playerBasic = BasicAbility.Zero;
                        var playerAbility = FightAbility.Zero;
                        // 先計算非針對怪物的能力
                        Helper.CalcAbility(player, this, Place.Map, ref playerBasic, ref playerAbility);
                        // 計算針對怪物的能力，例：如果對像是鳥，攻擊力*1.1之類
                        var enforceEff = player.GetMapPlayer(Place.Map).Weapons.SelectMany(it => it.Effects).Where(it => it.EffectOperator == ItemEffectType.Enforce);
                        playerAbility = enforceEff.Aggregate(playerAbility, (accu, curr) =>
                        {
                            // TODO 實做針對性能力
                            return playerAbility;
                        });
                        // === 技能加成 === //
                        var skills = Helper.AvailableSkills(player, Place.Map);
                        // 只計算攻擊性技能
                        skills = skills.Where(s => s.Condition == ConfigConditionType.ID_attack);
                        // 取出發動的技能
                        var triggered = skills.Where(s =>
                        {
                            var rate = (int)(Helper.ComputeSkillTriggerRate(player.GetMapPlayer(Place.Map), s) * 100);
                            return UnityEngine.Random.Range(1, 101) < rate;
                        });
                        // 取出技能效果
                        var triggeredEffect = triggered.SelectMany(Alg.Effect);
                        playerAbility = triggeredEffect.Aggregate(playerAbility, (v, effect) =>
                        {
                            switch (effect.EffectOperator)
                            {
                                case ItemEffectType.Unknown:
                                    {
                                        switch (effect.value)
                                        {
                                            default:
                                                throw new NotImplementedException("未確定的招式:" + effect.value);
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
                        var accuracyRate = playerAbility.AccuracyRate(monsterAbility);
                        var isHit = UnityEngine.Random.Range(1, 101) < (int)(accuracyRate * 100);
                        if (isHit == false)
                        {
                            des = Description.Empty;
                            // === 回傳使用招式 === //
                            if (triggered.Count() > 0)
                            {
                                des = Description.Empty;
                                des.description = Description.InfoUseSkill;
                                des.values = new NameValueCollection();
                                foreach (var s in triggered)
                                {
                                    des.values.Add("skills", s.ID);
                                }
                                Debug.Log("use SKILL:"+des.values.GetValues("skills"));
                                ret.Add(des);
                            }

                            // === 回傳怪物回避攻擊 === //
                            des = Description.Empty;
                            des.description = Description.InfoMonsterDodge;
                            des.values = new NameValueCollection();
                            des.values.Set("mapObjectId", mapObjectId + "");
                            ret.Add(des);
                        }
                        else
                        {
                            // 總傷害
                            var damage = playerAbility.Damage(monsterAbility);
                            var criRate = playerAbility.CriticalHitRate(monsterAbility);
                            var isCriHit = UnityEngine.Random.Range(1, 101) < (int)(criRate * 100);
                            if (isCriHit)
                            {
                                damage = (int)(damage * 1.5f);
                            }
                            damage = Math.Max(0, damage);
                            // === 套用傷害 === //
                            ret.AddRange(ProccessDamageWork(player, mapObjectId, damage));
                            // === 處理武器壞掉 === //
                            ret.AddRange(ProcessWeaponBroken(player));

                            // 增加武器經驗
                            foreach (var item in player.GetMapPlayer(Place.Map).Weapons)
                            {
                                var cfg = ConfigItem.Get(item.prototype);
                                if (cfg.Position != ConfigWeaponPosition.ID_hand)
                                {
                                    continue;
                                }
                                if (cfg.SkillType != null)
                                {
                                    player.GetMapPlayer(Place.Map).AddExp(cfg.SkillType, 1);
                                }
                            }

                            // ====== 以下處理回傳 ====== //
                            des = Description.Empty;
                            // === 回傳使用招式 === //
                            if (triggered.Count() > 0)
                            {
                                des = Description.Empty;
                                des.description = Description.InfoUseSkill;
                                des.values = new NameValueCollection();
                                foreach (var s in triggered)
                                {
                                    des.values.Add("skills", s.ID);
                                }
                                ret.Add(des);
                            }
                        }
                    }
                    break;
                case Description.EventMonsterAttackYou:
                    {
                        var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
                        var mapObject = mapObjects[mapObjectId];
                        var monsterInf = monsterInfo[mapObject.infoKey];

                        var monsterBasic = Helper.CalcMonsterAbility(player, this, mapObjectId);
                        var monsterAbility = monsterBasic.FightAbility;
                        var playerBasic = BasicAbility.Zero;
                        var playerAbility = FightAbility.Zero;
                        // 先計算非針對怪物的能力
                        Helper.CalcAbility(player, this, Place.Map, ref playerBasic, ref playerAbility);
                        // 計算針對怪物的能力，例：如果對像是鳥，防禦力*1.1之類
                        var enforceEff = player.GetMapPlayer(Place.Map).Weapons.SelectMany(it => it.Effects).Where(it => it.EffectOperator == ItemEffectType.Enforce);
                        playerAbility = enforceEff.Aggregate(playerAbility, (accu, curr) =>
                        {
                            // TODO 實做針對性能力
                            return playerAbility;
                        });
                        // 判斷是否命中
                        var accuracyRate = monsterAbility.AccuracyRate(playerAbility);
                        var isHit = UnityEngine.Random.Range(1, 101) < (int)(accuracyRate * 100);
                        if (isHit == false)
                        {
                            // === 回傳回避攻擊 === //
                            var des = Description.Empty;
                            des.description = Description.InfoDodge;
                            des.values = new NameValueCollection();
                            des.values.Set("mapObjectId", mapObjectId + "");
                            ret.Add(des);
                            // 回避會增加速度經驗
                            player.GetMapPlayer(Place.Map).AddExp(ConfigAbility.ID_speed, 1);

                        }
                        else
                        {
                            var des = Description.Empty;

                            // === 技能加成 === //
                            var skills = Helper.AvailableSkills(player, Place.Map);
                            // 只計算防禦性技能
                            skills = skills.Where(s => s.Condition == ConfigConditionType.ID_deffence);
                            // 取出發動的技能
                            var triggered = skills.Where(s =>
                            {
                                var rate = (int)(Helper.ComputeSkillTriggerRate(player.GetMapPlayer(Place.Map), s) * 100);
                                return UnityEngine.Random.Range(1, 101) < rate;
                            });
                            if (triggered.Count() > 0)
                            {
                                var onlyOneSkillCanTrigger = triggered.First();
                                switch (onlyOneSkillCanTrigger.Effect)
                                {
                                    case "取消對方的攻擊，並對對方造成{1}倍普攻傷害.":
                                        {
                                            var counterDamage = playerAbility.Damage(monsterAbility);
                                            monsterInf.hp -= counterDamage;
                                            if (monsterInf.IsDied)
                                            {
                                                mapObject.died = true;
                                            }
                                            mapObjects[mapObjectId] = mapObject;
                                            monsterInfo[mapObject.infoKey] = monsterInf;

                                            des = Description.Empty;
                                            des.description = Description.InfoUseSkill;
                                            des.values = new NameValueCollection();
                                            des.values.Add("skills", onlyOneSkillCanTrigger.ID);
                                            ret.Add(des);
                                        }
                                        goto LabelProcessWork;
                                    case "取消對方的攻擊.":
                                        {
                                            des = Description.Empty;
                                            des.description = Description.InfoUseSkill;
                                            des.values = new NameValueCollection();
                                            des.values.Add("skills", onlyOneSkillCanTrigger.ID);
                                            ret.Add(des);
                                        }
                                        goto LabelProcessWork;
                                }
                            }


                            var damage = monsterAbility.Damage(playerAbility);
                            var criRate = monsterAbility.CriticalHitRate(playerAbility);
                            var isCriHit = UnityEngine.Random.Range(1, 101) < (int)(criRate * 100);
                            if (isCriHit)
                            {
                                damage = (int)(damage * 1.5f);
                            }
                            damage = Math.Max(0, damage);
                            player.GetMapPlayer(Place.Map).hp -= damage;
                            // 計算仇恨值
                            monsterInf.AttackYou(playerAbility, Math.Max(0, damage));
                            // 套用
                            monsterInfo[mapObject.infoKey] = monsterInf;

                            des.description = Description.InfoMonsterAttack;
                            des.values = new NameValueCollection();
                            des.values.Set("mapObjectId", mapObjectId + "");
                            des.values.Set("damage", damage + "");
                            des.values.Set("isCriHit", isCriHit ? "1" : "0");
                            ret.Add(des);

                            if (player.GetMapPlayer(Place.Map).IsDied == false)
                            {
                                // 增加防具經驗
                                foreach (var item in player.GetMapPlayer(Place.Map).Weapons)
                                {
                                    var cfg = ConfigItem.Get(item.prototype);
                                    if (cfg.Position == ConfigWeaponPosition.ID_hand)
                                    {
                                        continue;
                                    }
                                    if (cfg.SkillType != null)
                                    {
                                        player.GetMapPlayer(Place.Map).AddExp(cfg.SkillType, 1);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case Description.EventMonsterEscape:
                    {
                        var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
                        var mapObject = mapObjects[mapObjectId];
                        var monsterInf = monsterInfo[mapObject.infoKey];
                        monsterInf.hp = 0;
                        monsterInfo[mapObject.infoKey] = monsterInf;

                        var des = Description.Empty;
                        des.description = Description.InfoMonsterEscape;
                        des.values = new NameValueCollection();
                        des.values.Set("mapObjectId", mapObjectId + "");
                        ret.Add(des);
                    }
                    break;
                case Description.EventMonsterIdle:
                    {
                        var mapObjectId = int.Parse(work.values.Get("mapObjectId"));
                        var des = Description.Empty;
                        des.description = Description.InfoMonsterIdle;
                        des.values = new NameValueCollection();
                        des.values.Set("mapObjectId", mapObjectId + "");
                        ret.Add(des);
                    }
                    break;
                default:
                    throw new NotImplementedException(work.description);
            }
            return ret;
        }
        #endregion

        #region interaction
        // 應用所有互動並回傳結果
        public IEnumerable<Description> ApplyInteraction(PlayerDataStore player, IEnumerable<Interaction> interations)
        {
            var sorted = interations.OrderByDescending(curr =>
            {
                return curr.priority;
            });
            return sorted.SelectMany(work => { return ProcessWork(player, work.description); }).ToList(); // 呼叫ToList強迫墮性序列立即求值
        }

        // 玩家選擇一個工作後呼叫這個將選擇的工作轉為互動
        // 當中會計算這個互動的優先權
        public Interaction MakeInteraction(PlayerDataStore player, Description work)
        {
            var ret = Interaction.Empty;
            ret.description = work;
            // 依玩家閃避率設定優先權
            ret.priority = player.GetMapPlayer(Place.Map).basicAbility.FightAbility.dodge;
            return ret;
        }

        // 場地與玩家互動列表
        // 玩家每執行一個互動前都要呼叫這個方法
        public IEnumerable<Interaction> GetInteraction(PlayerDataStore player)
        {
            return FindObjects(player.GetMapPlayer(Place.Map).position).Aggregate(
                new List<Interaction>(),
                (actions, currItem) =>
                {
                    switch (currItem.type)
                    {
                        case MapObjectType.Monster:
                            {
                                var info = monsterInfo[currItem.infoKey];
                                // 怪物已死亡，不產生任何動作
                                if (info.IsDied)
                                {
                                    break;
                                }
                                // 增減勇氣值
                                info.StepBrave();
                                info.StepHate();
                                monsterInfo[currItem.infoKey] = info;

                                var cfg = ConfigMonster.Get(info.type);
                                var ability = Alg.GetBasicAbility(cfg);
                                var fightAbility = ability.FightAbility;
                                var priority = fightAbility.dodge;

                                var thinking = Helper.MonsterThink(this, player, currItem.key);
                                switch (thinking)
                                {
                                    case MonsterThinking.None:
                                        {
                                            var action = Description.Empty;
                                            action.description = Description.EventMonsterIdle;
                                            action.values = new NameValueCollection();
                                            action.values.Add("mapObjectId", currItem.key + "");

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
                                            action.values.Add("mapObjectId", currItem.key + "");

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
                                            action.values.Add("mapObjectId", currItem.key + "");

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
        public void StartWork(PlayerDataStore player, Description work)
        {
            if (player.GetMapPlayer(Place.Map).IsDied)
            {
                throw new Exception("冒險掛點，無法工作");
            }
            if (player.GetMapPlayer(Place.Map).IsWorking)
            {
                throw new Exception("目前有工作在身:" + work.description);
            }
            var consumpation = WorkConsumpation(player, work);
            if (player.GetMapPlayer(Place.Map).hp <= consumpation)
            {
                throw new Exception("體力不足，無法工作");
            }
            player.GetMapPlayer(Place.Map).currentWork = work;
            player.GetMapPlayer(Place.Map).workFinishedTime = DateTime.Now.Add(TimeSpan.FromSeconds(5)).Ticks;
        }

        public void CancelWork(PlayerDataStore player)
        {
            if (player.GetMapPlayer(Place.Map).IsWorking == false)
            {
                Debug.LogWarning("沒有工作，不必取消");
                return;
            }
            player.GetMapPlayer(Place.Map).ClearWork();
        }

        public IEnumerable<Description> ApplyWork(PlayerDataStore player)
        {
            if (player.GetMapPlayer(Place.Map).IsDied)
            {
                throw new Exception("冒險掛點，無法工作");
            }
            if (player.GetMapPlayer(Place.Map).IsWorking == false)
            {
                throw new Exception("沒有工作，不能應用");
            }
            player.GetMapPlayer(Place.Map).ClearWork();
            // 回合性招式
            var turnSkills =
                Helper.AvailableSkills(player, Place.Map)
                    .Where(s => s.Condition == ConfigConditionType.ID_turn)
                    .Select(MakeTurnSkillWork)
                    .Select(w => MakeInteraction(player, w));
            var work = player.GetMapPlayer(Place.Map).currentWork;
            // 將工作轉為互動
            var interaction = MakeInteraction(player, work);
            // 取得場景互動
            var envirInteraction = GetInteraction(player);
            // 匯總所有互動
            var allInter = envirInteraction.Concat(Enumerable.Repeat(interaction, 1)).Concat(turnSkills);
            // 依優先權處理互動
            var ret = ApplyInteraction(player, allInter);
            // 減體力, 這裡可能導致冒險者死亡
            var consumpation = WorkConsumpation(player, work);
            player.AddPlayerHp(this, -consumpation);
            return ret;
        }

        static Description MakeTurnSkillWork(ConfigSkill skill)
        {
            var des = Description.Empty;
            des.description = Description.WorkUseTurnSkill;
            des.values.Set("skillId", skill.ID);
            return des;
        }

        public IEnumerable<Description> GetWorks(PlayerDataStore player)
        {
            var works = FindObjects(player.GetMapPlayer(Place.Map).position).Aggregate(
                new List<Description>(),
                (actions, currItem) =>
                {
                    switch (currItem.type)
                    {
                        case MapObjectType.Resource:
                            {
                                var action = Description.Empty;
                                action.description = Description.WorkCollectResource;
                                action.values = new NameValueCollection();
                                action.values.Add("mapObjectId", currItem.key + "");
                                actions.Add(action);
                            }
                            break;
                        case MapObjectType.Monster:
                            {
                                var action = Description.Empty;
                                action.description = Description.WorkAttack;
                                action.values = new NameValueCollection();
                                action.values.Add("mapObjectId", currItem.key + "");
                                actions.Add(action);
                            }
                            break;
                    }
                    return actions;
                }
            );
            var monsters = FindObjects(player.GetMapPlayer(Place.Map).position).Where(i => i.type == MapObjectType.Monster);
            var hasMonster = monsters.Count() > 0;
            // 這格沒怪物就直接回傳
            if (hasMonster == false)
            {
                return works;
            }
            // 判斷有沒有單體招式
            var oneEnemySkills = Helper.AvailableSkills(player, Place.Map)
                .Where(s => s.Condition == ConfigConditionType.ID_menu)
                .Where(s => s.Characteristic != null)
                .Where(s => s.Characteristic.Contains(ConfigCharacteristic.ID_enemy));
            var hasOneEnemySkill = oneEnemySkills.Count() > 0;
            if (hasOneEnemySkill)
            {
                var skillWorks = monsters.Select(m =>
                {
                    var monInfo = monsterInfo[m.infoKey];
                    var monCfg = ConfigMonster.Get(monInfo.type);
                    var canUseSkill = oneEnemySkills.Where(s =>
                    {
                        // 由怪物特徵來算，這樣剛好能忽略ID_enemy特徵的比對
                        var charItem = Alg.ParseAbstractItem(monCfg.Characteristic);
                        // 技能特徵必須包含所有怪物特徵
                        foreach (var ci in charItem)
                        {
                            if (s.Characteristic.Contains(ci.prototype) == false)
                            {
                                return false;
                            }
                        }
                        return true;
                    });
                    var d = Description.Empty;
                    d.description = Description.WorkSelectSkillForEnemy;
                    d.values = new NameValueCollection();
                    foreach (var sid in canUseSkill.Select(s => s.ID))
                    {
                        d.values.Add("skillIds", sid);
                    }
                    d.values.Set("mapObjectId", m.key + "");
                    return d;
                });
                works.AddRange(skillWorks);
            }
            // 判斷有沒有全體招式
            var allEnemySkills = Helper.AvailableSkills(player, Place.Map)
                .Where(s => s.Condition == ConfigConditionType.ID_menu)
                .Where(s => s.Characteristic != null)
                .Where(s => s.Characteristic.Contains(ConfigCharacteristic.ID_enemyAll));
            var hasAllEnemySkill = allEnemySkills.Count() > 0;
            if (hasAllEnemySkill)
            {
                var skillWorks = allEnemySkills.Select(s =>
                {
                    var canTarget = monsters.Where(m =>
                    {
                        var monInfo = monsterInfo[m.infoKey];
                        var monCfg = ConfigMonster.Get(monInfo.type);
                        // 由怪物特徵來算，這樣剛好能忽略ID_enemy特徵的比對
                        var charItem = Alg.ParseAbstractItem(monCfg.Characteristic);
                        // 技能特徵必須包含所有怪物特徵
                        foreach (var ci in charItem)
                        {
                            if (s.Characteristic.Contains(ci.prototype) == false)
                            {
                                return false;
                            }
                        }
                        return true;
                    });
                    var d = Description.Empty;
                    d.description = Description.WorkUseSkillForEnemyAll;
                    d.values = new NameValueCollection();
                    foreach (var m in canTarget)
                    {
                        d.values.Add("mapObjectIds", m.key + "");
                    }
                    d.values.Set("skillId", s.ID + "");
                    return d;
                });
                works.AddRange(skillWorks);
            }
            return works;
        }
        #endregion

        #region store
        public string GetMemonto()
        {
            string json = JsonUtility.ToJson(this);
            return json;
        }
        public static MapDataStore FromMemonto(string json)
        {
            return JsonUtility.FromJson<MapDataStore>(json);
        }
        #endregion
    }
}