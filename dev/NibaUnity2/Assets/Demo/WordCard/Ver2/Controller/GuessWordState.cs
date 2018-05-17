using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
    public class GuessWordState : DefaultWordCard2ControllerState, IInjectWordCard2ClientModel, IInjectWordCard2View
    {
        int cardKey;
        CardCore.Mission mission;

        public GuessWordState(CardCore.Mission mission, int cardKey)
        {
            this.mission = mission;
            this.cardKey = cardKey;
        }

        public override void OnEnter()
        {
            WordCard2Injector.Inject(this);
            WordCard2Injector.OnSelectWord += OnSelectWord;
            View.ShowWordOption(cardKey);
        }

        void OnSelectWord(string word)
        {
            Holder.Client.ClientSendWord(word, cardKey, mission);
        }

        public override void OnExit()
        {
            WordCard2Injector.OnSelectWord -= OnSelectWord;
        }
                
        public WordCard2Model ClientModel { get; set; }
        public WordCard2View View { get; set; }
    }
}