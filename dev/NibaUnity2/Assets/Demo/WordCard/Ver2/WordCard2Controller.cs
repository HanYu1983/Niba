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
    }

    public interface IWordCard2Controller
    {
        IWordCard2Client Client { get; set; }
        IWordCard2ControllerState State { get; set; }
    }

    public class AIState : DefaultWordCard2ControllerState, IInjectWordCard2ServerModel, IInjectWordCard2View
    {
        int player;
        Coroutine task;
        public AIState(int player)
        {
            this.player = player;
        }
        public override void OnEnter()
        {
            WordCard2Injector.Inject(this);
            task = View.StartCoroutine(Thinking());
        }
        public override void OnExit()
        {
            View.StopCoroutine(task);
        }
        IEnumerator Thinking()
        {
            var ctx = ServerModel.ctx;
            while (true)
            {
                // 取得任務
                var aiWorks = new List<CardCore.Mission>();
                // 待處理任務
                var w = CardCore.Alg.GetWorkingMissions(ctx.missions, player);
                if (w.Equals(CardCore.Mission.Empty) == false)
                {
                    aiWorks.Add(w);
                }
                else
                {
                    // 若無待處理任務, 則取得新任務
                    var works = Poke.Alg.NewMissions(ctx, player);
                    aiWorks.AddRange(works);
                }
                // 無任務, AI執行完畢, 同步前台
                if(aiWorks.Count == 0)
                {
                    Holder.Client.ServerSyncModel();
                    Holder.Client.ServerNotifyAction();
                    yield break;
                }
                // 處理任務
                var selectMis = aiWorks[0];
                var g = selectMis.Goals[selectMis.currGoal];
                switch (g.text)
                {
                    case Poke.GoalText.PASS:
                    case Poke.GoalText.DRAW_ONE_CARD:
                        {
                            // 這裡直接修改伺服端的model
                            Holder.Client.ServerPushMission(selectMis);
                        }
                        break;
                    case Poke.GoalText.EAT_ONE_CARD:
                        {
                            var cards = ctx.table.stacks[ctx.playerHandStack[player]].cards;
                            if (cards.Count == 0)
                            {
                                Debug.Log("card count = 0");
                                yield break;
                            }
                            selectMis.Values[g.refs[0]] = cards[0] + "";
                            selectMis.Values[g.refs[1]] = "-1";
                            Holder.Client.ServerPushMission(selectMis);
                        }
                        break;
                    case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                        {
                            selectMis.Values[g.refs[1]] = "-1";
                            Holder.Client.ServerPushMission(selectMis);
                        }
                        break;
                }
                yield return new WaitForSeconds(0.2f);
            }
        }
        public WordCard2Model ServerModel { get; set; }
        public WordCard2View View { get; set; }
    }

    public class HandleMissionState : DefaultWordCard2ControllerState
    {
        CardCore.Mission mis;
        public HandleMissionState(CardCore.Mission mis)
        {
            this.mis = mis;
            Debug.Log("HandleMissionState:"+mis.Goals[mis.currGoal].text);
        }
        public override void OnEnter()
        {
            WordCard2Injector.Inject(this);
            WordCard2Injector.OnSelectCard += OnSelectCard;
            WordCard2Injector.OnSelectCard2 += OnSelectCard2;
            var m = mis;
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.PASS:
                case Poke.GoalText.DRAW_ONE_CARD:
                    {
                        Holder.Client.ClientPushMission(m);
                        return;
                    }
            }
        }
        public override void OnExit()
        {
            WordCard2Injector.OnSelectCard -= OnSelectCard;
            WordCard2Injector.OnSelectCard2 -= OnSelectCard2;
        }
        void OnSelectCard(CardCore.Card c)
        {
            Debug.Log("OnSelectCard");
            var m = mis;
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                case Poke.GoalText.EAT_ONE_CARD:
                    {
                        m.Values[g.refs[0]] = c.Key + "";
                    }
                    break;
            }
        }
        void OnSelectCard2(CardCore.Card c)
        {
            Debug.Log("OnSelectCard2");
            var m = mis;
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                case Poke.GoalText.EAT_ONE_CARD:
                    {
                        m.Values[g.refs[1]] = c.Key + "";
                        if (m.IsReady)
                        {
                            Debug.Log("===============");
                            Holder.Client.ClientPushMission(m);
                            Debug.Log("***************");
                        }
                        else
                        {
                            Debug.Log("no ready!!!");
                        }
                        
                    }
                    break;
            }
        }
    }

    public class SelectMissionState : DefaultWordCard2ControllerState, IInjectWordCard2ClientModel, IInjectWordCard2View
    {
        List<CardCore.Mission> works = new List<CardCore.Mission>();

        public override void OnEnter()
        {
            WordCard2Injector.Inject(this);
            UpdateMission();
            if(works.Count == 0)
            {
                Holder.State = new DefaultWordCard2ControllerState();
                return;
            }
            else if(works.Count == 1)
            {
                Holder.State = new HandleMissionState(works[0]);
                return;
            }
            else
            {
                View.ShowMission(works);
                WordCard2Injector.OnSelectMission += OnSelectMission;
            }
        }

        public override void OnExit()
        {
            WordCard2Injector.OnSelectMission -= OnSelectMission;
        }

        void OnSelectMission(CardCore.Mission mis)
        {
            Holder.State = new HandleMissionState(mis);
        }

        void UpdateMission()
        {
            works.Clear();

            var player = Holder.Client.Player;
            var clientCtx = ClientModel.ctx;
            var w = CardCore.Alg.GetWorkingMissions(clientCtx.missions, player);
            if (w.Equals(CardCore.Mission.Empty) == false)
            {
                works.Add(w);
            }
            else
            {
                var newWorks = Poke.Alg.NewMissions(clientCtx, player);
                works.AddRange(newWorks);
            }
        }
        public WordCard2Model ClientModel { get; set; }
        public WordCard2View View { get; set; }
    }

    

    public class WordCard2Controller : MonoBehaviour, IWordCard2Controller, IInjectWordCard2ClientModel, IInjectWordCard2ServerModel, IInjectWordCard2View
    {
        void Start()
        {
            WordCard2Injector.Inject(this);
            ServerModel.ctx.OnPlayerChange += OnPlayerChange;
        }

        public void OnPlayerChange(int oldPlayer, int currPlayer)
        {
            Client.ServerPlayerChange();
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