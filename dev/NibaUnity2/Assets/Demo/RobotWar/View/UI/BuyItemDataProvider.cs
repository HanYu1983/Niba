using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class BuyItemDataProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public List<string> GetData()
        {
            var itemCfgs = Enumerable.Range(0, ConfigItem.ID_COUNT).Select(ConfigItem.Get).Select(cfg=>cfg.id);
            return itemCfgs.ToList();
        }
    }
}