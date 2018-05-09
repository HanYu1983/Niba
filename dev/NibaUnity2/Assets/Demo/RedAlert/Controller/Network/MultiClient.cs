using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Linq;
namespace RedAlert
{
    public class MultiClient : NetworkBehaviour, IClient, IInjectRedAlertController, IInjectServerModel
    {
        public override void OnStartLocalPlayer()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            CmdAddClient();
        }

        void Start()
        {
            Injector.Inject(this);
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
        public void RpcMessage(string msg)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.Alert(msg);
        }
        [ClientRpc]
        public void RpcCreateViewEntity(int key, string prototype, Vector3 pos)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.SpawnEntity(key, prototype, pos);
        }
        [ClientRpc]
        public void RpcNotifyUIUpdate()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.Model.OnBuildingChange();
        }
        [ClientRpc]
        public void RpcSyncEntity(int key, Vector3 pos, Vector3 rotation)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.SyncEntity(key, pos, rotation);
        }
        [ClientRpc]
        public void RpcDirectMoveTo(int[] keys, Vector3 pos)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            var units = keys
                .Where(k => RedAlertController.View.entities.ContainsKey(k))
                .Select(k => RedAlertController.View.entities[k].gameObject);
            Injector.OnDirectMoveTo(units.ToList(), pos);
        }
        [ClientRpc]
        public void RpcRemoveViewEntity(int key)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.RemoveEntity(key);
        }
        [ClientRpc]
        public void RpcCreateViewMap()
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.CreateMap();
        }
        [Command]
        public void CmdCancelBuilding(int player, string key)
        {
            try
            {
                DataAlg.CancelBuildingProgress(ServerModel.ctx, key);
                SyncModel();
            }
            catch (Exception e)
            {
                clients[player].RpcMessage(e.Message);
            }
        }
        [Command]
        public void CmdBuilding(int player, int host, string entityPrototype)
        {
            try
            {
                DataAlg.Building(ServerModel.ctx, player, host, entityPrototype);
                SyncModel();
            }
            catch (Exception e)
            {
                Debug.Log(e.Message);
                clients[player].RpcMessage(e.Message);
            }
        }
        [Command]
        public void CmdConfirmBuilding(int player, int host, string prototype, Vector3 pos)
        {
            try
            {
                var serverModel = ServerModel;
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
                    c.RpcCreateViewEntity(key, prototype, pos);
                    c.RpcNotifyUIUpdate();
                }
            }
            catch (Exception e)
            {
                clients[player].RpcMessage(e.Message);
            }
        }
        [Command]
        public void CmdDirectMoveTo(int[] keys, Vector3 pos)
        {
            foreach (var c in clients)
            {
                c.RpcDirectMoveTo(keys, pos);
            }
        }
        public void SyncModel()
        {
            foreach (var c in clients)
            {
                c.RpcSync(DataAlg.Memonto(ServerModel.ctx));
            }
        }

        #region implement stuff
        public IRedAlertController RedAlertController { set; get; }
        public RedAlertModel ServerModel { set; get; }


        public void ClientBuilding(int player, int host, string prototype)
        {
            CmdBuilding(player, host, prototype);
        }
        public void ClientCancelBuilding(int player, string progressKey)
        {
            CmdCancelBuilding(player, progressKey);
        }
        public void ClientConfirmBuilding(int player, int host, string prototype, Vector3 pos)
        {
            CmdConfirmBuilding(player, host, prototype, pos);
        }
        public void ClientDirectMoveTo(List<GameObject> objs, Vector3 pos)
        {
            var keys = objs.Select(o => o.GetComponent<RedAlertEntity>().key).ToArray();
            CmdDirectMoveTo(keys, pos);
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
            foreach (var c in clients)
            {
                c.RpcSyncEntity(key, pos, rotation);
            }
        }
        public void ServerConfirmBuilding(int player, int host, string prototype, Vector3 pos)
        {
            CmdConfirmBuilding(player, host, prototype, pos);
        }
        public void ServerCreateViewMap()
        {
            foreach(var c in clients)
            {
                c.RpcCreateViewMap();
            }
        }
        public void ServerCreateViewEntity(int key, string prototype, Vector3 pos, Vector3 rot)
        {
            foreach (var c in clients)
            {
                c.RpcCreateViewEntity(key, prototype, pos);
            }
        }
        public void ServerCreateBullet(int weapon, Vector3 pos, Vector3 dest)
        {
            var w = ServerModel.ctx.weapons[weapon];
            var cfg = ConfigWeapon.Get(w.prototype);
            switch (cfg.BulletType)
            {
                default:
                    {
                        var speed = 0.0f;
                        ProjectileHelper.ComputeSpeedToReachTargetWithElevation(pos, dest, Mathf.PI / 4, -9.81f, ref speed);
                        Vector3 dir1, dir2;
                        if (ProjectileHelper.ComputeDirectionToHitTargetWithSpeed(pos, dest, -9.81f, speed, out dir1, out dir2))
                        {

                        }
                        var key = DataAlg.CreateBullet(ServerModel.ctx, w.Key, pos, dir1 * speed);
                        foreach (var c in clients)
                        {
                            c.RpcCreateViewEntity(key, w.prototype, pos);
                        }
                    }
                    break;
            }
        }
        public void ServerRemoveEntity(int key)
        {
            ServerModel.ctx.entities.Remove(key);
            foreach(var c in clients)
            {
                c.RpcRemoveViewEntity(key);
            }
        }
        #endregion
    }
}
