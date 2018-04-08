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
        public static Action OnWeaponListChange = delegate { };

        private void Start()
        {
            CreateStartValue();
        }

        public void CreateStartValue()
        {
            DataAlg.CreatePlayer(ctx, 0, false);
            var unit = DataAlg.CreateUnit(ctx, ConfigUnit.ID_jimu, 0);
            DataAlg.CreateUnit(ctx, ConfigUnit.ID_test01, 0);

            DataAlg.CreateWeapon(ctx, ConfigWeapon.ID_bigGun);
            DataAlg.CreateWeapon(ctx, ConfigWeapon.ID_bomb);

            var kira = DataAlg.CreatePilot(ctx, ConfigPilot.ID_kira);
            DataAlg.CreatePilot(ctx, ConfigPilot.ID_solider1);
            DataAlg.CreatePilot(ctx, ConfigPilot.ID_solider1);

            DataAlg.AssignPilot(ctx, kira.Key, unit.Key);

            OnUnitListChange();
            OnWeaponListChange();
        }

        public string selectUnit;

        public bool HasSelectUnit
        {
            get
            {
                return string.IsNullOrEmpty(selectUnit) == false;
            }
        }

        public void SelectUnit(KeyRef unitKeyRef)
        {
            if(unitKeyRef.IsValid == false)
            {
                selectUnit = null;
                return;
            }
            selectUnit = unitKeyRef.Ref;
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