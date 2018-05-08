using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public class OnDirectMoveTo : MonoBehaviour
    {
        public GameObject self;
        public GoalHolder goalHolder;

        private void Awake()
        {
            if (self == null)
            {
                self = gameObject;
            }
            if (goalHolder == null)
            {
                goalHolder = GetComponent<GoalHolder>();
            }
        }

        void Start()
        {
            Injector.OnDirectMoveTo += OnDirectMoveToFn;
        }

        public void OnDirectMoveToFn(List<GameObject> units, Vector3 pos)
        {
            if (units.Contains(self) == false)
            {
                return;
            }
            if(goalHolder.Goal.LastProcessGoal is MoveToGoal)
            {
                goalHolder.Goal.ClearAllGoals();
            }
            Debug.Log("MoveTo");
            goalHolder.Goal.AddGoal(new MoveToGoal(self, pos));
        }

        private void OnDestroy()
        {
            Injector.OnDirectMoveTo -= OnDirectMoveToFn;
        }
    }
}