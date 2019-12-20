using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class UnitDataProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public List<string> GetData()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            return model.ctx.units.Values.Select(v => v.Key).ToList();
        }
    }
}