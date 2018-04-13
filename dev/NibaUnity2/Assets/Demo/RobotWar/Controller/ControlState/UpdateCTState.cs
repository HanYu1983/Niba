using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    public class UpdateCTState : DefaultControlState
    {
        public override void OnUpdate(float t)
        {
            if(Holder.Player != 0)
            {
                Holder.ChangeState(new WaitState());
                return;
            }

            var task = DataAlg.GetTopTask(Model.mapCtx);
            if (task != null)
            {
                Holder.ChangeState(new ProcessTaskState(task));
                return;
            }

            // 取得可行動單位
            var topCTUnit = DataAlg.GetTopCTUnit(Model.mapCtx);
            if (topCTUnit == null)
            {
                DataAlg.StepCT(Model.mapCtx);
            }
            else
            {
                // 判斷可行動單位是玩家還是AI
                var owner = Model.mapCtx.unit2Player[topCTUnit.Key];
                var playerObj = Model.mapCtx.players[owner];
                if (playerObj.isAI == false)
                {
                    Holder.ServerNotifySelectUnitAction(playerObj.Key, topCTUnit.Key);
                }
                else
                {
                    Holder.ChangeState(new AIState(topCTUnit));
                }
            }
        }
    }
}