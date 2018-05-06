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
        IGoalListener Listener { get; set; }
        void AddGoal(IGoal goal);
        void Activate();
        void Terminate();
        void Process();
        GoalState State { get; }
        void Message(string msg);
    }

    public interface IGoalListener
    {
        void OnActivate(IGoal goal);
        void OnTerminate(IGoal goal);
        void OnProcess(IGoal goal);
        void OnMessage(IGoal goal, string msg);
    }

    public class Goal : IGoal
    {
        bool notifyActivate = true;

        public GoalState State { get; set; }
        public IGoalListener Listener { get; set; }

        public void Activate()
        {
            if (notifyActivate)
            {
                notifyActivate = false;
                State = GoalState.Running;
                if (Listener != null)
                {
                    Listener.OnActivate(this);
                }
            }
        }
        public virtual void Terminate()
        {
            notifyActivate = true;
            if (Listener != null)
            {
                Listener.OnTerminate(this);
            }
        }
        public virtual void Process()
        {
            Activate();
            if (Listener != null)
            {
                Listener.OnProcess(this);
            }
        }

        public virtual void AddGoal(IGoal goal)
        {
            throw new InvalidOperationException("");
        }
        public virtual void Message(string msg)
        {
            if (Listener != null)
            {
                Listener.OnMessage(this, msg);
            }
        }
    }

    public class CompositeGoal : Goal
    {
        public override void Process()
        {
            Activate();
            if(State == GoalState.Success || State == GoalState.Fail)
            {
                return;
            }
            if(goals.Count == 0)
            {
                State = GoalState.Success;
                return;
            }
            var first = goals[0];
            first.Process();
            LastProcessGoal = first;
            if (first.State == GoalState.Fail)
            {
                State = GoalState.Fail;
            }
            if(first.State == GoalState.Success)
            {
                goals.Remove(first);
                if (goals.Count == 0)
                {
                    State = GoalState.Success;
                }
            }
            if (Listener != null)
            {
                Listener.OnProcess(this);
            }
        }

        public override void Terminate()
        {
            if (goals.Count != 0)
            {
                goals[0].Terminate();
            }
            else
            {
                base.Terminate();
            }
        }

        public IGoal LastProcessGoal {
            get; set;
        }

        public void ClearAllGoals()
        {
            foreach(var g in goals)
            {
                g.Terminate();
            }
            goals.Clear();
        }

        List<IGoal> goals = new List<IGoal>();
        public override void AddGoal(IGoal goal)
        {
            if(goals.Count > 0)
            {
                var first = goals[0];
                first.Terminate();
            }
            goals.Insert(0, goal);
        }
    }
}