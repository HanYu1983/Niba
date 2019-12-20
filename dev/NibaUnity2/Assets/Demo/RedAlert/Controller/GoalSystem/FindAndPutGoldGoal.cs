using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class FindAndPutGoldGoal : CompositeGoal, IInjectServerModel, IGoalListener
    {
        GameObject self;
        int buildingKey;

        public FindAndPutGoldGoal(GameObject self, int buildingKey)
        {
            this.self = self;
            this.buildingKey = buildingKey;
            Listener = this;
        }

        public RedAlertModel ServerModel { set; get; }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            var model = ServerModel;
            var isTargetExist = model.ctx.entities.ContainsKey(buildingKey);
            if (isTargetExist == false)
            {
                var viewEntity = self.GetComponent<RedAlertEntity>();
                var player = model.ctx.entities[viewEntity.key].player;
                var r = DataAlg.GetClosestEntity(model.ctx, player, ConfigEntity.ID_gdiGoldFactory, null, self.transform.localPosition).FirstOrDefault();
                if (r == null)
                {
                    State = GoalState.Fail;
                    return;
                }
                buildingKey = r.Key;
            }

            var building = ServerModel.ctx.entities[buildingKey];
            AddGoal(new PutGoldGoal(self, building.Key));
            AddGoal(new MoveToGoal(self, building.position));
        }

        public void OnProcess(IGoal _)
        {
            var model = ServerModel;
            var isTargetExist = model.ctx.entities.ContainsKey(buildingKey);
            if (isTargetExist == false)
            {
                Terminate();
                return;
            }
            if (State == GoalState.Fail)
            {
                if(LastProcessGoal is PutGoldGoal)
                {
                    Terminate();
                    return;
                }
                if(LastProcessGoal is MoveToGoal)
                {
                    ClearAllGoals();
                    AddGoal(new MoveToBuildingGoal(self, ConfigEntity.ID_gdiHome));
                    State = GoalState.Running;
                }
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