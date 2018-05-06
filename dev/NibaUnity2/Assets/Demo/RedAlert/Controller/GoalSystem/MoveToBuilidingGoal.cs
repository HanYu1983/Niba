using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class MoveToBuildingGoal : CompositeGoal, IInjectClientModel, IGoalListener
    {
        GameObject self;
        int player;
        string prototype;
        Entity currentTargetEntity;

        public RedAlertModel ClientModel { set; get; }

        public MoveToBuildingGoal(GameObject self, int player, string prototype)
        {
            this.self = self;
            this.player = player;
            this.prototype = prototype;
            this.Listener = this;
        }

        public string BuildingPrototype { get { return prototype; } }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            var r = DataAlg.GetClosestEntity(ClientModel.ctx, player, prototype, self.transform.localPosition).FirstOrDefault();
            if(r == null)
            {
                State = GoalState.Fail;
                return;
            }
            currentTargetEntity = r;
            AddGoal(new MoveToGoal(self, r.position));
        }

        public void OnProcess(IGoal _)
        {
            // 如果消失了
            var isExist = ClientModel.ctx.entities.ContainsKey(currentTargetEntity.Key);
            if(isExist == false)
            {
                ClearAllGoals();
                // 中止目標, 重找一個最近的
                Terminate();
            }
        }

        public void OnMessage(IGoal _, string msg)
        {

        }

        public void OnTerminate(IGoal _)
        {

        }
    }
}