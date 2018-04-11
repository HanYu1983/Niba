using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    public class SelectWeaponTargetState : DefaultControlState
    {
        Unit unit;
        string weapon;
        List<Grid> ranges;
        bool isReady;
        Grid selectedGrid;

        public SelectWeaponTargetState(Unit unit, string weapon)
        {
            this.unit = unit;
            this.weapon = weapon;
        }
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;

            View.SetGridColor(null, Color.white);
            var weaponObj = Model.mapCtx.weapons[weapon];
            var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
            var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;

            switch (weaponCfg.shape)
            {
                case ConfigShape.ID_forward:
                    {
                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, Direction.Up);
                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                        View.SetGridColor(ranges, Color.red);
                        this.ranges = new List<Grid>(ranges);
                    }
                    break;
                default:
                    {
                        var ranges = DataAlg.FindAllRange(Model.mapCtx, weaponCfg.minRange, weaponCfg.maxRange, pos);
                        View.SetGridColor(ranges.Keys, Color.red);
                        this.ranges = new List<Grid>(ranges.Keys);
                    }
                    break;
            }

            var menu = View.GetUnitMenu();
            menu.CreateMenu(Model, new List<UnitMenuItem>()
            {
                UnitMenuItem.Confirm,
                UnitMenuItem.Cancel
            });
            menu.OnSelect += OnSelect;
        }
        public override void OnExitState()
        {
            GridView.OnClick -= OnClick;
            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
            menu.gameObject.SetActive(false);
        }
        void OnSelect(Menu<UnitMenuItem> menu)
        {
            switch (menu.Selected)
            {
                case UnitMenuItem.Cancel:
                    Holder.ChangeState(new SelectWeaponState(unit));
                    break;
                case UnitMenuItem.Confirm:
                    {
                        if (isReady == false)
                        {
                            Debug.LogWarning("XXXX");
                            return;
                        }
                        var weaponObj = Model.mapCtx.weapons[weapon];
                        var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
                        switch (weaponCfg.shape)
                        {
                            case ConfigShape.ID_forward:
                            case ConfigShape.ID_center:
                                {
                                    var task = DataAlg.CreateRangeAttackTask(Model.mapCtx, unit.Key, weapon, selectedGrid.pos);
                                    DataAlg.PushTask(Model.mapCtx, task);
                                    DataAlg.PassUnit(Model.mapCtx, unit.Key);
                                    Holder.ChangeState(new UpdateCTState());
                                }
                                break;
                            default:
                                {
                                    var targetKey = Model.mapCtx.grid2Unit[selectedGrid.Key];
                                    var task = DataAlg.CreateAttackTask(Model.mapCtx, unit.Key, weapon, new List<string>() { targetKey });
                                    DataAlg.PushTask(Model.mapCtx, task);
                                    DataAlg.PassUnit(Model.mapCtx, unit.Key);
                                    Holder.ChangeState(new UpdateCTState());
                                }
                                break;
                        }
                    }
                    break;
            }
        }

        void OnClick(GridView gv)
        {
            var gk = new Grid(gv.coord).Key;
            var g = Model.mapCtx.grids[gk];

            isReady = false;
            selectedGrid = g;

            var clickPos = gv.coord;
            var weaponCfg = ConfigWeapon.Get(Model.mapCtx.weapons[weapon].prototype);
            switch (weaponCfg.shape)
            {
                case ConfigShape.ID_center:
                    {
                        var isValidPos = ranges.Contains(g);
                        if (isValidPos == false)
                        {
                            Debug.LogWarning("不合法的位置");
                            return;
                        }
                        var vecs = DataAlg.GetCenterVecs(weaponCfg.shapeRange);
                        var centerRange = vecs.Select(v => v + clickPos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                        View.SetGridColor(null, Color.white);
                        View.SetGridColor(this.ranges, Color.red);
                        View.SetGridColor(centerRange, Color.magenta);

                        isReady = true;
                    }
                    break;
                case ConfigShape.ID_forward:
                    {
                        var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;
                        var dir = DataAlg.GetDirection(pos, clickPos);

                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, dir);
                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                        View.SetGridColor(null, Color.white);
                        View.SetGridColor(ranges, Color.red);
                        this.ranges = new List<Grid>(ranges);

                        isReady = true;
                    }
                    break;
                default:
                    {
                        var isValidPos = ranges.Contains(g);
                        if (isValidPos == false)
                        {
                            Debug.LogWarning("不合法的位置");
                            return;
                        }
                        // if the weapon is single, check target
                        var hasUnit = Model.mapCtx.grid2Unit.ContainsKey(gk);
                        if (hasUnit)
                        {
                            var targetKey = Model.mapCtx.grid2Unit[gk];
                            var target = Model.mapCtx.units[targetKey];
                            var unitOwner = Model.mapCtx.unit2Player[unit.Key];
                            var unitOwnerObj = Model.mapCtx.players[unitOwner];
                            var targetOwner = Model.mapCtx.unit2Player[targetKey];
                            var targetOwnerObj = Model.mapCtx.players[targetOwner];
                            if (unit != target && unitOwnerObj.team != targetOwnerObj.team)
                            {
                                isReady = true;
                            }


                            /*
                            var targetKey = Model.mapCtx.grid2Unit[gk];
                            var target = Model.mapCtx.units[targetKey];
                            var ownerObj = Model.mapCtx.players[unit.owner];
                            var targetOwnerObj = Model.mapCtx.players[target.owner];
                            if (unit != target && ownerObj.team != targetOwnerObj.team)
                            {
                                var task = DataAlg.CreateAttackTask(Model.mapCtx, unit.Key, weapon, new List<string>() { targetKey });
                                DataAlg.PushTask(Model.mapCtx, task);
                                DataAlg.PassUnit(Model.mapCtx, unit.Key);
                                Holder.ChangeState(new UpdateCTState());
                            }
                            else
                            {
                                Debug.LogWarning("不合法的目標");
                            }*/
                        }
                    }
                    break;
            }

        }
    }
}