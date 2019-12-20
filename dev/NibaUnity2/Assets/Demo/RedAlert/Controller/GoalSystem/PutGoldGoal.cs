using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class PutGoldGoal : Goal, IGoalListener, IInjectRedAlertController, IInjectServerModel
    {
        GameObject self;
        int buildingKey;

        public PutGoldGoal(GameObject self, int buildingKey)
        {
            this.self = self;
            this.buildingKey = buildingKey;
            this.Listener = this;
        }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            var model = ServerModel;
            var isTargetExist = model.ctx.entities.ContainsKey(buildingKey);
            if (isTargetExist == false)
            {
                State = GoalState.Fail;
                return;
            }
            
            if (puttingTask != null)
            {
                RedAlertController.View.StopCoroutine(puttingTask);
                puttingTask = null;
            }
            RedAlertController.View.StartCoroutine(Collecting());
        }

        public void OnProcess(IGoal _)
        {

        }

        Coroutine puttingTask;

        IEnumerator Collecting()
        {
            while (true)
            {
                var model = ServerModel;
                var isTargetExist = model.ctx.entities.ContainsKey(buildingKey);
                if (isTargetExist == false)
                {
                    State = GoalState.Fail;
                    yield break;
                }
                var dist = Vector3.Distance(model.ctx.entities[buildingKey].position, self.transform.localPosition);
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

                var isPutAll = entity.goldAmount == 0;
                if (isPutAll)
                {
                    State = GoalState.Success;
                    yield break;
                }
                var consumeAmount = DataAlg.ConsumeResource(model.ctx, buildingKey, entity.Key, 1);
                if (consumeAmount == 0)
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
            if (puttingTask != null)
            {
                RedAlertController.View.StopCoroutine(puttingTask);
                puttingTask = null;
            }
        }

        public IRedAlertController RedAlertController { set; get; }
        public RedAlertModel ServerModel { set; get; }
    }
}