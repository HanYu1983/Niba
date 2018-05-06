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

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);

            var goal = _ as CompositeGoal;
            goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
            goal.AddGoal(new MoveToGoal(self, self.transform.localPosition + Vector3.forward * 10));
        }

        public void OnProcess(IGoal _)
        {
            var goal = _ as CompositeGoal;

            if(goal.State == GoalState.Success)
            {
                goal.State = GoalState.Running;

                if (goal.LastProcessGoal is FindAndCollectGoldGoal)
                {
                    goal.LastProcessGoal.Terminate();
                    goal.AddGoal(goal.LastProcessGoal);
                    return;
                }

                timer += Time.deltaTime;
                if (timer > idleDuration)
                {
                    timer = 0;
                    goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
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