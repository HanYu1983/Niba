using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RobotWar
{
    public class AIState : DefaultControlState
    {
        Unit unit;
        public AIState(Unit unit)
        {
            this.unit = unit;
        }
        public override void OnUpdate(float t)
        {
            DataAlg.PassUnit(Model.mapCtx, unit.Key);
            Holder.ChangeState(new SystemState());
        }
    }
}