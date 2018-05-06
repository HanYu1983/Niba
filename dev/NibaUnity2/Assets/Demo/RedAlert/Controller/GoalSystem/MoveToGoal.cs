using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;

namespace RedAlert
{
    public class MoveToGoal : Goal
    {
        GameObject self;
        Vector3 dest;

        public MoveToGoal(GameObject self, Vector3 dest)
        {
            this.self = self;
            this.dest = dest;
        }

        public override void Activate()
        {
            base.Activate();
            self.GetComponent<NavMeshAgent>().SetDestination(dest);
            self.GetComponent<NavMeshAgent>().isStopped = false;
        }

        public override GoalState Process()
        {
            var dist = Vector3.Distance(self.transform.localPosition, dest);
            if(dist < 3)
            {
                return GoalState.Success;
            }
            return base.Process();
        }

        public override void Terminate()
        {
            self.GetComponent<NavMeshAgent>().isStopped = true;
            base.Terminate();
        }
    }
}