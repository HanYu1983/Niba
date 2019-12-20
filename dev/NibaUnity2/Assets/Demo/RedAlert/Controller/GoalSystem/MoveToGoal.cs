using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;

namespace RedAlert
{
    public class MoveToGoal : Goal, IGoalListener
    {
        GameObject self;
        Vector3 dest;

        public MoveToGoal(GameObject self, Vector3 dest)
        {
            this.self = self;
            this.dest = dest;
            this.Listener = this;
        }

        public void OnActivate(IGoal _)
        {
            self.GetComponent<NavMeshAgent>().SetDestination(dest);
            self.GetComponent<NavMeshAgent>().isStopped = false;
        }

        public void OnProcess(IGoal _)
        {
            var dist = Vector3.Distance(self.transform.localPosition, dest);
            if(dist < 20)
            {
                State = GoalState.Success;
                return;
            }
            State = GoalState.Running;
        }

        public void OnMessage(IGoal _, string msg)
        {

        }

        public void OnTerminate(IGoal _)
        {
            self.GetComponent<NavMeshAgent>().isStopped = true;
        }
    }
}