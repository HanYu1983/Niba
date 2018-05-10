using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using System;

namespace RedAlert
{
    class Tmp
    {
        public static int counter;
    }

    [Serializable]
    public class Entity
    {
        [SerializeField]
        int key;
        public Entity(string prototype)
        {
            key = Tmp.counter++;
            this.prototype = prototype;
        }
        public int Key { get { return key; } }
        public string prototype;
        public int player;
        public int usedHp;
        public Vector3 position;
        public Vector3 rotation;
        public int goldAmount;
    }

    [Serializable]
    public class Tech
    {
        [SerializeField]
        int key;
        public Tech(string prototype)
        {
            key = Tmp.counter++;
            this.prototype = prototype;
        }
        public int Key { get { return key; } }
        public string prototype;
        public int player;
        public bool enabled;
    }

    [Serializable]
    public class Weapon
    {
        [SerializeField]
        int key;
        public Weapon(string prototype, int unit)
        {
            key = Tmp.counter++;
            this.prototype = prototype;
            this.unit = unit;
        }
        public int Key { get { return key; } }
        public string prototype;
        public int unit;

        public float hot;
    }

    public enum BuildingProgressState
    {
        Building, Complete, Hold
    }

    [Serializable]
    public class BuildingProgress
    {
        [SerializeField]
        string key;
        public BuildingProgress(int player, int host, string entityPrototype)
        {
            key = player + ":" + host +":"+ entityPrototype;
            this.player = player;
            this.host = host;
            this.entityPrototype = entityPrototype;
        }
        public string Key { get { return key; } }
        public int player;
        public int host;
        public string entityPrototype;

        public int useMoney;
        public BuildingProgressState state;
        public float Progress
        {
            get
            {
                if (host == ControllerHelper.TechHost)
                {
                    var cfg = ConfigTech.Get(entityPrototype);
                    return Mathf.Min(1, useMoney / (float)cfg.Cost) * 100;
                }
                else
                {
                    var cfg = ConfigEntity.Get(entityPrototype);
                    return Mathf.Min(1, useMoney / (float)cfg.Cost) * 100;
                }
            }
        }
    }

    [Serializable]
    public class Resource
    {
        [SerializeField]
        int key;
        public Resource(string prototype)
        {
            key = Tmp.counter++;
            this.prototype = prototype;
        }
        public int Key { get { return key; } }
        public string prototype;
        public Vector3 position;
        public int usedGoldAmount;
    }

    [Serializable]
    public class Bullet
    {
        [SerializeField]
        int key;
        public Bullet(string weaponPrototype)
        {
            key = Tmp.counter++;
            this.weaponPrototype = weaponPrototype;
        }
        public int Key { get { return key; } }
        public string weaponPrototype;
        public int player;
        public Vector3 position;
        public Vector3 velocity;
    }

    public class Context
    {
        public Dictionary<int, Entity> entities = new Dictionary<int, Entity>();
        public Dictionary<int, Tech> techs = new Dictionary<int, Tech>();
        public Dictionary<int, Weapon> weapons = new Dictionary<int, Weapon>();
        public List<int> money = new List<int>();
        public Dictionary<string, BuildingProgress> progress = new Dictionary<string, BuildingProgress>();
        public List<BuildingProgress> pendingProgress = new List<BuildingProgress>();
        public Dictionary<int, Resource> resources = new Dictionary<int, Resource>();
        public Dictionary<int, Bullet> bullets = new Dictionary<int, Bullet>();
    }

    class SaveTmp
    {
        public List<Entity> entities;
        public List<Tech> techs;
        public List<Weapon> weapons;
        public List<int> money;
        public List<BuildingProgress> progress;
        public List<BuildingProgress> pendingProgress;
        public List<Resource> resources;
        public List<Bullet> bullets;
    }

    public class DataAlg : MonoBehaviour
    {
        public static string Memonto(Context ctx)
        {
            var st = new SaveTmp();
            st.entities = new List<Entity>(ctx.entities.Values);
            st.techs = new List<Tech>(ctx.techs.Values);
            st.weapons = new List<Weapon>(ctx.weapons.Values);
            st.money = ctx.money;
            st.progress = new List<BuildingProgress>(ctx.progress.Values);
            st.pendingProgress = ctx.pendingProgress;
            st.resources = new List<Resource>(ctx.resources.Values);
            st.bullets = new List<Bullet>(ctx.bullets.Values);
            var json = JsonUtility.ToJson(st);
            return json;
        }

