using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
    public class SelectMissionState : DefaultWordCard2ControllerState, IInjectWordCard2ClientModel, IInjectWordCard2View
    {
        List<CardCore.Mission> works = new List<CardCore.Mission>();

        public override void OnEnter()
        {
            WordCard2Injector.Inject(this);
            UpdateMission();
            if (works.Count == 0)
            {
                Holder.State = new DefaultWordCard2ControllerState();
                return;
            }
            else if (works.Count == 1)
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
}