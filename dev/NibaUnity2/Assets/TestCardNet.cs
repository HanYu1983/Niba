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
        }




        private void OnGUI()
        {
            if (isLocalPlayer == false)
            {
                return;
            }

            GUILayout.BeginArea(new Rect(100, 100, 500, 500));
            if (isServer)
            {
                if (GUILayout.Button("create card table"))
                {
                    CreateCardTable();
                }
            }
            if (GUILayout.Button("up"))
            {
                
            }
            GUILayout.EndArea();
        }

        public Context ctx;
        
        void CreateCardTable()
        {
            ctx = PokeAlg.CreateContext(4, 0);
            // create view and spawn in client

            RpcGameStart();
        }

        [ClientRpc]
        void RpcGameStart()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            Ask("getWorkingMission", "xxx", (answer, args) =>
            {
                // show mission

                Ask("newMission", "XXX", (a, ar) =>
                {
                    // show mission
                });
            });
        }

        [Command]
        void CmdPushMission(string playerId, string missionJson)
        {
            var mis = JsonUtility.FromJson<Mission>(missionJson);
            PokeAlg.PushMission(ctx, mis);
        }

        public void Ask(string question, string askId, System.Action<string, string[]> callback)
        {
            CmdAsk("user", question, askId);
        }

        public void Answer(string question, string[] args, string askId)
        {
            // call callback and remove
        }

        [Command]
        public void CmdAsk(string user, string question, string askId)
        {
            RpcAnswer("", null, askId);
        }

        [ClientRpc]
        public void RpcAnswer(string question, string[] args, string askId)
        {
            Answer(question, args, askId);
        }
    }
}
