using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanPathFindingAPI;
using System;
using System.Linq;

namespace RobotWar
{
    public class Grid : IGraphNode, IEquatable<Grid>
    {
        public readonly Vector2Int pos;
        public string Key
        {
            get
            {
                return pos.y + "_" + pos.x;
            }
        }
        public Grid(Vector2Int pos)
        {
            this.pos = pos;
        }
        public int GetDistance(IGraphNode other)
        {
            return GetDistance(other as Grid);
        }

        public bool Equals(Grid other)
        {
            return Key.Equals(other.Key);
        }

        public override bool Equals(object other)
        {
            if (!(other is Grid))
                return false;

            return Equals(other as Grid);
        }

        public override int GetHashCode()
        {
            int hash = 23;

            hash = (hash * 37) + (int)pos.x;
            hash = (hash * 37) + (int)pos.y;
            return hash;
        }
    }

    public class Unit
    {
        public string key;
        public string prototype;
        public int hp, en;
        public Unit(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                this.key = new System.Guid().ToString();
            } else
            {
                this.key = key;
            }
        }
        public string Key
        {
            get
            {
                return key;
            }
        }
    }

    public class Weapon
    {
        public string key;
        public string prototype;
        public int level;
        public string ownerUnit;

        public Weapon()
        {
            key = new System.Guid().ToString();
        }
        public string Key
        {
            get
            {
                return key;
            }
        }
    }

    public class Pilot
    {
        public string key;
        public string prototype;
        public int exp;
        public string Key
        {
            get
            {
                return key;
            }
        }
    }

    public class Context
    {
        public Dictionary<string, Grid> grids = new Dictionary<string, Grid>();
        public Dictionary<string, Unit> units = new Dictionary<string, Unit>();
        public Dictionary<string, Weapon> weapons = new Dictionary<string, Weapon>();
        public Dictionary<string, Pilot> pilots = new Dictionary<string, Pilot>();
        public Dictionary<string, string> grid2Unit = new Dictionary<string, string>();
        public Dictionary<string, string> unit2Polot = new Dictionary<string, string>();
    }

    public class DataAlg
    {
        static AStarPathfinding pathFiniding = new AStarPathfinding();

        public static IPathfinding.GetNeigboursFn<Grid> GetNeigbours(Context ctx)
        {
            var dirs = new Vector2Int[]
            {
                new Vector2Int(1, 0),new Vector2Int(0, 1),new Vector2Int(-1, 0),new Vector2Int(0, -1)
            };
            return (Grid curr) =>
            {
                var ret = new Dictionary<Grid, int>();
                var oriPos = curr.pos;
                foreach(var v in dirs)
                {
                    var newPos = oriPos + v;
                    var cost = 1;
                    var gk = new Grid(newPos).Key;
                    if (ctx.grids.ContainsKey(gk) == false)
                    {
                        // continue
                    }
                    if(ctx.grid2Unit.ContainsKey(gk))
                    {
                        // continue
                    }
                    var g = ctx.grids[gk];
                    ret.Add(g, cost);
                }
                return ret;
            };
        }

        public static List<Grid> FindPath(Context ctx, Vector2Int s, Vector2Int e)
        {
            var sk = new Grid(s).Key;
            var ek = new Grid(e).Key;

            var grids = ctx.grids;
            if (grids.ContainsKey(sk) == false)
            {
                throw new Exception("xxx");
            }
            if (grids.ContainsKey(ek) == false)
            {
                throw new Exception("xxx");
            }
            return pathFiniding.FindPath(GetNeigbours(ctx), grids[sk], grids[ek]);
        }

        public static Dictionary<Grid, List<Grid>> FindAllPath(Context ctx, Vector2Int s)
        {
            var sk = new Grid(s).Key;

            var grids = ctx.grids;
            if (grids.ContainsKey(sk) == false)
            {
                throw new Exception("xxx");
            }
            return DijkstraPathfinding.FindAllPaths(GetNeigbours(ctx), grids[sk]);
        }

        public static List<Weapon> GetWeaponList(Context ctx, string unit)
        {
            return new List<Weapon>(ctx.weapons.Values).FindAll(w => w.ownerUnit == unit);
        }

        public static void AssignPilot(Context ctx, string pilot, string unit)
        {
            var pilotNotFound = ctx.pilots.ContainsKey(pilot) == false;
            if (pilotNotFound)
            {
                throw new System.Exception("pilotNotFound");
            }
            var unitNotFound = ctx.units.ContainsKey(unit) == false;
            if (unitNotFound)
            {
                throw new System.Exception("unitNotFound");
            }
            ctx.unit2Polot.Add(unit, pilot);
        }

        public static IEnumerator LoadMap(Context ctx, string path)
        {
            var request = Resources.LoadAsync<MapData>(path);
            yield return request;
            var data = request.asset as MapData;
            ctx.grids.Clear();
            foreach(var g in data.grids)
            {
                var ret = new Grid(g.pos);
                ctx.grids.Add(ret.Key, ret);
            }
        }
    }
}