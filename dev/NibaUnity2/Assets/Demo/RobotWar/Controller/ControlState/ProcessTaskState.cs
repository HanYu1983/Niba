using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using GameFramework.UI.Dialogs.Components;
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
                            var unit = Model.mapCtx.units[unitKey];
                            var unitCfg = ConfigUnit.Get(unit.prototype);
                            var targets = task.values[2].Split(',');
                            var msgs = new List<string>();
                            foreach(var target in targets)
                            {
                                var targetObj = Model.mapCtx.units[target];
                                var targetCfg = ConfigUnit.Get(targetObj.prototype);
                                var atk = DataAlg.GetAttackValue(Model.mapCtx, unitKey, target, weaponKey);
                                var dfd = DataAlg.GetDeffendValue(Model.mapCtx, target);
                                var isHit = Random.Range(0, 1) < atk.GetHitRate(dfd);
                                if (isHit)
                                {
                                    var isCri = Random.Range(0, 1) < atk.GetCriticalRate(dfd);
                                    var damage = atk.Damage(dfd, isCri);
                                    targetObj.usedHp += damage;
                                    var maxHp = DataAlg.GetMaxHp(Model.mapCtx, target);
                                    var isDied = DataAlg.IsUnitDied(Model.mapCtx, target);
                                    if (isDied)
                                    {
                                        // died
                                    }
                                    var sub = string.Format("unit {0} attack {1} damage:{2} isCri:{3} died:{4}", unitCfg.name, targetCfg.name, damage, isCri, isDied);
                                    msgs.Add(sub);
                                }
                                else
                                {
                                    var sub = string.Format("unit {0} attack {1} 沒擊中", unitCfg.name, targetCfg.name);
                                    msgs.Add(sub);
                                }
                            }
                            ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, "System", string.Join("\n", msgs.ToArray()), null);
                            DataAlg.CompleteTask(Model.mapCtx, task);
                        }
                        else
                        {
                            ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, "System", reason, null);
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
                            var unitCfg = ConfigUnit.Get(unit.prototype);
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

                                        var msgs = new List<string>();
                                        foreach (var target in units)
                                        {
                                            var targetObj = Model.mapCtx.units[target];
                                            var targetCfg = ConfigUnit.Get(targetObj.prototype);

                                            var atk = DataAlg.GetAttackValue(Model.mapCtx, unitKey, target, weaponKey);
                                            var dfd = DataAlg.GetDeffendValue(Model.mapCtx, target);
                                            var isHit = Random.Range(0, 1) < atk.GetHitRate(dfd);
                                            if (isHit)
                                            {
                                                var isCri = Random.Range(0, 1) < atk.GetCriticalRate(dfd);
                                                var damage = atk.Damage(dfd, isCri);
                                                targetObj.usedHp += damage;
                                                var maxHp = DataAlg.GetMaxHp(Model.mapCtx, target);
                                                var isDied = DataAlg.IsUnitDied(Model.mapCtx, target);
                                                if (isDied)
                                                {
                                                    // died
                                                }
                                                var sub = string.Format("unit {0} attack {1} damage:{2} isCri:{3} died:{4}", unitCfg.name, targetCfg.name, damage, isCri, isDied);
                                                msgs.Add(sub);
                                            }
                                            else
                                            {
                                                var sub = string.Format("unit {0} attack {1} 沒擊中", unitCfg.name, targetCfg.name);
                                                msgs.Add(sub);
                                            }
                                        }
                                        ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, "System", string.Join("\n", msgs.ToArray()), null);
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

                                        var msgs = new List<string>();
                                        foreach (var target in units)
                                        {
                                            var targetObj = Model.mapCtx.units[target];
                                            var targetCfg = ConfigUnit.Get(targetObj.prototype);

                                            var atk = DataAlg.GetAttackValue(Model.mapCtx, unitKey, target, weaponKey);
                                            var dfd = DataAlg.GetDeffendValue(Model.mapCtx, target);
                                            var isHit = Random.Range(0, 1) < atk.GetHitRate(dfd);
                                            if (isHit)
                                            {
                                                var isCri = Random.Range(0, 1) < atk.GetCriticalRate(dfd);
                                                var damage = atk.Damage(dfd, isCri);
                                                
                                                targetObj.usedHp += damage;
                                                var maxHp = DataAlg.GetMaxHp(Model.mapCtx, target);
                                                var isDied = DataAlg.IsUnitDied(Model.mapCtx, target);
                                                if (isDied)
                                                {
                                                    // died
                                                }
                                                var sub = string.Format("unit {0} attack {1} damage:{2} isCri:{3} died:{4}", unitCfg.name, targetCfg.name, damage, isCri, isDied);
                                                msgs.Add(sub);
                                            }
                                            else
                                            {
                                                var sub = string.Format("unit {0} attack {1} 沒擊中", unitCfg.name, targetCfg.name);
                                                msgs.Add(sub);
                                            }
                                        }
                                        ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, "System", string.Join("\n", msgs.ToArray()), null);
                                    }
                                    break;
                            }
                        }
                        else
                        {
                            ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, "System", reason, null);
                        }
                        DataAlg.CompleteTask(Model.mapCtx, task);
                    }
                    break;
            }
            Holder.ChangeState(new UpdateCTState());
        }
    }
}