        public static void SetMemonto(Context ctx, string json)
        {
            var st = JsonUtility.FromJson<SaveTmp>(json);
            ctx.entities.Clear();
            ctx.techs.Clear();
            ctx.weapons.Clear();
            ctx.money.Clear();
            ctx.progress.Clear();
            ctx.pendingProgress.Clear();
            ctx.resources.Clear();
            ctx.bullets.Clear();
            foreach (var i in st.entities)
            {
                ctx.entities.Add(i.Key, i);
            }
            foreach (var i in st.techs)
            {
                ctx.techs.Add(i.Key, i);
            }
            foreach (var i in st.weapons)
            {
                ctx.weapons.Add(i.Key, i);
            }
            foreach (var i in st.money)
            {
                ctx.money.Add(i);
            }
            foreach (var i in st.progress)
            {
                ctx.progress.Add(i.Key, i);
            }
            foreach (var i in st.pendingProgress)
            {
                ctx.pendingProgress.Add(i);
            }
            foreach (var i in st.resources)
            {
                ctx.resources.Add(i.Key, i);
            }
            foreach (var i in st.bullets)
            {
                ctx.bullets.Add(i.Key, i);
            }
        }

        public static void Step(Context ctx, float dt)
        {
            foreach (var w in ctx.weapons.Values)
            {
                if (w.hot > 0)
                {
                    w.hot -= dt;
                    if (w.hot < 0)
                    {
                        w.hot = 0;
                    }
                }
            }
            // 這裡處理建物和單位
            foreach (var p in ctx.progress.Values)
            {
                if(p.state == BuildingProgressState.Complete)
                {
                    continue;
                }
                if(p.host == ControllerHelper.TechHost)
                {
                    continue;
                }
                var buildCfg = ConfigEntity.Get(p.entityPrototype);
                var cost = buildCfg.Cost;
                var buildTime = buildCfg.BuildTime;
                // 計算每次更新週期的花費
                var costPerDeltaTime = cost;
                if (buildTime > 0)
                {
                    costPerDeltaTime = (int)(dt * cost / buildTime);
                    costPerDeltaTime = Mathf.Max(1, costPerDeltaTime);
                }
                // 若金錢不足就跳到這一個
                if(ctx.money[p.player] < costPerDeltaTime)
                {
                    continue;
                }
                // 計算在這個項目中花了多少錢
                p.useMoney += costPerDeltaTime;
                // 花錢
                ctx.money[p.player] -= costPerDeltaTime;
                // 若花足了代表建完了
                if (p.useMoney > cost)
                {
                    // 把多扣的金額加回去
                    var offset = p.useMoney - cost;
                    ctx.money[p.player] += offset;
                    // 完成
                    p.state = BuildingProgressState.Complete;
                    continue;
                }
            }

            // 這裡處理科技研究
            foreach (var p in ctx.progress.Values)
            {
                if (p.state == BuildingProgressState.Complete)
                {
                    continue;
                }
                if (p.host != ControllerHelper.TechHost)
                {
                    continue;
                }
                var cfg = ConfigTech.Get(p.entityPrototype);
                var cost = cfg.Cost;
                var buildTime = cfg.BuildTime;
                // 計算每次更新週期的花費
                var costPerDeltaTime = cost;
                if (buildTime > 0)
                {
                    costPerDeltaTime = (int)(dt * cost / buildTime);
                    costPerDeltaTime = Mathf.Max(1, costPerDeltaTime);
                }
                // 若金錢不足就跳到這一個
                if (ctx.money[p.player] < costPerDeltaTime)
                {
                    continue;
                }
                // 計算在這個項目中花了多少錢
                p.useMoney += costPerDeltaTime;
                // 花錢
                ctx.money[p.player] -= costPerDeltaTime;
                // 若花足了代表建完了
                if (p.useMoney > cost)
                {
                    // 把多扣的金額加回去
                    var offset = p.useMoney - cost;
                    ctx.money[p.player] += offset;
                    // 完成
                    p.state = BuildingProgressState.Complete;
                    continue;
                }
            }
        }

        public static void Building(Context ctx, int player, int host, string entityPrototype)
        {
            var wantBuild = new BuildingProgress(player, host, entityPrototype);
            var isOccupy = ctx.progress.Values.Any(p => p.host == host);
            if (isOccupy)
            {
                ctx.pendingProgress.Add(wantBuild);
                return;
            }
            /*
            var nowBuilding = ctx.progress.ContainsKey(wantBuild.Key);
            if (nowBuilding)
            {
                var cfg = ConfigEntity.Get(entityPrototype);
                if(cfg.EntityType != ConfigEntityType.ID_building)
                {
                    ctx.pendingProgress.Add(wantBuild);
                    return;
                }
                else
                {
                    throw new System.Exception("building now:" + entityPrototype);
                }
            }*/
            ctx.progress.Add(wantBuild.Key, wantBuild);
        }

