using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;

namespace RedAlert
{
    public class CollectGoldGoal : Goal, IGoalListener, IInjectRedAlertController, IInjectServerModel
    {
        GameObject self;
        int goldKey;
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

            var model = ServerModel;
            var isGoldExist = model.ctx.resources.ContainsKey(goldKey);
            if (isGoldExist == false)
            {
                if (dynamicGold != null)
                {
                    goldKey = dynamicGold.CurrentGold;
                }

                isGoldExist = model.ctx.resources.ContainsKey(goldKey);
                if (isGoldExist == false)
                {
                    State = GoalState.Fail;
                    return;
                }
            }
            if(collectingTask != null)
            {
                RedAlertController.View.StopCoroutine(collectingTask);
                collectingTask = null;
            }
            RedAlertController.View.StartCoroutine(Collecting());
        }

        public void OnProcess(IGoal _)
        {

        }

        Coroutine collectingTask;

        IEnumerator Collecting()
        {
            while (true)
            {
                var model = ServerModel;
                var isGoldExist = model.ctx.resources.ContainsKey(goldKey);
                if (isGoldExist == false)
                {
                    State = GoalState.Fail;
                    yield break;
                }
                var dist = Vector3.Distance(model.ctx.resources[goldKey].position, self.transform.localPosition);
                if (dist > 20)
                {
                    State = GoalState.Fail;
                    yield break;
                }
                
                var viewEntity = self.GetComponent<RedAlertEntity>();
                var isEntityExist = model.ctx.entities.ContainsKey(viewEntity.key);
                if(isEntityExist == false)
                {
                    State = GoalState.Fail;
                    yield break;
                }
                var entity = model.ctx.entities[viewEntity.key];

                var isFull = entity.goldAmount >= 20;
                if (isFull)
                {
                    State = GoalState.Success;
                    yield break;
                }
                if (DataAlg.CollectResource(model.ctx, entity.Key, goldKey, 1) == 0)
                {
                    Terminate();
                    yield break;
                }
                yield return new WaitForSeconds(0.2f);
            }
        }

        public void OnMessage(IGoal _, string msg)
        {

        }

        public void OnTerminate(IGoal _)
        {
            if (collectingTask != null)
            {
                RedAlertController.View.StopCoroutine(collectingTask);
                collectingTask = null;
            }
        }

        public IRedAlertController RedAlertController { set; get; }
        public RedAlertModel ServerModel { set; get; }
    }
}