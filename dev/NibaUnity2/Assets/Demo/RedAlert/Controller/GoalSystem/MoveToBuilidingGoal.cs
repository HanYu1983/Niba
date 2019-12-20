using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class MoveToBuildingGoal : CompositeGoal, IInjectServerModel, IGoalListener
    {
        GameObject self;
        string prototype;
        Entity currentTargetEntity;

        public RedAlertModel ServerModel { set; get; }

        public MoveToBuildingGoal(GameObject self, string prototype)
        {
            this.self = self;
            this.prototype = prototype;
            this.Listener = this;
        }

        public string BuildingPrototype { get { return prototype; } }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            var viewEntity = self.GetComponent<RedAlertEntity>();
            var player = ServerModel.ctx.entities[viewEntity.key].player;
            var r = DataAlg.GetClosestEntity(ServerModel.ctx, player, prototype, null, self.transform.localPosition).FirstOrDefault();
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
            var isExist = ServerModel.ctx.entities.ContainsKey(currentTargetEntity.Key);
            if(isExist == false)
            {
                ClearAllGoals();
                // 中止目標, 重找一個最近的
                Terminate();
                return;
            }
            if (Goals.Count == 0)
            {
                State = GoalState.Success;
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