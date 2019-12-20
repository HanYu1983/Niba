using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class FindAndCollectGoldGoal : CompositeGoal, IInjectServerModel, IGoalListener
    {
        GameObject self;
        int goldKey;

        public FindAndCollectGoldGoal(GameObject self, int goldKey)
        {
            this.self = self;
            this.goldKey = goldKey;
            Listener = this;
        }

        public int CurrentGold { get { return goldKey;  } }

        public RedAlertModel ServerModel { set; get; }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);
            
            var isGoldExist = ServerModel.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
                var findGold = DataAlg.GetClosestResource(ServerModel.ctx, self.transform.localPosition).FirstOrDefault();
                if (findGold == null)
                {
                    State = GoalState.Fail;
                    return;
                }
                goldKey = findGold.Key;
            }

            var viewEntity = self.GetComponent<RedAlertEntity>();
            var entity = ServerModel.ctx.entities[viewEntity.key];
            var isFull = entity.goldAmount >= 10;
            if (isFull)
            {
                State = GoalState.Success;
                return;
            }

            var gold = ServerModel.ctx.resources[goldKey];
            AddGoal(new CollectGoldGoal(self, gold.Key, null));
            AddGoal(new MoveToGoal(self, gold.position));
        }

        public void OnProcess(IGoal _)
        {
            var isGoldExist = ServerModel.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
                Terminate();
                return;
            }
            if(State == GoalState.Fail)
            {
                if(LastProcessGoal is CollectGoldGoal)
                {
                    Terminate();
                    return;
                }
            }
            if(Goals.Count == 0)
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