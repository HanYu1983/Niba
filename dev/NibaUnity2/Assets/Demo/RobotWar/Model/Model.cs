using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RobotWar
{
    public class Model : MonoBehaviour
    {
        public Context ctx = new Context();
        public void CreateMap(MapData mapData)
        {
            ctx.grids.Clear();
            foreach (var g in mapData.grids)
            {
                var ret = new Grid(g.pos);
                ctx.grids.Add(ret.Key, ret);
            }
        }
    }
}