using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.Linq;

namespace HanCardAPI
{
    namespace Core
    {
        [Serializable]
        public class Card
        {
            public int key;
            public bool faceUp;
            public string prototype;
        }

        [Serializable]
        public class CardStack
        {
            public int key;
            public List<int> cards = new List<int>();
        }

        [Serializable]
        public class Table
        {
            public List<Card> cards = new List<Card>();
            public List<CardStack> stacks = new List<CardStack>();
        }

        [Serializable]
        public class Goal
        {

            public string text;
            public List<int> refs = new List<int>();
            public bool isIgnoreCheckValue;
        }

        [Serializable]
        public class Mission
        {
            [SerializeField]
            string key = Guid.NewGuid().ToString();
            [SerializeField]
            int owner;
            [SerializeField]
            List<Goal> goals = new List<Goal>();
            [SerializeField]
            List<string> values = new List<string>();

            public int currGoal;
            public int currPermissionOwner;

            public string Key { get { return key; } }
            public int Owner { get { return owner; } }
            public List<Goal> Goals { get { return goals; } }
            public List<string> Values { get { return values; } }

            public Mission(int player)
            {
                owner = currPermissionOwner = player;
            }

            public void AssignDataWithSameKey(Mission mis)
            {
                if (key != mis.key)
                {
                    throw new System.Exception("XXXX");
                }
                if(this == mis)
                {
                    return;
                }
                goals.Clear();
                goals.AddRange(mis.goals);

                currGoal = mis.currGoal;
                currPermissionOwner = mis.currPermissionOwner;

                values.Clear();
                values.AddRange(mis.values);
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
                    foreach (var r in g.refs)
                    {
                        if (string.IsNullOrEmpty(values[r]))
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

        public class Alg
        {
            public static int AddCard(Table table, int stack, string id)
            {
                var c = new Card();
                var key = table.cards.Count;
                c.key = key;
                c.prototype = id;
                table.cards.Add(c);
                table.stacks[stack].cards.Add(key);
                return key;
            }

            public static List<int> AddCards(Table table, int stack, string id, int count)
            {
                var ret = new List<int>();
                for (var i = 0; i < count; ++i)
                {
                    var key = AddCard(table, stack, id);
                    ret.Add(key);
                }
                return ret;
            }

            public static int AddStack(Table table)
            {
                var key = table.stacks.Count;
                var cs = new CardStack();
                cs.key = key;
                table.stacks.Add(cs);
                return key;
            }

            public static void Shuffle(Table table, int cardStackKey)
            {
                var r = new System.Random();
                var shuffled = table.stacks[cardStackKey].cards.OrderBy(x => r.Next());
                table.stacks[cardStackKey].cards = shuffled.ToList();
            }

            public static List<int> PeekCard(Table table, int cardStackKey, int cnt, bool inverse = false)
            {
                var stackCardCnt = table.stacks[cardStackKey].cards.Count;
                var ret = new List<int>();
                for (var i = 0; i < cnt; ++i)
                {
                    var idx = (stackCardCnt-1) - i;
                    if (inverse)
                    {
                        idx = i;
                    }
                    if (idx < 0 || idx >= stackCardCnt)
                    {
                        break;
                    }
                    ret.Add(table.stacks[cardStackKey].cards[idx]);
                }
                return ret;
            }

            public static void MoveCard(Table table, int key, int fromStack, int toStack, bool inverse = false)
            {
                var fs = table.stacks[fromStack];
                var ts = table.stacks[toStack];
                fs.cards.Remove(key);
                if (inverse)
                {
                    ts.cards.Insert(0, key);
                }
                else
                {
                    ts.cards.Add(key);
                }
            }

            // 遊戲一開始, 主動玩家立刻呼叫GetWorkingMissions, 取得未處理的事情
           /* public static Mission GetWorkingMissions(List<Mission> missions)
            {
                if (missions.Count > 0)
                {
                    var topMission = missions[missions.Count - 1];
                    return topMission;
                }
                return null;
            }*/

            static Mission UpdateMissionWithSameKey(List<Mission> missions, Mission mission)
            {
                foreach (var m in missions)
                {
                    if (m.Key == mission.Key)
                    {
                        m.AssignDataWithSameKey(mission);
                        return m;
                    }
                }
                throw new System.Exception("XXX");
            }

            // 主動玩家選一個任務後必須呼叫PushMission
            public static void PushOrUpdateMission(List<Mission> missions, Mission mission)
            {
                if(mission == null)
                {
                    throw new Exception("can no t null");
                }
                var find = missions.Find(m =>
                {
                    return m.Key == mission.Key;
                });
                if (find != null)
                {
                    UpdateMissionWithSameKey(missions, mission);
                }
                else
                {
                    missions.Add(mission);
                }
            }

            // 遊戲一開始, 主動玩家立刻呼叫GetWorkingMissions, 取得未處理的事情
            public static Mission GetWorkingMissions(List<Mission> missions, int player = -1)
            {
                if(missions.Count == 0)
                {
                    return null;
                }
                var topMission = missions[missions.Count - 1];
                if (topMission.currGoal >= topMission.Goals.Count)
                {
                    missions.Remove(topMission);
                    if (missions.Count == 0)
                    {
                        return null;
                    }
                    topMission = missions[missions.Count - 1];
                }
                // 如果有指定執行者
                if(player >= 0)
                {
                    if (topMission.currPermissionOwner == player)
                    {
                        return topMission;
                    } else
                    {
                        return null;
                    }
                }
                if (topMission.IsReady == false)
                {
                    return null;
                }
                return topMission;
            }
        }
    }
}