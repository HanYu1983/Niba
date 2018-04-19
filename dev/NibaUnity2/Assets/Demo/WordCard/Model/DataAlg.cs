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
                if (top == null)
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
                    if(sysTop == null)
                    {
                        break;
                    }
                    ProcessMission(ctx, sysTop);
                }
            }
        }

        public static bool MatchCard(ConfigCard p1, ConfigCard p2)
        {
            return p1.Match == p2.Id || p2.Match == p1.Id;
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

        public static void ProcessMission(Context ctx, Mission topMission)
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
                        var isMatch = MatchCard(ctx, card1).Contains(card2);
                        ctx.table.cards[card1].faceUp = true;

                        if (isMatch == false)
                        {
                            // 配對錯誤, 無法出牌
                            // 只切換階段
                            ctx.phase = Poke.Phase.End;
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
                        topMission.currGoal += 1;
                    }
                    break;
                default:
                    {
                        Poke.Alg.ProcessMission(ctx, topMission);
                    }
                    break;
            }
        }
    }
}