using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.AI;
using HanUtil;

namespace RedAlert
{
    public class GoalHolder : MonoBehaviour, IInjectClientModel
    {
        CompositeGoal goal = new CompositeGoal();

        void Awake()
        {
            var listener = GetComponent<IGoalListener>();
            goal.Listener = listener;
        }

        void Update()
        {
            goal.Process();
        }

        public RedAlertModel ClientModel { set; get; }
    }
}