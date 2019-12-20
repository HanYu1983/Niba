using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.AI;
using HanUtil;

namespace RedAlert
{
    public class GoalHolder : MonoBehaviour, IInjectRedAlertController
    {
        CompositeGoal goal = new CompositeGoal();
        public CompositeGoal Goal { get { return goal;  } }

        void Awake()
        {
            var listener = GetComponent<IGoalListener>();
            goal.Listener = listener;
        }

        void Start()
        {
            Injector.Inject(this);
        }

        void Update()
        {
            if (RedAlertController.Player == 0)
            {
                goal.Process();
            }
        }

        public IRedAlertController RedAlertController { set; get; }
    }
}