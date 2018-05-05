using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace HanUtil
{
    public enum GoalState
    {
        Running, Success, Fail
    }

    public interface IGoal
    {
        void AddGoal(IGoal goal);
        void Activate();
        void Terminate();
        GoalState Process();
        void Message(string msg);
    }

    public class Goal : IGoal
    {
        bool notifyActivate;

        public virtual void Activate()
        {
            notifyActivate = false;
        }
        public virtual void Terminate()
        {
            notifyActivate = true;
        }
        public virtual GoalState Process()
        {
            if(notifyActivate)
            {
                Activate();
            }
            return GoalState.Fail;
        }
        public virtual void AddGoal(IGoal goal)
        {
            throw new InvalidOperationException("");
        }
        public virtual void Message(string msg)
        {

        }
    }

    public class CompositeGoal : Goal
    {
        public override GoalState Process()
        {
            base.Process();
            if (goals.Count == 0)
            {
                return GoalState.Success;
            }
            var first = goals[0];
            var result = first.Process();
            if(result == GoalState.Fail)
            {
                return result;
            }
            if(result == GoalState.Success)
            {
                goals.Remove(first);
            }
            return GoalState.Running;
        }

        public override void Terminate()
        {
            if (goals.Count == 0)
            {
                return;
            }
            goals[0].Terminate();
            base.Terminate();
        }

        List<IGoal> goals = new List<IGoal>();
        public override void AddGoal(IGoal goal)
        {
            if(goals.Count > 0)
            {
                var first = goals[0];
                if(first is CompositeGoal)
                {
                    (first as CompositeGoal).AddGoal(goal);
                    return;
                }
            }
            goals.Insert(0, goal);
        }
    }
}