        public static BuildingProgress GetBuildingProgress(Context ctx, int player, int host, string entityPrototype)
        {
            var key = new BuildingProgress(player, host, entityPrototype).Key;
            if(ctx.progress.ContainsKey(key) == false)
            {
                return null;
            }
            return ctx.progress[key];
        }

        public static IEnumerable<BuildingProgress> GetBuildingProgress(Context ctx)
        {
            return ctx.progress.Values;
        }

        public static void CancelBuildingProgress(Context ctx, string key)
        {
            if(ctx.progress.ContainsKey(key) == false)
            {
                throw new System.Exception("xxx");
            }
            var p = ctx.progress[key];
            ctx.money[p.player] += p.useMoney;
            ctx.progress.Remove(key);
        }

        public static void RemoveBuildingProgress(Context ctx, string key)
        {
            if (ctx.progress.ContainsKey(key) == false)
            {
                throw new System.Exception("xxx");
            }
            ctx.progress.Remove(key);

            // add pending
            foreach(var p in new List<BuildingProgress>(ctx.pendingProgress))
            {
                /*
                if (ctx.progress.ContainsKey(p.Key))
                {
                    continue;
                }
                ctx.pendingProgress.Remove(p);
                ctx.progress.Add(p.Key, p);
                */
                var isOccupy = ctx.progress.Values.Any(p2 => p2.host == p.host);
                if (isOccupy)
                {
                    continue;
                }
                ctx.pendingProgress.Remove(p);
                ctx.progress.Add(p.Key, p);
            }
        }

        public static int GetPendingBuildingProgressCount(Context ctx, string key)
        {
            return ctx.pendingProgress.Where(p => p.Key == key).Count();
        }

        public static Tech GetTechWithTechPrototype(Context ctx, int player, string techPrototype)
        {
            return ctx.techs.Values.Where(t =>
            {
                if(t.player != player)
                {
                    return false;
                }
                if(t.prototype != techPrototype)
                {
                    return false;
                }
                return true;
            }).FirstOrDefault();
        }

        public static bool StolenBuilding(Context ctx, int player, int building)
        {
            var b = ctx.entities[building];
            if(b.player == player)
            {
                return false;
            }
            b.player = player;
            // 偷建物必須把科技重新加入一次
            // 請參照Build
            var techs = GetTechs(b.prototype);
            foreach (var t in techs)
            {
                var alreadyHas = ctx.techs.Values.Where(ownTech => ownTech.player == player && ownTech.prototype == t.Id).FirstOrDefault() != null;
                if (alreadyHas)
                {
                    continue;
                }
                var newT = new Tech(t.Id);
                newT.player = player;
                if (t.Cost == 0)
                {
                    newT.enabled = true;
                }
                ctx.techs.Add(newT.Key, newT);
            }
            return true;
        }

        public static IEnumerable<ConfigTech> GetUnitTechMenu(string entityPrototype)
        {
            var ec = ConfigEntity.Get(entityPrototype);
            if (ec.EntityType != ConfigEntityType.ID_unit)
            {
                throw new System.Exception("XXX");
            }
            return Enumerable.Range(0, ConfigTech.ID_COUNT).Select(ConfigTech.Get).Where(cfg =>
            {
                if (string.IsNullOrEmpty(cfg.EffectEntities))
                {
                    return false;
                }
                return cfg.EffectEntities.Split(',').Contains(entityPrototype);
            });
        }

        // 取得建物列表
        public static IEnumerable<Entity> GetBuildingMenu(Context ctx, int player)
        {
            return ctx.entities.Values.Where(b =>
            {
                if(b.player != player)
                {
                    return false;
                }
                var hasUnitCanBuild = GetEntities().Any(u => u.HostBuilding == b.prototype);
                return hasUnitCanBuild;
            });
        }
        
        // 依建物取得可建列表, 包含建物和單位
        public static IEnumerable<ConfigEntity> GetBuildMenu(Context ctx, int player, string entityPrototype)
        {
            return GetEntities().Where(e => e.HostBuilding == entityPrototype);
        }

        // 發射武器, 回傳true代表發射成功
        public static bool FireWeapon(Context ctx, int weapon)
        {
            var w = ctx.weapons[weapon];
            if(w.hot > 0)
            {
                return false;
            }
            w.hot += ConfigWeapon.Get(w.prototype).CostHot;
            return true;
        }

