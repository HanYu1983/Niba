using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;
using System.Linq;

namespace RedAlert
{
    public class GoldCollectorGoalListener : MonoBehaviour, IInjectServerModel, IGoalListener
    {
        public GameObject self;
        public float idleDuration;

        float timer;
        IGoal goal;
        public RedAlertModel ServerModel { set; get; }

        void Awake()
        {
            if(self == null)
            {
                self = gameObject;
            }
        }

        public void OnActivate(IGoal _)
        {
            Injector.Inject(this);
            //Injector.OnDirectMoveTo += OnDirectMoveTo;

            var goal = _ as CompositeGoal;
            goal.AddGoal(new FindAndPutGoldGoal(self, -1));
            goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
            goal.AddGoal(new MoveToGoal(self, self.transform.localPosition + Vector3.forward * 10));

            this.goal = goal;
        }

        /*public void OnDirectMoveTo(List<GameObject> units, Vector3 pos)
        {
            if (units.Contains(self) == false)
            {
                return;
            }
            goal.AddGoal(new DelayGoal(self, 5));
            goal.AddGoal(new MoveToGoal(self, pos));
        }*/

        public void OnProcess(IGoal _)
        {
            var goal = _ as CompositeGoal;
            /*
            if(goal.State == GoalState.Success)
            {
                if (goal.LastProcessGoal is FindAndPutGoldGoal)
                {
                    goal.State = GoalState.Running;
                    goal.AddGoal(new FindAndPutGoldGoal(self, -1));
                    goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
                    return;
                }
            }

            if(goal.State == GoalState.Success || goal.State == GoalState.Fail)
            {
                goal.State = GoalState.Running;

                timer += Time.deltaTime;
                if (timer > idleDuration)
                {
                    timer = 0;
                    goal.AddGoal(new FindAndPutGoldGoal(self, -1));
                    goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
                }
            }*/

            if (goal.Goals.Count == 0)
            {
                if (goal.LastProcessGoal is FindAndPutGoldGoal)
                {
                    goal.AddGoal(new FindAndPutGoldGoal(self, -1));
                    goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
                    return;
                }
            }

            if (goal.Goals.Count == 0 || goal.State == GoalState.Fail)
            {
                goal.State = GoalState.Running;

                timer += Time.deltaTime;
                if (timer > idleDuration)
                {
                    timer = 0;
                    goal.AddGoal(new FindAndPutGoldGoal(self, -1));
                    goal.AddGoal(new FindAndCollectGoldGoal(self, -1));
                }
            }
        }

        public void OnMessage(IGoal goal, string msg)
        {

        }

        public void OnTerminate(IGoal goal)
        {
            //Injector.OnDirectMoveTo -= OnDirectMoveTo;
        }

    }
}