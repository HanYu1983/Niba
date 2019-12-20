using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class BuyWeaponDataProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public List<string> GetData()
        {
            var itemCfgs = Enumerable.Range(0, ConfigWeapon.ID_COUNT).Select(ConfigWeapon.Get).Select(cfg=>cfg.id);
            return itemCfgs.ToList();
        }
    }
}