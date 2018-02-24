using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace HanCardAPI
{
    using Core;

    namespace Poke
    {
        public enum Shape
        {
            Spade, Heart, Diamond, Club
        }

        public enum Color
        {
            Red, Black
        }

        public enum Phase
        {
            Eat, Draw, End
        }

        public struct CardPrototype
        {
            public Shape shape;
            public int number;
        }

        public class Goal
        {
            public const string EAT_ONE_CARD = "出1張牌(0)撿紅點(1),若無法撿則到海底[cardId,cardId]";
            public const string DRAW_ONE_CARD = "抽1張牌(0)[cardId]";
            public const string PASS = "PASS";
            public string text;
            public List<int> refs = new List<int>();
        }

        public class Mission
        {
            public int owner;

            public List<Goal> goals = new List<Goal>();
            public int currGoal;
            public List<string> values = new List<string>();

            public bool IsReady
            {
                get
                {
                    foreach (var v in values)
                    {
                        if (v == null)
                        {
                            return false;
                        }
                    }
                    return true;
                }
            }

            public bool HasValue(int valueRef)
            {
                if (valueRef < 0 || valueRef >= values.Count)
                {
                    return false;
                }
                return values[valueRef] != null;
            }

            public int NewValueRef()
            {
                var idx = values.Count;
                values.Add(null);
                return idx;
            }

            public void ClearValue()
            {
                values.Clear();
            }
        }

        public class Context
        {
            public Table table = new Table();

            public List<int> playerHandStack = new List<int>();
            public List<int> playerEatStack = new List<int>();
            public int seaStack, drawStack;

            public int playerCnt;
            public int currPlayer;

            public Phase phase = Phase.Eat;

            public List<Mission> missions = new List<Mission>();
        }

        public class Alg
        {
            public static CardPrototype GetPrototype(string id)
            {
                CardPrototype p;
                var i = int.Parse(id);
                var shapeId = i / 13;
                var shape = Shape.Spade;
                switch (shapeId)
                {
                    case 0:
                        shape = Shape.Spade;
                        break;
                    case 1:
                        shape = Shape.Heart;
                        break;
                    case 2:
                        shape = Shape.Diamond;
                        break;
                    case 3:
                        shape = Shape.Club;
                        break;
                }
                p.shape = shape;
                p.number = (i % 13) + 1;
                return p;
            }

            public static Context CreateContext(int playerCnt, int startPlayer)
            {
                var ctx = new Context();
                ctx.playerCnt = playerCnt;
                ctx.currPlayer = startPlayer;
                // 先建立卡堆
                for (var i = 0; i < playerCnt; ++i)
                {
                    // 玩家手牌
                    ctx.playerHandStack.Add(Core.Alg.AddStack(ctx.table));
                    // 玩家撿到的牌
                    ctx.playerEatStack.Add(Core.Alg.AddStack(ctx.table));
                }
                // 海底
                ctx.seaStack = Core.Alg.AddStack(ctx.table);
                // 抽牌堆
                ctx.drawStack = Core.Alg.AddStack(ctx.table);
                // 再建立撲克牌
                for (var i = 0; i < 52; ++i)
                {
                    var proto = i.ToString();
                    // 放入抽牌堆
                    Core.Alg.AddCard(ctx.table, ctx.drawStack, proto);
                }
                // 洗牌
                Core.Alg.Shuffle(ctx.table, ctx.drawStack);
                // 取出4張
                var top4cards = Core.Alg.PeekCard(ctx.table, ctx.drawStack, 4);
                foreach (var c in top4cards)
                {
                    // 翻開
                    ctx.table.cards[c].faceUp = true;
                    // 移到海底
                    Core.Alg.MoveCard(ctx.table, c, ctx.drawStack, ctx.seaStack);
                }
                // 不管玩家數量, 每個人發6張, 發到完為止
                for (var i = 0; i < 6; ++i)
                {
                    for (var j = 0; j < playerCnt; ++j)
                    {
                        var top = Core.Alg.PeekCard(ctx.table, ctx.drawStack, 1);
                        if (top.Count < 0)
                        {
                            break;
                        }
                        Core.Alg.MoveCard(ctx.table, top[0], ctx.drawStack, ctx.playerHandStack[j]);
                    }
                }
                // 將玩家手牌整理
                for (var j = 0; j < playerCnt; ++j)
                {
                    var s = ctx.playerHandStack[j];
                    ctx.table.stacks[s].cards.Sort();
                }
                return ctx;
            }

            public static bool MatchCard(CardPrototype p1, CardPrototype p2)
            {
                if (p1.number > 10)
                {
                    return p1.number == p2.number;
                }
                return p1.number + p2.number == 10;
            }

            public static List<int> MatchCard(Context ctx, int card)
            {
                var cs = ctx.table.stacks[ctx.seaStack];
                var p1 = GetPrototype(ctx.table.cards[card].id);
                return cs.cards.FindAll(c =>
                {
                    var p2 = GetPrototype(ctx.table.cards[c].id);
                    return MatchCard(p1, p2);
                });
            }

            public static Color GetColor(Shape shape)
            {
                switch (shape)
                {
                    case Shape.Spade:
                    case Shape.Club:
                        return Color.Black;
                    default:
                        return Color.Red;
                }
            }

            public static int CalcScore(Context ctx, List<int> cards)
            {
                var score = 0;
                foreach (var c in cards)
                {
                    var p = GetPrototype(ctx.table.cards[c].id);
                    var isRed = GetColor(p.shape) == Color.Red;
                    if (isRed == false)
                    {
                        continue;
                    }
                    score += p.number;
                }
                return score;
            }

            // 遊戲一開始, 主動玩家立刻呼叫GetWorkingMissions, 取得未處理的事情
            public static Mission GetWorkingMissions(Context ctx, int playerId)
            {
                if (ctx.missions.Count > 0)
                {
                    return ctx.missions[ctx.missions.Count - 1];
                }
                return null;
            }

            // 取得當前能做的所有事情
            public static List<Mission> NewMissions(Context ctx, int playerId)
            {
                var ret = new List<Mission>();
                // 若不是主動玩家就沒事可做
                if (ctx.currPlayer != playerId)
                {
                    return ret;
                }
                switch (ctx.phase)
                {
                    case Phase.Eat:
                        {
                            var m = new Mission();
                            m.owner = playerId;

                            var d = new Goal();
                            d.text = Goal.EAT_ONE_CARD;
                            d.refs.Add(m.NewValueRef());
                            m.goals.Add(d);

                            ret.Add(m);
                        }
                        break;
                    case Phase.Draw:
                        {
                            var m = new Mission();
                            m.owner = playerId;

                            var d = new Goal();
                            d.text = Goal.DRAW_ONE_CARD;
                            var drawCardRef = m.NewValueRef();
                            d.refs.Add(drawCardRef);
                            m.goals.Add(d);

                            d = new Goal();
                            d.text = Goal.EAT_ONE_CARD;
                            d.refs.Add(drawCardRef);
                            m.goals.Add(d);

                            ret.Add(m);
                        }
                        break;
                    case Phase.End:
                        {
                            var m = new Mission();
                            m.owner = playerId;

                            var d = new Goal();
                            d.text = Goal.PASS;
                            m.goals.Add(d);

                            ret.Add(m);
                        }
                        break;
                }
                return ret;
            }

            // 主動玩家選一個任務後必須呼叫PushMission
            public static void PushMission(Context ctx, Mission mission)
            {
                ctx.missions.Add(mission);
            }

            // 執行選取的任務
            public static bool ApplyMission(Context ctx, int player, Mission mission)
            {
                var topMission = ctx.missions[ctx.missions.Count - 1];
                if (mission != topMission)
                {
                    throw new System.Exception("只能先處理堆疊頂端的任務");
                }
                var isUserMission = mission.owner >= 0;
                if (isUserMission && mission.owner != player)
                {
                    throw new System.Exception("只能處理自己的任務");
                }
                if (mission.IsReady == false)
                {
                    throw new System.Exception("任務所需的參數不能為空值");
                }
                if (mission.currGoal >= mission.goals.Count)
                {
                    throw new System.Exception("任務已執行完成, 請將任務從堆疊中刪掉");
                }
                var goal = mission.goals[mission.currGoal];
                switch (goal.text)
                {
                    case Goal.EAT_ONE_CARD:
                        {
                            var card1 = int.Parse(mission.values[goal.refs[0]]);
                            var card2 = int.Parse(mission.values[goal.refs[1]]);
                            var isMatch = MatchCard(ctx, card1).Contains(card2);
                            ctx.table.cards[card1].faceUp = true;

                            if (isMatch == false)
                            {
                                Core.Alg.MoveCard(ctx.table, card1, ctx.playerHandStack[player], ctx.seaStack);
                                ctx.phase = Phase.End;
                            }
                            else
                            {
                                Core.Alg.MoveCard(ctx.table, card1, ctx.playerHandStack[player], ctx.playerEatStack[player]);
                                Core.Alg.MoveCard(ctx.table, card2, ctx.seaStack, ctx.playerEatStack[player]);
                                ctx.phase = Phase.Draw;
                            }
                            mission.currGoal += 1;
                        }
                        break;
                    case Goal.DRAW_ONE_CARD:
                        {
                            var cs = Core.Alg.PeekCard(ctx.table, ctx.drawStack, 1);
                            if (cs.Count == 0)
                            {
                                // game over
                                return false;
                            }
                            var card1 = cs[0];
                            Core.Alg.MoveCard(ctx.table, card1, ctx.drawStack, ctx.playerHandStack[player]);
                            mission.values[goal.refs[0]] = card1.ToString();
                            mission.currGoal += 1;
                        }
                        break;
                    case Goal.PASS:
                        {
                            ctx.phase = Phase.Eat;
                            ctx.currPlayer = (ctx.currPlayer + 1) % ctx.playerCnt;
                        }
                        break;
                }
                return true;
            }
        }
    }
}