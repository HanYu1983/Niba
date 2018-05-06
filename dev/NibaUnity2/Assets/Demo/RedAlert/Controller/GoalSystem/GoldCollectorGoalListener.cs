using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class GoldCollectorGoalListener : MonoBehaviour, IInjectClientModel, IGoalListener
    {
        public GameObject self;
        public float idleDuration;

        float timer;
        
        public RedAlertModel ClientModel { set; get; }

        public void OnActivate(IGoal goal)
        {
            Injector.Inject(this);

            goal.AddGoal(new CollectGoldGoal(self));
            goal.AddGoal(new MoveToGoal(self, self.transform.localPosition + Vector3.forward * 10));
        }

        public void OnProcess(IGoal _)
        {
            var goal = _ as CompositeGoal;

            if(goal.State == GoalState.Success)
            {
                goal.State = GoalState.Running;

                if (goal.LastProcessGoal is CollectGoldGoal)
                {
                    goal.LastProcessGoal.Terminate();
                    goal.AddGoal(goal.LastProcessGoal);
                    return;
                }

                timer += Time.deltaTime;
                if (timer > idleDuration)
                {
                    timer = 0;
                    goal.AddGoal(new CollectGoldGoal(self));
                }
            }
        }

        public void OnMessage(IGoal goal, string msg)
        {

        }

        public void OnTerminate(IGoal goal)
        {

        }

    }
}