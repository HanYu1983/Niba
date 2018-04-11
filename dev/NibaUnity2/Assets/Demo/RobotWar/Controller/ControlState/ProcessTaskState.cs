using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    public class ProcessTaskState : DefaultControlState
    {
        Task task;
        public ProcessTaskState(Task task)
        {
            this.task = task;
        }
        public override void OnUpdate(float t)
        {
            Debug.Log("***process Task***:" + task.description);
            switch (task.description)
            {
                case Task.UnitAttack:
                    {
                        var unitKey = task.values[0];
                        var weaponKey = task.values[1];

                        var reason = "";
                        var consumWeapon = DataAlg.ConsumeWeapon(Model.mapCtx, unitKey, weaponKey, ref reason);
                        if (consumWeapon)
                        {
                            var targets = task.values[2].Split(',');
                            DataAlg.CompleteTask(Model.mapCtx, task);
                        }
                        else
                        {
                            Debug.LogWarning(reason);
                        }
                        DataAlg.CompleteTask(Model.mapCtx, task);
                    }
                    break;
                case Task.UnitRangeAttack:
                    {
                        var unitKey = task.values[0];
                        var weaponKey = task.values[1];
                        var gridKey = task.values[2];

                        var reason = "";
                        var consumWeapon = DataAlg.ConsumeWeapon(Model.mapCtx, unitKey, weaponKey, ref reason);
                        if (consumWeapon)
                        {
                            var unit = Model.mapCtx.units[unitKey];
                            var owner = Model.mapCtx.unit2Player[unitKey];
                            var atkPlayer = Model.mapCtx.players[owner];
                            var clickPos = Model.mapCtx.grids[gridKey].pos;
                            var weaponObj = Model.mapCtx.weapons[weaponKey];
                            var weaponCfg = ConfigWeapon.Get(weaponObj.prototype);
                            switch (weaponCfg.shape)
                            {
                                case ConfigShape.ID_center:
                                    {
                                        var vecs = DataAlg.GetCenterVecs(weaponCfg.shapeRange);
                                        var centerRange = vecs.Select(v => v + clickPos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();
                                        var units = Model.mapCtx.unit2Grid.Keys.Where(uk =>
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
                                        });
                                    }
                                    break;
                                case ConfigShape.ID_forward:
                                    {
                                        var pos = Model.mapCtx.grids[Model.mapCtx.unit2Grid[unit.Key]].pos;
                                        var dir = DataAlg.GetDirection(pos, clickPos);

                                        var vecs = DataAlg.GetForward(weaponCfg.minRange, weaponCfg.maxRange, weaponCfg.shapeRange, dir);
                                        var ranges = vecs.Select(v => v + pos).Select(v => new Grid(v).Key).Where(k => Model.mapCtx.grids.ContainsKey(k)).Select(k => Model.mapCtx.grids[k]).ToList();

                                        var units = Model.mapCtx.unit2Grid.Keys.Where(uk =>
                                        {
                                            var u = Model.mapCtx.units[uk];
                                            var owner2 = Model.mapCtx.unit2Player[unitKey];
                                            var dfdPlayer = Model.mapCtx.players[owner2];
                                            if (atkPlayer.team == dfdPlayer.team)
                                            {
                                                return false;
                                            }
                                            var unitGrid = Model.mapCtx.grids[Model.mapCtx.unit2Grid[u.Key]];
                                            return ranges.Contains(unitGrid);
                                        });
                                    }
                                    break;
                            }
                        }
                        else
                        {
                            Debug.LogWarning(reason);
                        }
                        DataAlg.CompleteTask(Model.mapCtx, task);
                    }
                    break;
            }
            Holder.ChangeState(new UpdateCTState());
        }
    }
}