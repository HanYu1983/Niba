using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

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
            public int Score
            {
                get
                {
                    return Math.Min(number, 10);
                }
            }
        }

        [Serializable]
        public class Goal
        {
            public const string EAT_ONE_CARD = "出1張牌(0)撿紅點(1),若無法撿則到海底[cardId,cardId]";
            public const string EAT_ONE_CARD_FINISHED = "出1張牌(0)撿紅點(1),若無法撿則到海底[cardId,cardId], Finished";
            public const string DRAW_ONE_CARD = "抽1張牌(0)[cardId]";
            public const string PASS = "PASS";
            public string text;
            public List<int> refs = new List<int>();
            public bool isIgnoreCheckValue;
        }

        [Serializable]
        public class Mission
        {
            public static int keyCnt;
            public int key = keyCnt++;
            public int owner;

            public List<Goal> goals = new List<Goal>();
            public int currGoal;
            public List<string> values = new List<string>();

            public void AssignDataWithSameKey(Mission mis)
            {
                if(key != mis.key)
                {
                    throw new System.Exception("XXXX");
                }
                goals = mis.goals;
                currGoal = mis.currGoal;
                values = mis.values;
            }

            public bool IsReady
            {
                get
                {
                    var g = goals[currGoal];
                    if (g.isIgnoreCheckValue)
                    {
                        return true;
                    }
                    foreach(var r in g.refs)
                    {
                        if (string.IsNullOrEmpty(values[r]))
                        {
                            return false;
                        }
                    }
                    return true;
                    /*
                    foreach (var v in values)
                    {
                        if (string.IsNullOrEmpty(v))
                        {
                            return false;
                        }
                    }
                    return true;
                    */
                }
            }

            public bool HasValue(int valueRef)
            {
                if (valueRef < 0 || valueRef >= values.Count)
                {
                    return false;
                }
                return string.IsNullOrEmpty(values[valueRef]) == false;
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
                var total = 24;
                var numPerPeople = total / playerCnt;
                for (var i = 0; i < numPerPeople; ++i)
                {
                    for (var j = 0; j < playerCnt; ++j)
                    {
                        var top = Core.Alg.PeekCard(ctx.table, ctx.drawStack, 1);
                        if (top.Count <= 0)
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
                if (p1.number >= 10)
                {
                    return p1.number == p2.number;
                }
                return p1.number + p2.number == 10;
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
                    var p = GetPrototype(ctx.table.cards[c].prototype);
                    var isRed = GetColor(p.shape) == Color.Red;
                    if (isRed == false)
                    {
                        continue;
                    }
                    score += p.Score;
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
                            d.isIgnoreCheckValue = true;

                            var drawCardRef = m.NewValueRef();
                            d.refs.Add(drawCardRef);
                            m.goals.Add(d);

                            d = new Goal();
                            d.text = Goal.EAT_ONE_CARD_FINISHED;
                            d.refs.Add(drawCardRef);
                            d.refs.Add(m.NewValueRef());
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

            static Mission UpdateMissionWithSameKey(Context ctx, Mission mission)
            {
                foreach(var m in ctx.missions)
                {
                    if(m.key == mission.key)
                    {
                        m.AssignDataWithSameKey(mission);
                        return m;
                    }
                }
                throw new System.Exception("XXX");
            }

            // 主動玩家選一個任務後必須呼叫PushMission
            public static void PushMission(Context ctx, Mission mission)
            {
                //ctx.missions.Add(mission);
                var find = ctx.missions.Find(m =>
                {
                    return m.key == mission.key;
                });
                if(find != null)
                {
                    UpdateMissionWithSameKey(ctx, mission);
                }
                else
                {
                    ctx.missions.Add(mission);
                }
            }

            // 執行選取的任務
            public static Mission ApplyMission(Context ctx, int player, Mission mission)
            {
                Debug.Log("ApplyMission:"+JsonUtility.ToJson(mission));

                var topMission = ctx.missions[ctx.missions.Count - 1];
                if (mission.key != topMission.key)
                {
                    throw new System.Exception("只能先處理堆疊頂端的任務");
                }
                var isUserMission = topMission.owner >= 0;
                if (isUserMission && topMission.owner != player)
                {
                    throw new System.Exception("只能處理自己的任務");
                }
                if (topMission.currGoal >= topMission.goals.Count)
                {
                    throw new System.Exception("任務已執行完成, 請將任務從堆疊中刪掉");
                }
                if (topMission.IsReady == false)
                {
                    Debug.LogWarning("任務所需的參數不能為空值, 請補上值");
                    return null;
                }
                var goal = topMission.goals[topMission.currGoal];
                switch (goal.text)
                {
                    case Goal.EAT_ONE_CARD:
                    case Goal.EAT_ONE_CARD_FINISHED:
                        {
                            var card1 = int.Parse(topMission.values[goal.refs[0]]);
                            var card2 = int.Parse(topMission.values[goal.refs[1]]);
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
                                if (goal.text == Goal.EAT_ONE_CARD_FINISHED)
                                {
                                    ctx.phase = Phase.End;
                                }
                                else
                                {
                                    ctx.phase = Phase.Draw;
                                }
                            }
                            topMission.currGoal += 1;
                        }
                        break;
                    case Goal.DRAW_ONE_CARD:
                        {
                            var cs = Core.Alg.PeekCard(ctx.table, ctx.drawStack, 1);
                            if (cs.Count == 0)
                            {
                                // game over
                                return null;
                            }
                            var card1 = cs[0];
                            Core.Alg.MoveCard(ctx.table, card1, ctx.drawStack, ctx.playerHandStack[player]);
                            topMission.values[goal.refs[0]] = card1.ToString();
                            topMission.currGoal += 1;
                        }
                        break;
                    case Goal.PASS:
                        {
                            ctx.phase = Phase.Eat;
                            ctx.currPlayer = (ctx.currPlayer + 1) % ctx.playerCnt;
                            topMission.currGoal += 1;
                        }
                        break;
                }
                var isFinished = topMission.currGoal == topMission.goals.Count;
                if (isFinished)
                {
                    ctx.missions.Remove(topMission);
                    if(ctx.missions.Count == 0)
                    {
                        return null;
                    }
                    topMission = ctx.missions[ctx.missions.Count - 1];
                }
                return topMission;
            }
        }
    }
}