        public static int CreateBullet(Context ctx, int weapon, Vector3 position, Vector3 velocity)
        {
            var w = ctx.weapons[weapon];
            var u = ctx.entities[w.unit];
            var b = new Bullet(w.prototype);
            b.position = position;
            b.velocity = velocity;
            b.player = u.player;
            ctx.bullets.Add(b.Key, b);
            return b.Key;
        }

        // 取得單位的武器
        public static IEnumerable<Weapon> GetUnitWeapon(Context ctx, int player, int unit)
        {
            var u = ctx.entities[unit];
            var weapons = ctx.weapons.Values.Where(w => w.unit == u.Key);
            return weapons;
        }
        
        // 是否能研發
        public static string IsCanResearch(Context ctx, int player, int techKey)
        {
            var tech = ctx.techs[techKey];
            if (tech.enabled)
            {
                return "已研發完成";
            }
            // 判斷前置科技
            var cfg = ConfigTech.Get(tech.prototype);
            if(string.IsNullOrEmpty(cfg.TechDependencies) == false)
            {
                var dep = cfg.TechDependencies.Split(',');
                foreach (var d in dep)
                {
                    var hasDepend = ctx.techs.Values.Where(t => t.prototype == d && t.enabled).FirstOrDefault() != null;
                    if (hasDepend == false)
                    {
                        return "缺少前置科技:"+d;
                    }
                }
            }
            // 消費
            if(ctx.money[player] < cfg.Cost)
            {
                return "錢不夠";
            }
            return null;
        }

        // 取得建物的科技
        // 同prototype的建物會取得同樣的科技
        public static IEnumerable<Tech> GetBuildingTechMenu(Context ctx, int player, string buildingPrototype)
        {
            var ec = ConfigEntity.Get(buildingPrototype);
            if (ec.EntityType != ConfigEntityType.ID_building)
            {
                throw new System.Exception("XXX");
            }
            return ctx.techs.Values.Where(t =>
            {
                if(t.player != player)
                {
                    return false;
                }
                var tcfg = ConfigTech.Get(t.prototype);
                if(tcfg.HostEntity != buildingPrototype)
                {
                    return false;
                }
                return true;
            });
        }

        // 是否可建造
        public static string IsCanBuild(Context ctx, int player, string entityPrototype)
        {
            // 需求科技
            var requestTechs = string.IsNullOrEmpty(ConfigEntity.Get(entityPrototype).TechDependencies) ?
                new string[0] :
                ConfigEntity.Get(entityPrototype).TechDependencies.Split(',');            
            // 擁有建物
            var ownBuilds = ctx.entities.Values.Where(b=>b.player == player).Select(b => b.prototype).Distinct().ToList();
            foreach(var r in requestTechs)
            {
                // 取得現有科技
                var ownTech = ctx.techs.Values.Where(t => t.prototype == r).FirstOrDefault();
                if(ownTech == null)
                {
                    return "科技不足:"+r;
                }
                // 如果現有科技的建物不存在就不能建造
                var ownTechCfg = ConfigTech.Get(ownTech.prototype);
                if (ownBuilds.Contains(ownTechCfg.HostEntity) == false)
                {
                    return "科技建物已不存在:" + ownTechCfg.HostEntity;
                }
                // 如果科技還沒研發完成不能建造
                if(ownTech.enabled == false)
                {
                    return "科技還沒研發完成:" + r;
                }
            }
            return null;
        }

        // 刪除建物
        // 注意: 這裡不能將建物的科技刪除
        // 會一並刪除單的擁有的武器
        public static void DestroyBuilding(Context ctx, int key)
        {
            if(ctx.entities.ContainsKey(key) == false)
            {
                throw new System.Exception("XXX:" + key);
            }
            foreach (var w in new List<Weapon>(ctx.weapons.Values))
            {
                if (w.unit != key)
                {
                    continue;
                }
                ctx.weapons.Remove(w.Key);
            }
            ctx.entities.Remove(key);
        }

        public static int ConsumeResource(Context ctx, int building, int car, int amount)
        {
            var u = ctx.entities[car];
            amount = Mathf.Min(amount, u.goldAmount);
            u.goldAmount -= amount;

            var cfg = ConfigResource.Get(ConfigResource.ID_gold);
            var b = ctx.entities[building];
            var earn = amount * cfg.Value;
            if(ctx.money.Count <= b.player)
            {
                Debug.LogError("not yet set player money:"+b.player);
                return 0;
            }
            ctx.money[b.player] += earn;

            return amount;
        }

