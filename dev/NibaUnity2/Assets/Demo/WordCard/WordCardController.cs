using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardAPI = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;
using System.Linq;

namespace WordCard
{
    public class WordCardController : MonoBehaviour
    {
        public WordCardModel model;

        private void Start()
        {
            StartGame();
        }

        #region server
        public void StartGame()
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
                    Debug.Log("process:" + top.description);
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
            Debug.Log("RpcAnimateCardAdd");
        }

        void RpcAnimateCardMove(int fromStack, int toStack, int card)
        {
            Debug.Log("RpcAnimateCardMove");
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

        List<int> storeCards;
        IEnumerator ShowCardSelection(List<int> cards)
        {
            storeCards = cards;
            yield return 0;
        }
        #endregion


        private void OnGUI()
        {
            GUILayout.BeginArea(new Rect(100, 0, 500, 500));
            GUILayout.Label("currPlayer:" + model.ctx.currPlayer);
            GUILayout.Label("=== mission ===");
            if (storeMissions != null)
            {
                foreach (var m in storeMissions)
                {
                    if (GUILayout.Button(m.description))
                    {
                        onSelectMission(m.Key);
                    }
                }
            }

            if(selectMis.Equals(CardAPI.Mission.Empty) == false)
            {
                if (selectMis.IsReady)
                {
                    if(GUILayout.Button("Commit:" + selectMis.description))
                    {
                        CmdPushMission(selectMis);
                        selectMis = CardAPI.Mission.Empty;
                    }
                }
                else
                {
                    GUILayout.Label("Process:" + selectMis.description);
                }
            }

            GUILayout.Label("=== hand ===");
            if (storeCards != null)
            {
                foreach (var cid in storeCards)
                {
                    var c = model.ctx.table.cards[cid];
                    var cfg = ConfigCard.Get(c.prototype);
                    if (GUILayout.Button(cfg.Name))
                    {
                        onSelectCard1(c.Key);
                    }
                }
            }

            GUILayout.Label("=== sea ===");
            foreach (var cid in model.ctx.table.stacks[model.ctx.seaStack].cards)
            {
                var c = model.ctx.table.cards[cid];
                var cfg = ConfigCard.Get(c.prototype);
                if (GUILayout.Button(cfg.Name + "[" + cfg.Description + "]"))
                {
                    onSelectCard2(c.Key);
                }
            }
            


            GUILayout.EndArea();
        }


        CardAPI.Mission selectMis = CardAPI.Mission.Empty;
        int selectCard1 = -1;

        public void onSelectMission(string misKey)
        {
            if(storeMissions == null)
            {
                return;
            }
            var m = storeMissions.Where(mis => mis.Key == misKey).FirstOrDefault();
            if (m.Equals(CardAPI.Mission.Empty))
            {
                throw new Exception("XXXX:" + misKey);
            }
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD:
                    StartCoroutine(ShowCardSelection(model.ctx.table.stacks[model.ctx.playerHandStack[Player]].cards));
                    break;
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                    break;
            }
            selectMis = m;
        }
        
        public void onSelectCard1(int cardKey)
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
                    {
                        m.Values[g.refs[0]] = cardKey + "";
                    }
                    break;
            }
        }

        public void onSelectCard2(int cardKey)
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
                        m.Values[g.refs[1]] = cardKey + "";
                    }
                    break;
            }
        }

        void RpcSyncContext(Context ctx)
        {
            var top = CardAPI.Alg.GetWorkingMissions(ctx.missions, Player);
            if (top.Equals(CardAPI.Mission.Empty))
            {
                Debug.Log("0");
                var mis = DataAlg.NewMissions(ctx, Player);
                Debug.Log("1:"+mis.Count);
                if (mis.Count == 1)
                {
                    var m = mis[0];
                    var g = m.Goals[m.currGoal];
                    Debug.Log(g.text);
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
                StartCoroutine(ShowMissionMenu(mis));
            }
            else
            {
                StartCoroutine(ShowMissionMenu(new List<CardAPI.Mission>() { top }));
            }
           
        }

        int Player {
            get{
                return model.ctx.currPlayer;
            }
        }

        IEnumerator CreateCardView()
        {
            yield return 0;
        }
    }
}