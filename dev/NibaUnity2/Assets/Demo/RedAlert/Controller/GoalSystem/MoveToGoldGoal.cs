using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class MoveToGoldGoal : CompositeGoal, IInjectClientModel, IGoalListener
    {
        GameObject self;
        Resource currentTarget;

        public RedAlertModel ClientModel { set; get; }

        public MoveToGoldGoal(GameObject self)
        {
            this.self = self;
            Listener = this;
        }

        public void OnActivate(IGoal goal)
        {
            Injector.Inject(this);
            
            var r = DataAlg.GetClosestResource(ClientModel.ctx, self.transform.localPosition).FirstOrDefault();
            if(r == null)
            {
                State = GoalState.Fail;
                return;
            }
            currentTarget = r;
            AddGoal(new MoveToGoal(self, r.position));
        }

        public void OnProcess(IGoal goal)
        {
            // 如果建物消失了
            var isExist = ClientModel.ctx.resources.ContainsKey(currentTarget.Key);
            if (isExist == false)
            {
                ClearAllGoals();
                // 中止目標, 重找一個最近的建物
                Terminate();
            }
        }

        public void OnTerminate(IGoal goal)
        {

        }

        public void OnMessage(IGoal goal, string msg)
        {

        }
    }
}