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
            model.ctx.table.OnCardMove += OnCardMove;
            model.ctx.table.OnAddCard += OnCardAdd;
            model.ctx.OnPlayerChange += OnPlayerChange;
            DataAlg.CreateContext(model.ctx, 2, 0);
            RpcSyncContext(model.ctx);
            RpcSyncView();
        }
        void OnPlayerChange(int old, int curr)
        {
            RpcMessage("輪到玩家:"+curr);
        }
        void OnCardAdd(int stack, int card)
        {
            RpcAnimateCardAdd(stack, card);
            
        }
        void OnCardMove(int fromStack, int toStack, int card)
        {
            RpcAnimateCardMove(fromStack, toStack, card);
            if (model.ctx.playerHandStack[Player] == toStack)
            {
                var cfg = ConfigCard.Get(model.ctx.table.cards[card].prototype);
                RpcMessage(string.Format("你抽到:"+cfg.Name));
            }
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
                    var info = "";
                    top = DataAlg.ProcessMission(model.ctx, top, ref info);
                    CardAPI.Alg.UpdateMissionWithSameKey(model.ctx.missions, top);

                    if(info != "")
                    {
                        RpcMessage(info);
                    }
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning(e.Message);
                RpcMessage(e.Message);
            }
            RpcSyncContext(model.ctx);
        }
        #endregion

        #region view
        List<string> animateList = new List<string>();
        void RpcAnimateCardAdd(int stack, int card)
        {
            Debug.Log("RpcAnimateCardAdd");
            animateList.Insert(0, "RpcAnimateCardAdd");
        }

        void RpcAnimateCardMove(int fromStack, int toStack, int card)
        {
            Debug.Log("RpcAnimateCardMove");
            animateList.Insert(0, "RpcAnimateCardMove");
        }

        void RpcMessage(string msg)
        {
            animateList.Insert(0, "RpcMessage:"+msg);
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

        public Font font;
        private void OnGUI(){
            GUI.skin.font = font;

            GUILayout.BeginArea(new Rect(100, 0, 500, 800));
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
                    if(GUILayout.Button("確認:" + selectMis.description))
                    {
                        CmdPushMission(selectMis);
                        selectMis = CardAPI.Mission.Empty;
                    }
                }
                else
                {
                    GUILayout.Label("玩家思考中:" + selectMis.description);
                }

                if (selectMis.Equals(CardAPI.Mission.Empty) == false)
                {
                    foreach (var g in selectMis.Goals)
                    {
                        GUILayout.Label(string.Format("[{0}]{1}", g == selectMis.Goals[selectMis.currGoal] ? "*" : "", g.text));
                    }
                }
            }
            else
            {
                GUILayout.Label("請選擇一個任務");
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
            if (GUILayout.Button("海底"))
            {
                onSelectCard2(-1);
            }
            foreach (var cid in model.ctx.table.stacks[model.ctx.seaStack].cards)
            {
                var c = model.ctx.table.cards[cid];
                var cfg = ConfigCard.Get(c.prototype);
                if (GUILayout.Button(cfg.Name + "[" + cfg.Description + "]"))
                {
                    onSelectCard2(c.Key);
                }
            }

            GUILayout.Label("=== animate ===");
            foreach(var s in animateList)
            {
                GUILayout.Label(s);
            }

            GUILayout.EndArea();
        }


        CardAPI.Mission selectMis = CardAPI.Mission.Empty;

        public void onSelectMission(string misKey)
        {
            if(storeMissions == null)
            {
                Debug.LogWarning("storeMissions == null");
                return;
            }
            var m = storeMissions.Where(mis => mis.Key == misKey).FirstOrDefault();
            if (m.Equals(CardAPI.Mission.Empty))
            {
                throw new Exception("mission not found:" + misKey);
            }
            var g = m.Goals[m.currGoal];
            switch (g.text)
            {
                case Poke.GoalText.EAT_ONE_CARD:
                    StartCoroutine(ShowCardSelection(model.ctx.table.stacks[model.ctx.playerHandStack[Player]].cards));
                    break;
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                    StartCoroutine(ShowCardSelection(new List<int>()));
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
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                    {
                        Debug.LogWarning("can not select card1");
                    }
                    break;
            }
            var c = model.ctx.table.cards[cardKey];
            var cfg = ConfigCard.Get(c.prototype);
            RpcMessage(string.Format("你將要丟出{0}", cfg.Name));
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
            if(cardKey < 0)
            {
                RpcMessage("你將要丟到海底");
            }
            else
            {
                var c = model.ctx.table.cards[cardKey];
                var cfg = ConfigCard.Get(c.prototype);
                RpcMessage(string.Format("你將要配對{0}", cfg.Name));
            }
        }

        void RpcSyncContext(Context ctx)
        {
            var top = CardAPI.Alg.GetWorkingMissions(ctx.missions, Player);
            if (top.Equals(CardAPI.Mission.Empty))
            {
                var mis = DataAlg.NewMissions(ctx, Player);
                if (mis.Count == 1)
                {
                    var m = mis[0];
                    var g = m.Goals[m.currGoal];
                    switch (g.text)
                    {
                        case Poke.GoalText.PASS:
                        case Poke.GoalText.DRAW_ONE_CARD:
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
                //StartCoroutine(ShowMissionMenu(new List<CardAPI.Mission>() { top }));
                //onSelectMission(top.Key);
                StartCoroutine(ShowMissionAndSelect(new List<CardAPI.Mission>() { top }, top.Key));
            }
           
        }

        IEnumerator ShowMissionAndSelect(List<CardAPI.Mission> mis, string misKey)
        {
            yield return ShowMissionMenu(mis);
            onSelectMission(misKey);
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