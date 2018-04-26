using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
namespace WordCard
{

    public class Context : Poke.Context
    {
        public List<int> isAIPlayer = new List<int>();
    }

    public class DataAlg
    {
        public static IEnumerator ProcessAI(Context ctx)
        {
            while (true)
            {
                var playerId = ctx.currPlayer;
                if(ctx.isAIPlayer.Contains(playerId) == false)
                {
                    yield break;
                }

                var top = Alg.GetWorkingMissions(ctx.missions, playerId);
                if (top.Equals(Mission.Empty))
                {
                    var mis = NewMissions(ctx, playerId);
                    if (mis.Count == 0)
                    {
                        yield break;
                    }
                    // select best mission
                    top = mis[0];
                }
                
                var goal = top.Goals[top.currGoal];
                switch (goal.text)
                {
                    default:
                        Alg.PushOrUpdateMission(ctx.missions, top);
                        break;
                    case Poke.GoalText.EAT_ONE_CARD:
                    case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                        {
                            var hasMatch = false;
                            var handCards = ctx.table.stacks[ctx.playerHandStack[playerId]].cards;
                            if (handCards.Count == 0)
                            {
                                top.currGoal = top.Goals.Count;
                                Alg.PushOrUpdateMission(ctx.missions, top);
                                break;
                            }
                            foreach (var c in handCards)
                            {
                                var matchs = MatchCard(ctx, c);
                                if(matchs.Count == 0)
                                {
                                    continue;
                                }
                                hasMatch = true;
                                var target = matchs[0];
                                top.Values[goal.refs[0]] = c+"";
                                top.Values[goal.refs[1]] = target + "";
                                Alg.PushOrUpdateMission(ctx.missions, top);
                                break;
                            }
                            if(hasMatch == false)
                            {
                                top.Values[goal.refs[0]] = handCards[0] + "";
                                top.Values[goal.refs[1]] = -1+"";
                                Alg.PushOrUpdateMission(ctx.missions, top);
                            }
                        }
                        break;
                }

                while (true)
                {
                    yield return 0;
                    var sysTop = Alg.GetWorkingMissions(ctx.missions);
                    if(sysTop.Equals(Mission.Empty))
                    {
                        break;
                    }
                    var info = "";
                    ProcessMission(ctx, sysTop, ref info);
                }
            }
        }

        public static void CreateContext(Context ctx, int playerCnt, int startPlayer)
        {
            ctx.playerCnt = playerCnt;
            ctx.currPlayer = startPlayer;
            // 先建立卡堆
            for (var i = 0; i < playerCnt; ++i)
            {
                // 玩家手牌
                ctx.playerHandStack.Add(Alg.AddStack(ctx.table));
                // 玩家撿到的牌
                ctx.playerEatStack.Add(Alg.AddStack(ctx.table));
            }
            // 海底
            ctx.seaStack = Alg.AddStack(ctx.table);
            // 抽牌堆
            ctx.drawStack = Alg.AddStack(ctx.table);

            // 再建立撲克牌
            for (var i = 0; i < 52; ++i)
            {
                var proto = ConfigCard.Get(i % ConfigCard.ID_COUNT).Id;
                // 放入抽牌堆
                Alg.AddCard(ctx.table, ctx.drawStack, proto);
            }
            // 洗牌
            Alg.Shuffle(ctx.table, ctx.drawStack);
            // 取出4張
            var top4cards = Alg.PeekCard(ctx.table, ctx.drawStack, 4);
            foreach (var c in top4cards)
            {
                // 翻開
                ctx.table.cards[c].faceUp = true;
                // 移到海底
                Alg.MoveCard(ctx.table, c, ctx.drawStack, ctx.seaStack);
            }
            var total = 6;// 24;
            var numPerPeople = total / playerCnt;
            for (var i = 0; i < numPerPeople; ++i)
            {
                for (var j = 0; j < playerCnt; ++j)
                {
                    var top = Alg.PeekCard(ctx.table, ctx.drawStack, 1);
                    if (top.Count <= 0)
                    {
                        break;
                    }
                    Alg.MoveCard(ctx.table, top[0], ctx.drawStack, ctx.playerHandStack[j]);
                }
            }
            // 將玩家手牌整理
            for (var j = 0; j < playerCnt; ++j)
            {
                var s = ctx.playerHandStack[j];
                ctx.table.stacks[s].cards.Sort();
            }
        }

        static List<string> ParseMatch(string str)
        {
            return new List<string>(str.Split(','));
        }

        public static bool MatchCard(ConfigCard p1, ConfigCard p2)
        {
            var matchs = ParseMatch(p1.Match);
            return matchs.Contains(p2.Id);
        }

        public static List<int> MatchCard(Context ctx, int card)
        {
            var cs = ctx.table.stacks[ctx.seaStack];
            var p1 = ConfigCard.Get(ctx.table.cards[card].prototype);
            return cs.cards.FindAll(c =>
            {
                var p2 = ConfigCard.Get(ctx.table.cards[c].prototype);
                return MatchCard(p1, p2);
            });
        }

        // 取得當前能做的所有事情
        public static List<Mission> NewMissions(Context ctx, int playerId)
        {
            switch (ctx.phase)
            {
                default:
                    return Poke.Alg.NewMissions(ctx, playerId);
            }
        }

        public static Mission ProcessMission(Context ctx, Mission topMission, ref string info)
        {
            var goal = topMission.Goals[topMission.currGoal];
            var player = topMission.Owner;

            switch (goal.text)
            {
                case Poke.GoalText.EAT_ONE_CARD:
                case Poke.GoalText.EAT_ONE_CARD_FINISHED:
                    {
                        var card1 = int.Parse(topMission.Values[goal.refs[0]]);
                        var card2 = int.Parse(topMission.Values[goal.refs[1]]);
                        if(card2 == -1)
                        {
                            // 丟到海底
                            Alg.MoveCard(ctx.table, card1, ctx.playerHandStack[player], ctx.seaStack);
                            ctx.phase = Poke.Phase.End;
                        }
                        else
                        {
                            var isMatch = MatchCard(ctx, card1).Contains(card2);
                            ctx.table.cards[card1].faceUp = true;

                            if (isMatch == false)
                            {
                                // 配對錯誤, 無法出牌
                                // 只切換階段
                                ctx.phase = Poke.Phase.End;
                                info = "不符配對規則. 罰無法出牌";
                                Debug.Log(info);
                            }
                            else
                            {
                                Alg.MoveCard(ctx.table, card1, ctx.playerHandStack[player], ctx.playerEatStack[player]);
                                Alg.MoveCard(ctx.table, card2, ctx.seaStack, ctx.playerEatStack[player]);
                                if (goal.text == Poke.GoalText.EAT_ONE_CARD_FINISHED)
                                {
                                    ctx.phase = Poke.Phase.End;
                                }
                                else
                                {
                                    ctx.phase = Poke.Phase.Draw;
                                }
                            }
                        }
                        topMission.currGoal += 1;
                    }
                    break;
                default:
                    {
                        return Poke.Alg.ProcessMission(ctx, topMission);
                    }
            }
            return topMission;
        }
    }
}