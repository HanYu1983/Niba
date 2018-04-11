using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    public class SelectWeaponState : DefaultControlState
    {
        Unit unit;
        public SelectWeaponState(Unit unit)
        {
            this.unit = unit;
        }
        public override void OnEnterState()
        {
            var weapons = DataAlg.GetWeaponList(Model.mapCtx, unit.Key).Select(w => w.Key).ToList();
            weapons.Add(WeaponMenu.MENU_CANCEL);

            var menu = View.GetWeaponMenu();
            menu.CreateMenu(Model, weapons);
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            var menu = View.GetWeaponMenu();
            menu.gameObject.SetActive(false);
            menu.OnSelect -= OnSelect;
            View.SetGridColor(null, Color.white);
        }
        //string lastSelectWeapon;
        //List<Grid> lastRange;
        void OnSelect(Menu<string> menu)
        {
            var item = menu.Selected;
            if (item == WeaponMenu.MENU_CANCEL)
            {
                Holder.ChangeState(new SelectUnitActionState(unit));
            }
            else
            {
                var weapon = item;
                Holder.ChangeState(new SelectWeaponTargetState(unit, weapon));
                /*
                var weapon = item;
                if (lastSelectWeapon == weapon)
                {
                    Holder.ChangeState(new SelectWeaponTargetState(unit, weapon, lastRange));
                }
                else
                {
                    View.SetGridColor(null, Color.white);

                    var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;
                    var weaponObj = Model.mapCtx.weapons[weapon];
                    var cfg = ConfigWeapon.Get(weaponObj.prototype);
                    var isSingle = string.IsNullOrEmpty(cfg.shape);
                    if (isSingle)
                    {
                        var ranges = DataAlg.FindAllRange(Model.mapCtx, cfg.minRange, cfg.maxRange, pos);
                        View.SetGridColor(ranges.Keys, Color.red);
                        lastRange = new List<Grid>(ranges.Keys);
                    }
                    else
                    {

                    }
                }
                lastSelectWeapon = weapon;
                */
            }
        }
    }
}