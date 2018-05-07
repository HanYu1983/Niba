using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using GameFramework.GameStructure;
using System;

namespace RedAlert
{
    public class MultiClient : NetworkBehaviour, IClient, IInjectRedAlertController
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
        public static List<MultiClient> clients = new List<MultiClient>();
        [Command]
        void CmdAddClient()
        {
            var team = clients.Count;
            playerId = clients.Count;
            clients.Add(this);
            RpcSetClient(playerId);
        }
        [ClientRpc]
        void RpcSetClient(int playerId)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            this.playerId = playerId;

            Injector.Inject(this);
            Debug.Log(RedAlertController);

            var ctr = RedAlertController;
            ctr.Player = playerId;
            ctr.Client = this;
        }
        #endregion

        // copy below
        [ClientRpc]
        public void RpcSync(string ctxJson)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            var ctr = RedAlertController;
            DataAlg.SetMemonto(ctr.Model.ctx, ctxJson);
        }
        [ClientRpc]
        public void RpcMessage(int player, string msg)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            // alert
        }
        [ClientRpc]
        public void RpcCreateEntity(int key, string prototype, Vector3 pos)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            Debug.Log("RpcCreateEntity:"+key+":"+pos);
            RedAlertController.View.SpawnEntity(key, prototype, pos);
        }
        [ClientRpc]
        public void RpcNotifyUIUpdate()
        {
            if(isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.Model.OnBuildingChange();
        }
        [Command]
        public void CmdCancelBuilding(int player, string key)
        {
            try
            {
                var serverModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
                DataAlg.CancelBuildingProgress(serverModel.ctx, key);
                SyncModel();
            }
            catch (Exception e)
            {
                clients[player].RpcMessage(player, e.Message);
            }
        }
        [Command]
        public void CmdBuilding(int player, int host, string entityPrototype)
        {
            try
            {
                var serverModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
                DataAlg.Building(serverModel.ctx, player, host, entityPrototype);
                SyncModel();
            }
            catch (Exception e)
            {
                clients[player].RpcMessage(player, e.Message);
            }
        }
        [Command]
        public void CmdCreateEntity(int player, int host, string prototype, Vector3 pos)
        {
            try
            {
                var serverModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
                var progressKey = new BuildingProgress(player, host, prototype).Key;
                DataAlg.RemoveBuildingProgress(serverModel.ctx, progressKey);
                var key = DataAlg.CreateEntity(serverModel.ctx, player, prototype);
                var cfg = ConfigEntity.Get(prototype);
                switch (cfg.EntityType)
                {
                    case ConfigEntityType.ID_building:
                        {
                            serverModel.ctx.entities[key].position = pos;
                        }
                        break;
                }
                SyncModel();

                foreach (var c in clients)
                {
                    c.RpcCreateEntity(key, prototype, pos);
                    c.RpcNotifyUIUpdate();
                }
            }
            catch (Exception e)
            {
                clients[player].RpcMessage(player, e.Message);
            }
        }
        public void SyncModel()
        {
            var serverModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
            foreach (var c in clients)
            {
                c.RpcSync(DataAlg.Memonto(serverModel.ctx));
            }
        }

        #region implement stuff
        public IRedAlertController RedAlertController { set; get; }



        public void ClientBuilding(int player, int host, string prototype)
        {
            CmdBuilding(player, host, prototype);
        }
        public void ClientCancelBuilding(int player, string progressKey)
        {
            CmdCancelBuilding(player, progressKey);
        }
        public void ClientCreateEntity(int player, int host, string prototype, Vector3 pos)
        {
            CmdCreateEntity(player, host, prototype, pos);
        }
        public void ServerSyncModel()
        {
            SyncModel();
        }
        public void ServerNotifyUIUpdate()
        {
            foreach (var c in clients)
            {
                c.RpcNotifyUIUpdate();
            }
        }
        #endregion
    }
}
