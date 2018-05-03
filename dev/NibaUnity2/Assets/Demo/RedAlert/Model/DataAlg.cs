using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RedAlert
{
    class Tmp
    {
        public static int counter;
    }

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
        public string transformJson;
    }

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
        public string transformJson;
    }

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

    public class Context
    {
        public Dictionary<int, Building> buildings = new Dictionary<int, Building>();
        public Dictionary<int, Unit> units = new Dictionary<int, Unit>();
        public Dictionary<int, Tech> techs = new Dictionary<int, Tech>();
        public Dictionary<int, Weapon> weapons = new Dictionary<int, Weapon>();
        public List<int> money = new List<int>();
    }

    public class DataAlg : MonoBehaviour
    {
        public static void Step(Context ctx, float dt)
        {
            foreach(var w in ctx.weapons.Values)
            {
                if(w.hot > 0)
                {
                    w.hot -= dt;
                    if(w.hot < 0)
                    {
                        w.hot = 0;
                    }
                }
            }
        }

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

        public static IEnumerable<Weapon> GetUnitWeapon(Context ctx, int player, int unit)
        {
            var u = ctx.units[unit];
            var ownTechs = ctx.techs.Values.Where(t => t.player == player);
            var weapons = ctx.weapons.Values.Where(w =>
            {
                if(w.unit != u.Key)
                {
                    return false;
                }
                var wcfg = ConfigWeapon.Get(w.prototype);
                var requestTechs = wcfg.TechDependencies.Split(',');
                var isMatchRequest = ownTechs.TakeWhile(t => requestTechs.Contains(t.prototype)).All(t => t.enabled);
                return isMatchRequest;
            });
            return weapons;
        }
         
        public static void Research(Context ctx, int player, int techKey)
        {
            var tech = ctx.techs[techKey];
            if (tech.enabled)
            {
                throw new System.Exception("already enable");
            }
            var cfg = ConfigTech.Get(tech.prototype);
            var dep = cfg.TechDependencies.Split(',');
            foreach(var d in dep)
            {
                var hasDepend = ctx.techs.Values.Where(t => t.prototype == d && t.enabled).FirstOrDefault() != null;
                if(hasDepend == false)
                {
                    throw new System.Exception("depends on "+d);
                }
            }
            if(ctx.money[player] < cfg.Cost)
            {
                throw new System.Exception("money is not enough");
            }
            ctx.money[player] -= cfg.Cost;
            tech.enabled = true;
        }

        public static IEnumerable<Tech> GetBuildingTech(Context ctx, int player, string buildingPrototype)
        {
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

        public static bool IsCanBuild(Context ctx, int player, string entityPrototype)
        {
            var requestTechs = ConfigEntity.Get(entityPrototype).TechDependencies.Split(',');
            var ownTechs = ctx.techs.Values.Where(t => t.player == player);
            var isMatchRequest = ownTechs.TakeWhile(t => requestTechs.Contains(t.prototype)).All(t => t.enabled);
            return isMatchRequest;
        }

        public static void DestroyBuilding(Context ctx, int key)
        {
            if(ctx.buildings.ContainsKey(key) == false)
            {
                throw new System.Exception("XXX:" + key);
            }
            foreach(var t in new List<Tech>(ctx.techs.Values))
            {
                if(t.player != ctx.buildings[key].player)
                {
                    continue;
                }
                var cfg = ConfigTech.Get(t.prototype);
                if(cfg.HostEntity == ctx.buildings[key].prototype)
                {
                    ctx.techs.Remove(t.Key);
                }
            }
            ctx.buildings.Remove(key);
        }

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

        public static int Build(Context ctx, int player, string entityPrototype)
        {
            if(IsCanBuild(ctx, player, entityPrototype) == false)
            {
                throw new System.Exception("can not build:"+entityPrototype);
            }
            var cfg = ConfigEntity.Get(entityPrototype);
            switch (cfg.EntityType)
            {
                case "building":
                    {
                        var en = new Building(entityPrototype);
                        en.player = player;
                        ctx.buildings.Add(en.Key, en);

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
                case "unit":
                    {
                        var en = new Unit(entityPrototype);
                        en.player = player;
                        ctx.units.Add(en.Key, en);

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

        public static IEnumerable<ConfigEntity> GetEntities(string type)
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
            var ret = Enumerable.Range(0, ConfigWeapon.ID_COUNT).Select(ConfigWeapon.Get).Where(t => t.HostEntity == entityPrototype);
            return ret;
        }
    }
}