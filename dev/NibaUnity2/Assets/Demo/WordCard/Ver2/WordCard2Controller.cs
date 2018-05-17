using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
    public interface IWordCard2ControllerState
    {
        IWordCard2Controller Holder { get; set; }
        void OnEnter();
        void OnExit();
    }

    public class DefaultWordCard2ControllerState : IWordCard2ControllerState
    {
        public IWordCard2Controller Holder { get; set; }
        public virtual void OnEnter() { }
        public virtual void OnExit() { }
    }

    public interface IWordCard2Client
    {
        int Player { get; }
        void ServerStartGame();
        void ServerSyncModel();
        void ServerNotifyAction();
        void ServerPushMission(CardCore.Mission mis);
        void ServerPlayerChange();
        void ClientPushMission(CardCore.Mission mis);
        void ClientSendWord(string word, int cardKey, CardCore.Mission mis);
    }

    public interface IWordCard2Controller
    {
        IWordCard2Client Client { get; set; }
        IWordCard2ControllerState State { get; set; }
    }

    public class WordCard2Controller : MonoBehaviour, IWordCard2Controller, IInjectWordCard2ClientModel, IInjectWordCard2ServerModel, IInjectWordCard2View
    {
        void Start()
        {
            WordCard2Injector.Inject(this);
            ServerModel.ctx.OnPlayerChange += OnPlayerChange;
            ServerModel.ctx.table.OnAddCard += OnAddCard;
            ServerModel.ctx.table.OnCardMove += OnCardMove;
        }

        public static string GetWord(string prototype, string package = null)
        {
            var p = ConfigPackage.Get(prototype);
            var w = p.pack1;
            return w;
        }

        public void OnPlayerChange(int oldPlayer, int currPlayer)
        {   
            Client.ServerPlayerChange();
        }

        public void OnAddCard(int s, int c)
        {

        }

        public void OnCardMove(int s, int s2, int c)
        {

        }

        [ContextMenu("StartGame")]
        public void StartGame()
        {
            Client.ServerStartGame();
            OnPlayerChange(0, 0);
        }
        
        public IWordCard2Client Client { get; set; }
        IWordCard2ControllerState state;
        public IWordCard2ControllerState State {
            get
            {
                return state;
            }
            set
            {
                if(state != null)
                {
                    state.OnExit();
                }
                state = value;
                Debug.Log("State=" + state);

                state.Holder = this;
                state.OnEnter();
            }
        }
        
        public WordCard2Model ServerModel { get; set; }
        public WordCard2Model ClientModel { get; set; }
        public WordCard2View View { get; set; }
    }
}