using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
namespace WordCard
{

    public struct CardPrototype
    {
        
    }

    public class Context : Poke.Context
    {

    }

    public class DataAlg
    {
        public static CardPrototype GetPrototype(string id)
        {
            CardPrototype p;
            return p;
        }

        public static bool MatchCard(CardPrototype p1, CardPrototype p2)
        {
            return false;
        }

        public static List<int> MatchCard(Context ctx, int card)
        {
            var cs = ctx.table.stacks[ctx.seaStack];
            var p1 = GetPrototype(ctx.table.cards[card].prototype);
            return cs.cards.FindAll(c =>
            {
                var p2 = GetPrototype(ctx.table.cards[c].prototype);
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
                            Alg.MoveCard(ctx.table, card1, ctx.playerHandStack[player], ctx.seaStack);
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