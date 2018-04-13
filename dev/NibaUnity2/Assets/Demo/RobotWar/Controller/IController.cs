using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using GameFramework.GameStructure;
using HanUtil;

namespace RobotWar
{
    public interface IController
    {
        void ChangeState(IControlState state);
        Model Model { get; }
        View View { get; }
        int Player { get; }

        void ServerAlart(string title, string msg);
        void ServerNotifySelectUnitAction(int playerId, string unit);
        void ClientMoveUnit(int playerId, string unit, Vector2Int pos);
        void ClientCancelMoveUnit(int playerId, string unit);
        void ClientPushTask(int playerId, Task task, bool isAttack);
        void ClientSetUnitDirection(int playerId, string unit, Direction dir);
        void ClientPassUnit(int playerId, string unit);
        void ClientNotifyServerState(string state);
    }

    public abstract class DefaultController : MonoBehaviour, IController
    {
        public abstract Model Model { get; }
        public abstract View View { get; }
        public abstract int Player { get; }
        public virtual void ServerAlart(string title, string msg) { }
        public virtual void ServerNotifySelectUnitAction(int playerId, string unit) { }
        public virtual void ClientMoveUnit(int playerId, string unit, Vector2Int pos) { }
        public virtual void ClientCancelMoveUnit(int playerId, string unit) { }
        public virtual void ClientPushTask(int playerId, Task task, bool isAttack) { }
        public virtual void ClientSetUnitDirection(int playerId, string unit, Direction dir) { }
        public virtual void ClientPassUnit(int playerId, string unit) { }
        public virtual void ClientNotifyServerState(string state) { }
        IControlState controlState;
        public void ChangeState(IControlState next)
        {
            Debug.Log("ChangeState:" + next);
            if (controlState != null)
            {
                controlState.OnExitState();
            }
            next.Holder = this;
            next.OnEnterState();
            controlState = next;
        }
        public void Step(float t)
        {
            if (controlState == null)
            {
                return;
            }
            controlState.OnUpdate(t);
        }
    }

    public interface IControlState
    {
        IController Holder { set; }
        void OnEnterState();
        void OnExitState();
        void OnUpdate(float t);
    }

    public abstract class DefaultControlState : IControlState
    {
        public IController Holder { set; get; }
        public Model Model { get { return Holder.Model; } }
        public View View { get { return Holder.View;  } }
        public virtual void OnEnterState() { }
        public virtual void OnExitState() { }
        public virtual void OnUpdate(float t) { }
    }
}