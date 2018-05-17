using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
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
            var m = mis;
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD:
                    {
                        m.Values[g.refs[0]] = c.Key + "";
                    }
                    break;
            }
        }
        void OnSelectCard2(CardCore.Card c)
        {
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
                            var card1Key = int.Parse(m.Values[g.refs[0]]);
                            Holder.State = new GuessWordState(m, card1Key);
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
}