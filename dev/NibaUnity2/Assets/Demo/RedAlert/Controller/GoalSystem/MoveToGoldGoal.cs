using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class MoveToGoldGoal : CompositeGoal, IInjectClientModel
    {
        GameObject self;
        bool giveUp;
        Resource currentTarget;

        public RedAlertModel ClientModel { set; get; }

        public MoveToGoldGoal(GameObject self)
        {
            this.self = self;
        }

        public override void Activate()
        {
            base.Activate();
            Injector.Inject(this);
            
            var r = DataAlg.GetClosestResource(ClientModel.ctx, self.transform.localPosition).FirstOrDefault();
            if(r == null)
            {
                giveUp = true;
                return;
            }
            currentTarget = r;
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
                // 如果建物消失了
                var isExist = ClientModel.ctx.resources.ContainsKey(currentTarget.Key);
                if (isExist == false)
                {
                    ClearAllGoals();
                    // 中止目標, 重找一個最近的建物
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