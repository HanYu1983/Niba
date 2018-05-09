using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using GameFramework.GameStructure;
using System.Linq;

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
        public void RpcMessage(string msg)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.Alert(msg);
        }
        public void RpcCreateEntity(int key, string prototype, Vector3 pos)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
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
        public void RpcSyncEntity(int key, Vector3 pos, Vector3 rotation)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.SyncEntity(key, pos, rotation);
        }
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
                    c.RpcCreateEntity(key, prototype, pos);
                    c.RpcNotifyUIUpdate();
                }
            }
            catch (Exception e)
            {
                clients[player].RpcMessage(e.Message);
            }
        }
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
        public void ServerCreateEntity(int key, string prototype, Vector3 pos, Vector3 rot)
        {
            foreach (var c in clients)
            {
                c.RpcCreateEntity(key, prototype, pos);
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
                        ServerCreateEntity(key, w.prototype, pos, dir1);
                    }
                    break;
            }
        }
        public void RpcRemoveViewEntity(int key)
        {
            if (isLocalPlayer == false)
            {
                return;
            }
            RedAlertController.View.RemoveEntity(key);
        }
        public void ServerRemoveEntity(int key)
        {
            ServerModel.ctx.entities.Remove(key);
            foreach (var c in clients)
            {
                c.RpcRemoveViewEntity(key);
            }
        }
        #endregion
    }
}