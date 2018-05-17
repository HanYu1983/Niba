using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;
using UnityEngine.Networking;

namespace WordCard
{
    public class WordCard2MultiClient : NetworkBehaviour, IWordCard2Client, IInjectWordCard2ClientModel, IInjectWordCard2ServerModel, IInjectWordCard2View, IInjectWordCard2Controller
    {
        public override void OnStartLocalPlayer()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            CmdAddClient();
        }
        #region client manager
        public int playerId;
        public static List<WordCard2MultiClient> clients = new List<WordCard2MultiClient>();
        [Command]
        void CmdAddClient()
        {
            // 注意:伺服端和客戶端都要注入!!
            WordCard2Injector.Inject(this);

            playerId = clients.Count;
            clients.Add(this);
            RpcSetClient(playerId);
        }
        #endregion
        [ClientRpc]
        void RpcSetClient(int playerId)
        {
            // 注意:伺服端和客戶端都要注入!!
            WordCard2Injector.Inject(this);

            if (isLocalPlayer == false)
            {
                return;
            }
            this.playerId = playerId;
            Controller.Client = this;
        }

        public List<int> ai;

        public int Player { get { return playerId; } }

        // copy below

        public void ServerStartGame()
        {
            Poke.Alg.CreateContext(ServerModel.ctx, 4, 0);
            ServerSyncModel();
            foreach (var c in clients)
            {
                c.RpcStartGame();
            }
        }

        public void ServerSyncModel()
        {
            var json = JsonUtility.ToJson(ServerModel.ctx);
            foreach (var c in clients)
            {
                c.RpcSyncModel(json);
            }
        }

        public void ServerNotifyAction()
        {
            foreach (var c in clients)
            {
                c.RpcNotifyAction();
            }
        }

        public void ServerPlayerChange()
        {
            foreach (var c in clients)
            {
                c.RpcPlayerChange(ServerModel.ctx.currPlayer);
            }
        }

        public void ServerPushMission(CardCore.Mission mis)
        {
            CmdPushMission(JsonUtility.ToJson(mis), false);
        }

        public void ClientSendWord(string word, int cardKey, CardCore.Mission mis)
        {
            CmdSendWord(word, cardKey, JsonUtility.ToJson(mis));
        }

        public void ClientPushMission(CardCore.Mission mis)
        {
            CmdPushMission(JsonUtility.ToJson(mis), true);
        }
        [Command]
        void CmdSendWord(string word, int cardKey, string jsonMis)
        {
            var en = WordCard2Controller.GetWord(ServerModel.ctx.table.cards[cardKey].prototype);
            var ch = ConfigEn2Ch.Get(en).name;
            var isRight = word == ch;
            if (isRight)
            {
                CmdPushMission(jsonMis, false);
            }
            else
            {
                var mis = JsonUtility.FromJson<CardCore.Mission>(jsonMis);
                mis.currGoal = mis.Goals.Count;
                ServerPushMission(mis);
                // 
                int oldPlayer = ServerModel.ctx.currPlayer;
                ServerModel.ctx.currPlayer = (ServerModel.ctx.currPlayer + 1) % ServerModel.ctx.playerCnt;
                ServerModel.ctx.OnPlayerChange(oldPlayer, ServerModel.ctx.currPlayer);
            }
            ServerSyncModel();
            ServerNotifyAction();
        }

        [Command]
        void CmdPushMission(string json, bool autoSync)
        {
            var mis = JsonUtility.FromJson<CardCore.Mission>(json);
            CardCore.Alg.PushOrUpdateMission(ServerModel.ctx.missions, mis);
            try
            {
                while (true)
                {
                    var top = CardCore.Alg.GetWorkingMissions(ServerModel.ctx.missions);
                    if (top.Equals(CardCore.Mission.Empty))
                    {
                        break;
                    }
                    top = Poke.Alg.ProcessMission(ServerModel.ctx, top);
                    CardCore.Alg.UpdateMissionWithSameKey(ServerModel.ctx.missions, top);
                }
                if (autoSync)
                {
                    ServerSyncModel();
                    ServerNotifyAction();
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning(e.Message);
                RpcMessage(e.Message);
            }
        }
        [ClientRpc]
        void RpcMessage(string msg)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
        }
        [ClientRpc]
        void RpcPlayerChange(int player)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            if (Player != player)
            {
                return;
            }
        }
        [ClientRpc]
        void RpcSyncModel(string jsonCtx)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            var ctx = JsonUtility.FromJson<Poke.Context>(jsonCtx);
            ClientModel.ctx = ctx;
        }
        [ClientRpc]
        void RpcStartGame()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            View.Show(ClientModel.ctx);
            RpcNotifyAction();
        }
        [ClientRpc]
        void RpcNotifyAction()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            if (Player == 0)
            {
                var isAI = ai.Contains(ServerModel.ctx.currPlayer);
                if (isAI)
                {
                    Controller.State = new AIState(ServerModel.ctx.currPlayer);
                    return;
                }
            }
            Controller.State = new SelectMissionState();
        }

        public WordCard2Model ServerModel { get; set; }
        public WordCard2Model ClientModel { get; set; }
        public WordCard2View View { get; set; }
        public IWordCard2Controller Controller { get; set; }
    }
}