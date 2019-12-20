using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IRedAlertControllerState
    {
        IRedAlertController Holder { get; set; }
        void OnEnter();
        void OnExit();
        void OnUpdate(float dt);
    }

    public interface IRedAlertController
    {
        void ChangeState(IRedAlertControllerState state);
        RedAlertModel Model { get; }
        RedAlertView View { get; }
        int Player { get; set; }
        IClient Client { get; set; }
    }

    public class DefaultRedAlertControllerState : IRedAlertControllerState
    {
        public IRedAlertController Holder { get; set; }
        public virtual void OnEnter()
        {

        }
        public virtual void OnExit()
        {

        }
        public virtual void OnUpdate(float dt)
        {

        }
    }
}