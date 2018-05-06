using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;

namespace RedAlert
{
    public class CollectGoldGoal : Goal, IGoalListener, IInjectClientModel
    {
        GameObject self;
        int goldKey;
        float timer;
        FindAndCollectGoldGoal dynamicGold;

        public CollectGoldGoal(GameObject self, int goldKey, FindAndCollectGoldGoal dynamicGold)
        {
            this.self = self;
            this.goldKey = goldKey;
            this.dynamicGold = dynamicGold;
            this.Listener = this;
        }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            var isGoldExist = ClientModel.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
                if (dynamicGold != null)
                {
                    goldKey = dynamicGold.CurrentGold;
                }

                isGoldExist = ClientModel.ctx.resources.ContainsKey(goldKey);
                if (isGoldExist == false)
                {
                    State = GoalState.Fail;
                }
            }
            timer = 0;
        }

        public void OnProcess(IGoal _)
        {
            var isGoldExist = ClientModel.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
                State = GoalState.Fail;
                return;
            }
            var dist = Vector3.Distance(ClientModel.ctx.resources[goldKey].position, self.transform.localPosition);
            if(dist > 3)
            {
                State = GoalState.Fail;
                return;
            }
            if(timer > 5)
            {
                timer = 0;
                State = GoalState.Success;
                var entity = self.GetComponent<RedAlertEntity>();
                DataAlg.CollectResource(ClientModel.ctx, entity.key, goldKey, 5);
                return;
            }
            timer += Time.deltaTime;
        }

        public void OnMessage(IGoal _, string msg)
        {

        }

        public void OnTerminate(IGoal _)
        {
            
        }

        public RedAlertModel ClientModel { set; get; }
    }
}