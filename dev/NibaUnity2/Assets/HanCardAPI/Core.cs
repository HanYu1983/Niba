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
        }
    }
}