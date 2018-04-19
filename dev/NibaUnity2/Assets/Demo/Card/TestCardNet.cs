using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using HanCardAPI.Poke;
using HanCardAPI.Core;
using PokeAlg = HanCardAPI.Poke.Alg;
using CoreAlg = HanCardAPI.Core.Alg;

namespace CardGame
{
    public class TestCardNet : NetworkBehaviour
    {
        public override void OnStartServer()
        {
            var id = GetComponent<NetworkIdentity>();
            Debug.Log("OnStartServer:" + id.playerControllerId + ":isServer=" + isServer);
        }

        public override void OnStartClient()
        {
            var id = GetComponent<NetworkIdentity>();
            Debug.Log("OnStartClient:" + id.playerControllerId + ":isClient=" + isClient);
        }

        public override void OnStartLocalPlayer()
        {
            var id = GetComponent<NetworkIdentity>();
            Debug.Log("OnStartLocalPlayer:" + id.playerControllerId + ":isLocalPlayer=" + isLocalPlayer);

            if (isLocalPlayer == false)
            {
                return;
            }
            CmdAddClient();
        }

        void OnGUI()
        {
            DrawDebugView();
        }

        #region client manager
        [SyncVar]
        public int playerId;
        public static List<TestCardNet> clients = new List<TestCardNet>();
        [Command]
        void CmdAddClient()
        {
            this.playerId = clients.Count;
            clients.Add(this);
        }
        #endregion

        static Context serverCtx;
        void CreateCardTable()
        {
            var playerCnt = clients.Count;
            serverCtx = PokeAlg.CreateContext(playerCnt, 0);

            var json = JsonUtility.ToJson(serverCtx);
            // 傳給所有對應的client
            foreach (var c in clients)
            {
                c.RpcUpdateContext(json);
            }
        }

        Context clientCtx;
        public List<int> canEat;
        public int selectCard, selectCard2;
        public List<Mission> works = new List<Mission>();
        public Mission selectWork;
        public int score;
        [ClientRpc]
        void RpcUpdateContext(string json)
        {
            Debug.Log("RpcUpdateContext:" + json);
            if(isLocalPlayer == false)
            {
                return;
            }

            var ctx = JsonUtility.FromJson<Context>(json);
            clientCtx = ctx;
            canEat.Clear();
            works = null;
            selectWork = null;

            score = PokeAlg.CalcScore(clientCtx, clientCtx.table.stacks[clientCtx.playerEatStack[playerId]].cards);

            var w = CoreAlg.GetWorkingMissions(clientCtx.missions, playerId);
            if (w != null)
            {
                works = new List<Mission>();
                works.Add(w);
            }
            else
            {
                works = PokeAlg.NewMissions(clientCtx, playerId);
            }
        }

        [Command]
        void CmdPushMission(string missionJson)
        {
            var mis = JsonUtility.FromJson<Mission>(missionJson);
            CoreAlg.PushOrUpdateMission(serverCtx.missions, mis);
            while (true)
            {
                var top = CoreAlg.GetWorkingMissions(serverCtx.missions);
                if(top == null)
                {
                    break;
                }
                PokeAlg.ProcessMission(serverCtx, top);
            }
            /*
            var next = CoreAlg.GetWorkingMissions(serverCtx.missions);
            do
            {
                next = PokeAlg.ApplyMission(serverCtx, playerId, next);
            }
            while (next != null);
            */
            foreach(var c in clients)
            {
                c.RpcUpdateContext(JsonUtility.ToJson(serverCtx));
            }
        }