        public static int CollectResource(Context ctx, int entity, int resource, int amount)
        {
            var u = ctx.entities[entity];
            var r = ctx.resources[resource];
            var total = ConfigResource.Get(r.prototype).Amount;
            amount = Mathf.Min(amount, total - r.usedGoldAmount);
            r.usedGoldAmount += amount;
            u.goldAmount += amount;
            return amount;
        }

        public static int CreateResource(Context ctx, string prototype)
        {
            var r = new Resource(prototype);
            ctx.resources.Add(r.Key, r);
            return r.Key;
        }

        // 
        public static int CreateEntity(Context ctx, int player, string entityPrototype, bool force = false)
        {
            if (force == false)
            {
                var error = IsCanBuild(ctx, player, entityPrototype);
                if (error != null)
                {
                    throw new System.Exception("can not build:" + error);
                }
            }
            var cfg = ConfigEntity.Get(entityPrototype);
            switch (cfg.EntityType)
            {
                case ConfigEntityType.ID_unit:
                case ConfigEntityType.ID_building:
                    {
                        var en = new Entity(entityPrototype);
                        en.player = player;
                        ctx.entities.Add(en.Key, en);

                        // 加入建物的科技, 包含未研發的科技
                        // 研發費用為0的代表會自動標記為研發完成
                        // 注意:
                        // 同一個建物不會把同樣的科技再加入一次
                        // 科技一加入後就不會消失, 已研發的科技也不會因為建物消失而消失
                        var techs = GetTechs(entityPrototype);
                        foreach(var t in techs)
                        {
                            var alreadyHas = ctx.techs.Values.Where(ownTech => ownTech.player == player && ownTech.prototype == t.Id).FirstOrDefault() != null;
                            if (alreadyHas)
                            {
                                continue;
                            }
                            var newT = new Tech(t.Id);
                            newT.player = player;
                            if(t.Cost == 0)
                            {
                                newT.enabled = true;
                            }
                            ctx.techs.Add(newT.Key, newT);
                        }

                        // 加入單位的武器
                        var weapons = GetWeapons(entityPrototype);
                        foreach (var w in weapons)
                        {
                            var newW = new Weapon(w.Id, en.Key);
                            ctx.weapons.Add(newW.Key, newW);
                        }

                        return en.Key;
                    }
                default:
                    throw new System.Exception("no type:"+cfg.EntityType);
            }
        }

        public static IEnumerable<ConfigEntity> GetEntities(string type = null)
        {
            var ret = Enumerable.Range(0, ConfigEntity.ID_COUNT).Select(ConfigEntity.Get);
            if(type != null)
            {
                ret = ret.Where(e => e.EntityType == type);
            }
            return ret;
        }

        public static IEnumerable<ConfigTech> GetTechs(string entityPrototype)
        {
            var ret = Enumerable.Range(0, ConfigTech.ID_COUNT).Select(ConfigTech.Get).Where(t => t.HostEntity == entityPrototype);
            return ret;
        }

        public static IEnumerable<ConfigWeapon> GetWeapons(string entityPrototype)
        { 
            var ret = Enumerable.Range(0, ConfigWeapon.ID_COUNT).Select(ConfigWeapon.Get).Where(t =>
            {
                if (string.IsNullOrEmpty(t.HostEntities))
                {
                    return false;
                }
                return t.HostEntities.Split(',').Contains(entityPrototype);
            });
            return ret;
        }

        public static IEnumerable<Resource> GetClosestResource(Context ctx, Vector3 origin)
        {
            return ctx.resources.Values.OrderBy(r =>
            {
                var dist = Vector3.Distance(origin, r.position);
                return dist;
            });
        }

        public static IEnumerable<Entity> GetClosestEntity(Context ctx, int player, string prototype, string entityType, Vector3 origin)
        {
            return ctx.entities.Values.Where(r =>
            {
                if (player >= 0)
                {
                    if (r.player != player)
                    {
                        return false;
                    }
                }
                if (prototype != null)
                {
                    if (r.prototype != prototype)
                    {
                        return false;
                    }
                }
                if(entityType != null)
                {
                    var cfg = ConfigEntity.Get(r.prototype);
                    if(cfg.EntityType != entityType)
                    {
                        return false;
                    }
                }
                return true;
            }).OrderBy(r =>
            {
                var dist = Vector3.Distance(origin, r.position);
                return dist;
            });
        }
    }
}