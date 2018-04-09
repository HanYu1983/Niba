using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using GameFramework.GameStructure;
using System.Linq;

namespace RobotWar
{
    public class ShowWeaponList : ShowPageList<string, KeyRef>
    {
        public bool filterNotAssign;
        public KeyRef unitKeyRef;

        private void Awake()
        {
            Model.OnWeaponListChange += UpdateView;
        }
        private void OnDestroy()
        {
            Model.OnWeaponListChange -= UpdateView;
        }
        public void SetUnit(string unitKey)
        {
            unitKeyRef.value = unitKey;
            unitKeyRef.NotifyValueChange();
            UpdateView();
        }
        public void ToggleEquip(KeyRef r)
        {
            if(unitKeyRef.IsValid == false)
            {
                return;
            }
            var unitKey = unitKeyRef.Ref;
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var weaponKey = r.Ref;

            DataAlg.AssignWeapon(model.ctx, weaponKey, unitKey);
        }
        public override List<string> GetList()
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            IEnumerable<string> weapons = new List<string>(model.ctx.weapons.Keys);
            if (filterNotAssign)
            {
                weapons = weapons.Where(w => model.ctx.weapon2Unit.ContainsKey(w) == false);
            }
            return weapons.ToList();
        }
    }
}