        void DrawDebugView()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            GUILayout.BeginArea(new Rect(200, 0, 700, 700));
            GUILayout.Label("hasContext:" + (clientCtx != null));
            if (isServer)
            {
                if (clientCtx == null)
                {
                    if (GUILayout.Button("create card table"))
                    {
                        CreateCardTable();
                    }
                }
            }
            if (clientCtx != null)
            {
                var isActivePlayer = (clientCtx.currPlayer == playerId);
                GUILayout.Label("isActivePlayer:" + isActivePlayer);
                GUILayout.Label("phase:" + clientCtx.phase);
                GUILayout.Label("score:" + score);

                if (works != null)
                {
                    for (var i = 0; i < works.Count; ++i)
                    {
                        var w = works[i];
                        if (isActivePlayer)
                        {
                            if (GUILayout.Button("work " + i))
                            {
                                selectWork = w;
                            }
                        }
                        else
                        {
                            GUILayout.Label("work " + i);
                        }
                        for (var j = 0; j < w.Goals.Count; ++j)
                        {
                            var t = (j == w.currGoal) ? "[*]" : "[ ]";
                            t += w.Goals[j].text;
                            GUILayout.Label(t);
                        }
                    }
                }

                if (selectWork != null)
                {
                    var g = selectWork.Goals[selectWork.currGoal];
                    switch (g.text)
                    {
                        case GoalText.EAT_ONE_CARD:
                        case GoalText.EAT_ONE_CARD_FINISHED:
                            {
                                GUILayout.Label("================ Select Hand ================");
                                var hasSelectOne = selectWork.HasValue(g.refs[0]);
                                if (hasSelectOne == false)
                                {
                                    var cs2 = clientCtx.table.stacks[clientCtx.playerHandStack[playerId]].cards;
                                    foreach (var c in cs2)
                                    {
                                        var p = PokeAlg.GetPrototype(clientCtx.table.cards[c].prototype);
                                        if (GUILayout.Button(p.shape.ToString() + p.number))
                                        {
                                            selectCard = c;
                                            var canEat = PokeAlg.MatchCard(clientCtx, selectCard);
                                            this.canEat = canEat;
                                        }
                                    }
                                }
                                else
                                {
                                    selectCard = int.Parse(selectWork.Values[g.refs[0]]);
                                    var canEat = PokeAlg.MatchCard(clientCtx, selectCard);
                                    this.canEat = canEat;
                                }

                                if (GUILayout.Button("put sea"))
                                {
                                    selectCard2 = -1;

                                    selectWork.Values[g.refs[0]] = selectCard.ToString();
                                    selectWork.Values[g.refs[1]] = selectCard2.ToString();
                                    Debug.Log(JsonUtility.ToJson(selectWork));
                                    CmdPushMission(JsonUtility.ToJson(selectWork));
                                }
                            }
                            break;
                        case GoalText.DRAW_ONE_CARD:
                            {
                                if (GUILayout.Button("draw"))
                                {
                                    CmdPushMission(JsonUtility.ToJson(selectWork));
                                }
                            }
                            break;
                        case GoalText.PASS:
                            {
                                if (GUILayout.Button("pass"))
                                {
                                    CmdPushMission(JsonUtility.ToJson(selectWork));
                                }
                            }
                            break;
                    }
                }

                GUILayout.Label("================ Hand ================");
                var cs = clientCtx.table.stacks[clientCtx.playerHandStack[playerId]].cards;
                foreach (var c in cs)
                {
                    var p = PokeAlg.GetPrototype(clientCtx.table.cards[c].prototype);
                    GUILayout.Label(p.shape.ToString() + p.number);
                }

                GUILayout.Label("================ Sea ================");
                cs = clientCtx.table.stacks[clientCtx.seaStack].cards;
                foreach (var c in cs)
                {
                    var p = PokeAlg.GetPrototype(clientCtx.table.cards[c].prototype);

                    if (canEat != null)
                    {
                        if (canEat.Contains(c))
                        {
                            if (GUILayout.Button(p.shape.ToString() + p.number))
                            {
                                selectCard2 = c;
                                var isValid = selectWork.Goals[selectWork.currGoal].text == GoalText.EAT_ONE_CARD || selectWork.Goals[selectWork.currGoal].text == GoalText.EAT_ONE_CARD_FINISHED;
                                if (isValid == false)
                                {
                                    throw new System.Exception("no valid status");
                                }
                                var g = selectWork.Goals[selectWork.currGoal];
                                selectWork.Values[g.refs[0]] = selectCard.ToString();
                                selectWork.Values[g.refs[1]] = selectCard2.ToString();
                                Debug.Log(JsonUtility.ToJson(selectWork));
                                CmdPushMission(JsonUtility.ToJson(selectWork));
                            }
                        }
                        else
                        {
                            GUILayout.Label(p.shape.ToString() + p.number);
                        }
                    }
                }
            }
            GUILayout.EndArea();
        }

        /*
        Dictionary<string, System.Action<string, string[]>> callbackPool = new Dictionary<string, System.Action<string, string[]>>();

        public void Ask(string question, string askId, System.Action<string, string[]> callback)
        {
            CmdAsk(guid, question, askId);
            callbackPool[askId] = callback;
        }

        public void Answer(string answer, string[] args, string askId)
        {
            if (callbackPool.ContainsKey(askId) == false)
            {
                return;
            }
            callbackPool[askId](answer, args);
            callbackPool.Remove(askId);
        }

        [Command]
        public void CmdAsk(string guid, string question, string askId)
        {
            switch (question)
            {
                case "QueryContext":
                    var json = JsonUtility.ToJson(serverCtx);
                    RpcAnswer(json, null, askId);
                    break;
            }
            
        }

        [ClientRpc]
        public void RpcAnswer(string question, string[] args, string askId)
        {
            Answer(question, args, askId);
        }
        */
    }
}
