using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class MoveToBuildingGoal : CompositeGoal, IInjectClientModel
    {
        GameObject self;
        int player;
        string prototype;
        bool giveUp;
        Entity currentTargetEntity;

        public RedAlertModel ClientModel { set; get; }

        public MoveToBuildingGoal(GameObject self, int player, string prototype)
        {
            this.self = self;
            this.player = player;
            this.prototype = prototype;
        }

        public override void Activate()
        {
            base.Activate();
            Injector.Inject(this);

            var r = DataAlg.GetClosestEntity(ClientModel.ctx, player, prototype, self.transform.localPosition).FirstOrDefault();
            if(r == null)
            {
                giveUp = true;
                return;
            }
            currentTargetEntity = r;
            AddGoal(new MoveToGoal(self, r.position));
        }

        public override GoalState Process()
        {
            if (giveUp)
            {
                return GoalState.Fail;
            }
            else
            {
                // 如果消失了
                var isExist = ClientModel.ctx.entities.ContainsKey(currentTargetEntity.Key);
                if(isExist == false)
                {
                    ClearAllGoals();
                    // 中止目標, 重找一個最近的
                    Terminate();
                    return GoalState.Running;
                }
                return base.Process();
            }
        }

        public override void Terminate()
        {
            giveUp = false;
            base.Terminate();
        }
    }
}