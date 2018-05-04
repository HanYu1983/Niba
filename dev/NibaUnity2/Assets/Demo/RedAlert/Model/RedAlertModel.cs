using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RedAlert
{
    public class RedAlertModel : MonoBehaviour
    {
        public Action OnBuildingChange = delegate { };
        public Action onMoneyChange = delegate { };

        public Context ctx = new Context();

        [ContextMenu("TestData")]
        public void TestData()
        {
            ctx.money.Add(10000);

            DataAlg.CreateEntity(ctx, 0, ConfigEntity.ID_gdiHome);

            var buildingMenus = DataAlg.GetBuildingMenu(ctx, 0);
            foreach (var b in buildingMenus)
            {
                Debug.Log(b.prototype);

                var buildMenus2 = DataAlg.GetBuildMenu(ctx, 0, b.Key);
                foreach (var b2 in buildMenus2)
                {
                    Debug.Log(b2.Name);
                }
            }

            var techs = DataAlg.GetBuildingTechMenu(ctx, 0, ConfigEntity.ID_gdiHome);
            foreach (var t in techs)
            {
                Debug.Log(t.prototype+":"+t.enabled);
            }

            var techs2 = DataAlg.GetUnitTechMenu(ConfigEntity.ID_gdiTank);
            foreach (var t in techs2)
            {
                Debug.Log(t.Id);
                var t2 = DataAlg.GetTechWithTechPrototype(ctx, 0, t.Id);
                if (t2 != null)
                {
                    Debug.Log(t2.prototype + ":" + t2.enabled);
                }
            }

            var factory = DataAlg.CreateEntity(ctx, 0, ConfigEntity.ID_gdiFactory);
            var buildMenus = DataAlg.GetBuildMenu(ctx, 0, factory);
            foreach (var b2 in buildMenus)
            {
                Debug.Log(b2.Name);
            }

            OnBuildingChange();
            onMoneyChange();
        }
    }
}