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

        // 武器射程範圍暫存, 這樣就只需要計算1次
        List<Grid> ranges;

        // 是否選擇了正確的對象
        // 單體武器 > 機體
        // 直向型範兵 > 地點
        // 其它範兵 > 地點
        bool isReady;

        // 暫存點擊的格子
        Grid selectedGrid;

        public SelectWeaponTargetState(Unit unit, string weapon)
        {
            this.unit = unit;
            this.weapon = weapon;
        }
        public override void OnEnterState()
        {
            GridView.OnClick += OnClick;
            // 清除所有格子顏色
            View.SetGridColor(null, Color.white);
            // 準備計算武器射程範圍並顯示
            var weaponObj = Model.mapCtx.weapons[weapon];
            var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
            var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;
            switch (weaponCfg.shape)
            {
                case ConfigShape.ID_forward:
                    {
                        // 直向型範兵的範圍等殊處理
                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, Direction.Up);
                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                        View.SetGridColor(ranges, Color.red);
                        this.ranges = new List<Grid>(ranges);
                    }
                    break;
                default:
                    {
                        // 除了直向型範兵, 其它的範兵和單體武器計算方式相同
                        var ranges = DataAlg.FindAllRange(Model.mapCtx, weaponCfg.minRange, weaponCfg.maxRange, pos);
                        View.SetGridColor(ranges.Keys, Color.red);
                        this.ranges = new List<Grid>(ranges.Keys);
                    }
                    break;
            }
            // 建立菜單
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
            // 移除菜單
            var menu = View.GetUnitMenu();
            menu.OnSelect -= OnSelect;
            menu.gameObject.SetActive(false);
            // 清除預測
            Controller.SetUTWList(null);
            // 清除射程顯示
            View.SetGridColor(null, Color.white);
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
                            Debug.LogWarning("請先點擊正確的目標");
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
                                    DataAlg.PushTask(Model.mapCtx, task, true);
                                    Holder.ChangeState(new UpdateCTState());
                                }
                                break;
                            default:
                                {
                                    var targetKey = Model.mapCtx.grid2Unit[selectedGrid.Key];
                                    var task = DataAlg.CreateAttackTask(Model.mapCtx, unit.Key, weapon, new List<string>() { targetKey });
                                    DataAlg.PushTask(Model.mapCtx, task, true);
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
            // 每點擊一次都重新計算是否依武器類型點擊到正確的目標
            isReady = false;
            Controller.SetUTWList(null);

            var gk = new Grid(gv.coord).Key;
            var g = Model.mapCtx.grids[gk];
            selectedGrid = g;

            var clickPos = gv.coord;
            var weaponCfg = ConfigWeapon.Get(Model.mapCtx.weapons[weapon].prototype);
            switch (weaponCfg.shape)
            {
                case ConfigShape.ID_center:
                    {
                        // 圓形範兵
                        // 必須在射呈範圍內
                        var isValidPos = ranges.Contains(g);
                        if (isValidPos == false)
                        {
                            Debug.LogWarning("不合法的位置");
                            return;
                        }
                        // 顯示範兵的影嚮範圍
                        var vecs = DataAlg.GetCenterVecs(weaponCfg.shapeRange);
                        var centerRange = vecs.Select(v => v + clickPos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                        View.SetGridColor(null, Color.white);
                        View.SetGridColor(this.ranges, Color.red);
                        View.SetGridColor(centerRange, Color.magenta);
                        
                        isReady = true;

                        var owner = Model.mapCtx.unit2Player[unit.Key];
                        var atkPlayer = Model.mapCtx.players[owner];
                        var utwList = Model.mapCtx.unit2Grid.Keys.Where(uk =>
                        {
                            var u = Model.mapCtx.units[uk];
                            var owner2 = Model.mapCtx.unit2Player[uk];
                            var dfdPlayer = Model.mapCtx.players[owner2];
                            if (atkPlayer.team == dfdPlayer.team)
                            {
                                return false;
                            }
                            var unitGrid = Model.mapCtx.grids[Model.mapCtx.unit2Grid[u.Key]];
                            return centerRange.Contains(unitGrid);
                        }).Select(u =>
                        {
                            UnitTargetWeapon utw;
                            utw.unit = unit.Key;
                            utw.target = u;
                            utw.weapon = weapon;
                            return utw;
                        }).ToList();
                        Controller.SetUTWList(utwList);
                    }
                    break;
                case ConfigShape.ID_forward:
                    {
                        // 直向型範兵
                        // 計算點擊位置與機體的相對方向
                        var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;
                        var dir = DataAlg.GetDirection(pos, clickPos);

                        // 顯示範兵的影嚮範圍
                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, dir);
                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                        View.SetGridColor(null, Color.white);
                        View.SetGridColor(ranges, Color.red);
                        this.ranges = new List<Grid>(ranges);

                        isReady = true;

                        var owner = Model.mapCtx.unit2Player[unit.Key];
                        var atkPlayer = Model.mapCtx.players[owner];
                        var utwList = Model.mapCtx.unit2Grid.Keys.Where(uk =>
                        {
                            var u = Model.mapCtx.units[uk];
                            var owner2 = Model.mapCtx.unit2Player[uk];
                            var dfdPlayer = Model.mapCtx.players[owner2];
                            if (atkPlayer.team == dfdPlayer.team)
                            {
                                return false;
                            }
                            var unitGrid = Model.mapCtx.grids[Model.mapCtx.unit2Grid[uk]];
                            return ranges.Contains(unitGrid);
                        }).Select(u =>
                        {
                            UnitTargetWeapon utw;
                            utw.unit = unit.Key;
                            utw.target = u;
                            utw.weapon = weapon;
                            return utw;
                        }).ToList();
                        Controller.SetUTWList(utwList);
                    }
                    break;
                default:
                    {
                        // 單體兵器
                        // 必須在射呈範圍內
                        var isValidPos = ranges.Contains(g);
                        if (isValidPos == false)
                        {
                            Debug.LogWarning("不合法的位置");
                            return;
                        }
                        // 並且要點到機體
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
                            // 顯示預測數據
                            UnitTargetWeapon utw;
                            utw.unit = unit.Key;
                            utw.target = targetKey;
                            utw.weapon = weapon;
                            var list = new List<UnitTargetWeapon>();
                            list.Add(utw);
                            Controller.SetUTWList(list);

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