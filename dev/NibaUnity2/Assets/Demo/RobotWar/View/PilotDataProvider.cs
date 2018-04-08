using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class PilotDataProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public List<string> GetData()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            IEnumerable<string> pilots = new List<string>(model.ctx.pilots.Keys);
            return pilots.ToList();
        }
    }
}