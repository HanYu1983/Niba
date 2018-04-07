using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class ShowUnitList : ShowPageList<string, KeyRef>
    {
        void Start()
        {
            UpdateView();
            Model.OnUnitListChange += UpdateView;
        }
        void OnDestroy()
        {
            Model.OnUnitListChange -= UpdateView;
        }
        public override List<string> GetList()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            return model.ctx.units.Values.Select(v=>v.Key).ToList();
        }
    }
}