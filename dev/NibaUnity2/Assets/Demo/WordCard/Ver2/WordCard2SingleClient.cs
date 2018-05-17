﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using CardCore = HanCardAPI.Core;
using Poke = HanCardAPI.Poke;
using System;

namespace WordCard
{
    public class WordCard2SingleClient : MonoBehaviour, IWordCard2Client, IInjectWordCard2ClientModel, IInjectWordCard2ServerModel, IInjectWordCard2View, IInjectWordCard2Controller
    {
        void Start()
        {
            WordCard2Injector.Inject(this);
            clients.Add(this);
            Controller.Client = this;
        }

        public List<int> ai;
        List<WordCard2SingleClient> clients = new List<WordCard2SingleClient>();
        bool isLocalPlayer = true;
        

        public int Player { get { return 0; } }

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

        public void ClientPushMission(CardCore.Mission mis)
        {
            Debug.Log("ClientPushMission");
            CmdPushMission(JsonUtility.ToJson(mis), true);
        }

        public void ServerPushMission(CardCore.Mission mis)
        {
            Debug.Log("ServerPushMission");
            CmdPushMission(JsonUtility.ToJson(mis), false);
        }

        void CmdPushMission(string json, bool autoSync)
        {
            Debug.Log("CmdPushMission:"+json);

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
                    // notify OnPlayerChange herer!!
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

        void RpcMessage(string msg)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
        }

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

        void RpcSyncModel(string jsonCtx)
        {
            Debug.Log(jsonCtx);
            if (isLocalPlayer == false)
            {
                return;
            }
            var ctx = JsonUtility.FromJson<Poke.Context>(jsonCtx);
            ClientModel.ctx = ctx;
        }

        void RpcStartGame()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            View.Show(ClientModel.ctx);
            RpcNotifyAction();
        }

        void RpcNotifyAction()
        {
            Debug.Log("RpcNotifyAction");
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