using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class WeaponDataProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public bool filterNotAssign;
        public string ownerUnit;

        public List<string> GetData()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            IEnumerable<string> weapons = new List<string>(model.ctx.weapons.Keys);
            if (filterNotAssign)
            {
                weapons = weapons.Where(w => model.ctx.weapon2Unit.ContainsKey(w) == false);
            }
            var filterOwner = string.IsNullOrEmpty(ownerUnit) == false;
            if (filterOwner)
            {
                weapons = weapons.Where(w => model.ctx.weapon2Unit.ContainsKey(w)).Where(w => model.ctx.weapon2Unit[w] == ownerUnit);
            }
            return weapons.ToList();
        }
    }
}