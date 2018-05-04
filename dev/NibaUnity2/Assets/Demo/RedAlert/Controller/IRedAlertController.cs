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
    }

    public interface IRedAlertController
    {
        void ChangeState(IRedAlertControllerState state);
        RedAlertModel Model { get; }
        RedAlertView View { get; }
        int Player { get; }

        void ClientBuilding(int player, int host, string prototype);
        void ClientCancelBuilding(int player, string progressKey);
        void ClientCreateEntity(int player, int host, string prototype, Vector3 pos);
    }

    public class DefaultRedAlertControllerState : MonoBehaviour, IRedAlertControllerState
    {
        public IRedAlertController Holder { get; set; }
        public virtual void OnEnter()
        {

        }
        public virtual void OnExit()
        {

        }
    }
}