using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
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
                if (aiWorks.Count == 0)
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
}