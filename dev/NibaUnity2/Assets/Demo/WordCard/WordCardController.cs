using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardAPI = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
    public class WordCardController : MonoBehaviour
    {
        public WorldCardModel model;

        private void Start()
        {
            StartGame();
        }

        #region server
        void StartGame()
        {
            CardAPI.Observer.OnCardMove += OnCardMove;
            CardAPI.Observer.OnAddCard += OnCardAdd;
            DataAlg.CreateContext(model.ctx, 2, 0);
            RpcSyncContext(model.ctx);
            RpcSyncView();
        }
        void OnCardAdd(CardAPI.Table table, int stack, int card)
        {
            RpcAnimateCardAdd(stack, card);
        }
        void OnCardMove(CardAPI.Table table, int fromStack, int toStack, int card)
        {
            RpcAnimateCardMove(fromStack, toStack, card);
        }
        
        void CmdPushMission(CardAPI.Mission mis)
        {
            CardAPI.Alg.PushOrUpdateMission(model.ctx.missions, mis);
            try
            {
                while (true)
                {
                    var top = CardAPI.Alg.GetWorkingMissions(model.ctx.missions);
                    if (top.Equals(CardAPI.Mission.Empty))
                    {
                        break;
                    }
                    top = DataAlg.ProcessMission(model.ctx, top);
                    CardAPI.Alg.UpdateMissionWithSameKey(model.ctx.missions, top);
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning(e.Message);
            }
            RpcSyncContext(model.ctx);
        }
        #endregion

        #region view
        void RpcAnimateCardAdd(int stack, int card)
        {

        }

        void RpcAnimateCardMove(int fromStack, int toStack, int card)
        {

        }

        void RpcSyncView()
        {
            CreateCardView();
        }

        List<CardAPI.Mission> storeMissions;
        IEnumerator ShowMissionMenu(List<CardAPI.Mission> mis)
        {
            storeMissions = mis;
            yield return 0;
        }

        IEnumerator ShowCardSelection(string card)
        {
            yield return 0;
        }
        #endregion

        CardAPI.Mission selectMis = CardAPI.Mission.Empty;
        int selectCard1 = -1;

        public void onSelectMission(string misKey)
        {
            if(storeMissions == null)
            {
                return;
            }
            var m = storeMissions[0];
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD:
                    break;
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                    break;
            }
            selectMis = m;
        }

        public void onSelectCard(string cardKey)
        {
            if (selectMis.Equals(CardAPI.Mission.Empty))
            {
                return;
            }
            var m = selectMis;
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD:
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                    {
                        
                    }
                    break;
            }
        }

        

        void RpcSyncContext(Context ctx)
        {
            var top = CardAPI.Alg.GetWorkingMissions(ctx.missions, Player);
            if (top.Equals(CardAPI.Mission.Empty))
            {
                var mis = DataAlg.NewMissions(ctx, Player);
                if(mis.Count == 1)
                {
                    var m = mis[0];
                    var g = m.Goals[m.currGoal];
                    switch (g.text)
                    {
                        case Poke.GoalText.PASS:
                        case Poke.GoalText.DRAW_ONE_CARD:
                        case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                            {
                                CmdPushMission(m);
                                return;
                            }
                    }
                }
                else
                {
                    StartCoroutine(ShowMissionMenu(mis));
                }
            }
            else
            {
                StartCoroutine(ShowMissionMenu(new List<CardAPI.Mission>() { top }));
            }
           
        }

        int Player {
            get{
                return 0;
            }
        }

        IEnumerator CreateCardView()
        {
            yield return 0;
        }
    }
}