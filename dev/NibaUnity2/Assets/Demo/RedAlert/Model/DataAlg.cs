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
    public class Building
    {
        [SerializeField]
        int key;
        public Building(string prototype)
        {
            key = Tmp.counter++;
            this.prototype = prototype;
        }
        public int Key { get { return key; } }
        public string prototype;
        public int player;
        public int usedHp;
    }

    [Serializable]
    public class Unit
    {
        [SerializeField]
        int key;
        public Unit(string prototype)
        {
            key = Tmp.counter++;
            this.prototype = prototype;
        }
        public int Key { get { return key; } }
        public string prototype;
        public int player;
        public int usedHp;
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
        public BuildingProgress(int player, string entityPrototype)
        {
            key = player + ":" + entityPrototype;
            this.player = player;
            this.entityPrototype = entityPrototype;
        }
        public string Key { get { return key; } }
        public string entityPrototype;
        public int useMoney;
        public int player;
        public BuildingProgressState state;
        public float Progress
        {
            get
            {
                var cfg = ConfigEntity.Get(entityPrototype);
                return Mathf.Min(1, useMoney / (float)cfg.Cost) * 100;
            }
        }
    }

    public class Context
    {
        public Dictionary<int, Building> buildings = new Dictionary<int, Building>();
        public Dictionary<int, Unit> units = new Dictionary<int, Unit>();
        public Dictionary<int, Tech> techs = new Dictionary<int, Tech>();
        public Dictionary<int, Weapon> weapons = new Dictionary<int, Weapon>();
        public List<int> money = new List<int>();
        public Dictionary<string, BuildingProgress> progress = new Dictionary<string, BuildingProgress>();
    }

    class SaveTmp
    {
        public List<Building> building;
        public List<Unit> units;
        public List<Tech> techs;
        public List<Weapon> weapons;
        public List<int> money;
        public List<BuildingProgress> progress;
    }

    public class DataAlg : MonoBehaviour
    {
        public static string Memonto(Context ctx)
        {
            var st = new SaveTmp();
            st.building = new List<Building>(ctx.buildings.Values);
            st.units = new List<Unit>(ctx.units.Values);
            st.techs = new List<Tech>(ctx.techs.Values);
            st.weapons = new List<Weapon>(ctx.weapons.Values);
            st.money = ctx.money;
            st.progress = new List<BuildingProgress>(ctx.progress.Values);

            var json = JsonUtility.ToJson(st);
            return json;
        }

        public static void SetMemonto(Context ctx, string json)
        {
            var st = JsonUtility.FromJson<SaveTmp>(json);
            ctx.buildings.Clear();
            ctx.units.Clear();
            ctx.techs.Clear();
            ctx.weapons.Clear();
            ctx.money.Clear();
            ctx.progress.Clear();
            foreach(var i in st.building)
            {
                ctx.buildings.Add(i.Key, i);
            }
            foreach (var i in st.units)
            {
                ctx.units.Add(i.Key, i);
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

            foreach (var p in ctx.progress.Values)
            {
                if(p.state == BuildingProgressState.Complete)
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
        }

        public static void Building(Context ctx, int player, string entityPrototype)
        {
            var wantBuild = new BuildingProgress(player, entityPrototype);
            var nowBuilding = ctx.progress.ContainsKey(wantBuild.Key);
            if (nowBuilding)
            {
                throw new System.Exception("building now:"+entityPrototype);
            }
            ctx.progress.Add(wantBuild.Key, wantBuild);
        }

        public static BuildingProgress GetBuildingProgress(Context ctx, int player, string entityPrototype)
        {
            var key = new BuildingProgress(player, entityPrototype).Key;
            if(ctx.progress.ContainsKey(key) == false)
            {
                return null;
            }
            return ctx.progress[key];
        }

        public static IEnumerable<BuildingProgress> GetBuildingProgress(Context ctx, int player)
        {
            return ctx.progress.Values.Where(p => p.player == player);
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
            var b = ctx.buildings[building];
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
        public static IEnumerable<Building> GetBuildingMenu(Context ctx, int player)
        {
            return ctx.buildings.Values.Where(b =>
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
        public static IEnumerable<ConfigEntity> GetBuildMenu(Context ctx, int player, int building)
        {
            if(ctx.buildings.ContainsKey(building) == false)
            {
                foreach (var b2 in ctx.buildings.Values)
                {
                    Debug.Log(b2.Key+":"+b2.prototype);
                }
                throw new System.Exception("building not found:"+building);
            }
            var b = ctx.buildings[building];
            return GetEntities().Where(e => e.HostBuilding == b.prototype);
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

        // 取得單位的武器
        public static IEnumerable<Weapon> GetUnitWeapon(Context ctx, int player, int unit)
        {
            var u = ctx.units[unit];
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
            var ownBuilds = ctx.buildings.Values.Where(b=>b.player == player).Select(b => b.prototype).Distinct().ToList();
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
        public static void DestroyBuilding(Context ctx, int key)
        {
            if(ctx.buildings.ContainsKey(key) == false)
            {
                throw new System.Exception("XXX:" + key);
            }
            ctx.buildings.Remove(key);
        }

        // 刪除單位
        // 會一並刪除單的擁有的武器
        public static void DestroyUnit(Context ctx, int key)
        {
            if (ctx.units.ContainsKey(key) == false)
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
            ctx.units.Remove(key);
        }

        // 
        public static int CreateEntity(Context ctx, int player, string entityPrototype)
        {
            var error = IsCanBuild(ctx, player, entityPrototype);
            if (error != null)
            {
                throw new System.Exception("can not build:"+error);
            }
            var cfg = ConfigEntity.Get(entityPrototype);
            switch (cfg.EntityType)
            {
                case ConfigEntityType.ID_building:
                    {
                        var en = new Building(entityPrototype);
                        en.player = player;
                        ctx.buildings.Add(en.Key, en);

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

                        return en.Key;
                    }
                case ConfigEntityType.ID_unit:
                    {
                        var en = new Unit(entityPrototype);
                        en.player = player;
                        ctx.units.Add(en.Key, en);

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
    }
}