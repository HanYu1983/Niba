using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class FindAndCollectGoldGoal : CompositeGoal, IInjectClientModel, IGoalListener
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

        public RedAlertModel ClientModel { set; get; }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);
            
            var isGoldExist = ClientModel.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
                var findGold = DataAlg.GetClosestResource(ClientModel.ctx, self.transform.localPosition).FirstOrDefault();
                if (findGold == null)
                {
                    State = GoalState.Fail;
                    return;
                }
                goldKey = findGold.Key;
            }

            var gold = ClientModel.ctx.resources[goldKey];
            //AddGoal(new PutGoldGoal());
            AddGoal(new MoveToBuildingGoal(self, 0, ConfigEntity.ID_gdiGoldFactory));
            AddGoal(new CollectGoldGoal(self, gold.Key, null));
            AddGoal(new MoveToGoal(self, gold.position));
        }

        public void OnProcess(IGoal _)
        {
            var isGoldExist = ClientModel.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
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