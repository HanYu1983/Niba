using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using UnityEngine.AI;

namespace RedAlert
{
    public class DelayGoal : Goal, IGoalListener
    {
        GameObject self;
        float duration;
        float timer = 0;

        public DelayGoal(GameObject self, float duration)
        {
            this.self = self;
            this.duration = duration;
            this.Listener = this;
        }

        public void OnActivate(IGoal _)
        {

        }

        public void OnProcess(IGoal _)
        {
            if(timer >= duration)
            {
                timer = 0;
                State = GoalState.Success;
                return;
            }
            timer += Time.deltaTime;
        }

        public void OnMessage(IGoal _, string msg)
        {

        }

        public void OnTerminate(IGoal _)
        {
            
        }
    }
}