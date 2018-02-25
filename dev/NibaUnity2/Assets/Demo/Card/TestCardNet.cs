using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using HanCardAPI.Poke;
using PokeAlg = HanCardAPI.Poke.Alg;

namespace CardGame
{
    public class TestCardNet : NetworkBehaviour
    {
        [SyncVar]
        public string guid;

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
            guid = System.Guid.NewGuid().ToString();

            var id = GetComponent<NetworkIdentity>();
            Debug.Log("OnStartLocalPlayer:" + id.playerControllerId + ":isLocalPlayer=" + isLocalPlayer);

            if (isLocalPlayer == false)
            {
                return;
            }

            CmdAddClient(guid);
        }




        private void OnGUI()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            GUILayout.BeginArea(new Rect(200, 20, 500, 500));
            GUILayout.Label("guid:" + guid);
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
                GUILayout.Label("isActivePlayer:"+isActivePlayer);

                if (GUILayout.Button("get work"))
                {
                    workingWork = PokeAlg.GetWorkingMissions(clientCtx, playerId);
                    if (workingWork == null)
                    {
                        works = PokeAlg.NewMissions(clientCtx, playerId);
                    }
                }
                if (works != null)
                {
                    for (var i = 0; i < works.Count; ++i)
                    {
                        var w = works[i];
                        GUILayout.Button("work "+i);
                        for(var j=0; j<w.goals.Count; ++j)
                        {
                            var t = (j==w.currGoal) ? "[*]":"[ ]";
                            t += w.goals[j].text;
                            GUILayout.Label(t);
                        }
                    }
                }

                GUILayout.Label("================ Hand ================");
                var cs = clientCtx.table.stacks[clientCtx.playerHandStack[playerId]].cards;
                foreach (var c in cs)
                {
                    var p = PokeAlg.GetPrototype(clientCtx.table.cards[c].prototype);
                    if(GUILayout.Button(p.shape.ToString() + p.number))
                    {
                        var canEat = PokeAlg.MatchCard(clientCtx, c);
                        this.canEat = canEat;
                        selectCard = c;
                    }
                }

                GUILayout.Label("================ Sea ================");
                cs = clientCtx.table.stacks[clientCtx.seaStack].cards;
                foreach (var c in cs)
                {
                    var p = PokeAlg.GetPrototype(clientCtx.table.cards[c].prototype);
                    
                    if(canEat != null)
                    {
                        if (canEat.Contains(c))
                        {
                            if (GUILayout.Button(p.shape.ToString() + p.number))
                            {

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

        public List<int> canEat;
        public int selectCard;
        public Mission workingWork;
        public List<Mission> works= new List<Mission>();

        public static List<TestCardNet> clients = new List<TestCardNet>();
        [Command]
        void CmdAddClient(string guid)
        {
            this.playerId = clients.Count;
            this.guid = guid;
            clients.Add(this);
        }

        [SyncVar]
        public int playerId;

        static Context serverCtx;
        static Context clientCtx;
        
        
        void CreateCardTable()
        {
            var playerCnt = clients.Count;
            serverCtx = PokeAlg.CreateContext(playerCnt, 0);
            // create view and spawn in client   

            // 傳給所有對應的client
            foreach(var c in clients)
            {
                c.RpcGameStart();
            }
        }

        [ClientRpc]
        public void RpcGameStart()
        {
            Debug.Log("RpcGameStart:"+this.guid);
            if (isLocalPlayer == false)
            {
                return;
            }
            Ask("QueryContext", System.Guid.NewGuid().ToString(), (answer, args2) =>
            {
                var ctx = JsonUtility.FromJson<Context>(answer);
                clientCtx = ctx;
            });
        }

        [Command]
        void CmdPushMission(string playerId, string missionJson)
        {
            var mis = JsonUtility.FromJson<Mission>(missionJson);
            PokeAlg.PushMission(serverCtx, mis);
        }

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
    }
}
