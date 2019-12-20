using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class ItemDataProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public bool filterNotAssign;
        public string ownerUnit;

        public List<string> GetData()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            IEnumerable<string> items = new List<string>(model.ctx.items.Keys);
            if (filterNotAssign)
            {
                items = items.Where(w => model.ctx.item2Unit.ContainsKey(w) == false);
            }
            var filterOwner = string.IsNullOrEmpty(ownerUnit) == false;
            if (filterOwner)
            {
                items = items.Where(w => model.ctx.item2Unit.ContainsKey(w)).Where(w => model.ctx.item2Unit[w] == ownerUnit);
            }
            return items.ToList();
        }
    }
}