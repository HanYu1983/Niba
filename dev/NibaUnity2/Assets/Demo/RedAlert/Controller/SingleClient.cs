using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using GameFramework.GameStructure;

namespace RedAlert
{
    public class SingleClient : MonoBehaviour, IClient, IInjectRedAlertController
    {
        bool isLocalPlayer = true;
        List<SingleClient> clients = new List<SingleClient>();

        void Start()
        {
            clients.Add(this);

            Injector.Inject(this);
            var ctr = RedAlertController;
            ctr.Player = 0;
            ctr.Client = this;
        }

        // past to below
      
        public void RpcSync(string ctxJson)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            var ctr = RedAlertController;
            DataAlg.SetMemonto(ctr.Model.ctx, ctxJson);
        }

        public void RpcMessage(int player, string msg)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            // alert
        }

        public void RpcCreateEntity(int key, string prototype, Vector3 pos)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            Debug.Log("RpcCreateEntity:" + key + ":" + pos);
            RedAlertController.View.SpawnEntity(key, prototype, pos);
        }

        public void RpcNotifyUIUpdate()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.Model.OnBuildingChange();
        }

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
        public void ServerSyncEntity(int key, Vector3 pos, Vector3 rotation)
        {
            
        }
        public void ClientDirectMoveTo(List<GameObject> key, Vector3 pos)
        {
            
        }
        public void ServerCreateEntity(int player, int host, string prototype, Vector3 pos)
        {

        }
        #endregion
    }
}