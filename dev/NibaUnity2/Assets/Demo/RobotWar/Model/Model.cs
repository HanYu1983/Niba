using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    public class Model : MonoBehaviour
    {
        public Context ctx = new Context();
        public static Action OnUnitListChange = delegate { };

        private void Start()
        {
            DataAlg.CreatePlayer(ctx, 0, false);
            DataAlg.CreateUnit(ctx, ConfigUnit.ID_jimu, 0);
            DataAlg.CreateUnit(ctx, ConfigUnit.ID_test01, 0);
            OnUnitListChange();
        }

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