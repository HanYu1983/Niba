using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System;
using System.Linq;

namespace RedAlert
{
    public class SingleController : MonoBehaviour, IRedAlertController
    {
        public PlayerHolder playerHolder;
        public RedAlertModel clientModel;
        public RedAlertModel serverModel;
        public RedAlertView view;

        private void Start()
        {
            // 建立測試資料
            serverModel.TestData();
            // 同步到Client
            SyncModel();
            // 促使UI菜單更新
            clientModel.OnBuildingChange();
            // 每秒同步一次資料
            StartCoroutine(SyncModelEverySecond());
            // 開始
            var state = GetComponent<NormalState>();
            ChangeState(state);
        }

        private void Update()
        {
            // 這裡模仿client-server架構
            // 所以兩個要一起更新
            // client用來預先計算
            // server是真正的model
            DataAlg.Step(clientModel.ctx, Time.deltaTime);
            DataAlg.Step(serverModel.ctx, Time.deltaTime);
            CheckNewEntity();
        }

        void CheckNewEntity()
        {
            var ps = DataAlg.GetBuildingProgress(serverModel.ctx, Player).ToList();
            foreach(var p in ps)
            {
                if(p.state != BuildingProgressState.Complete)
                {
                    continue;
                }
                var cfg = ConfigEntity.Get(p.entityPrototype);
                if (cfg.EntityType == ConfigEntityType.ID_building)
                {
                    continue;
                }
                var host = p.host;
                var prototype = p.entityPrototype;
                var hostBuilding = serverModel.ctx.buildings[host];
                var pos = hostBuilding.position;
                CmdCreateEntity(Player, host, prototype, pos);
            }
        }

        IEnumerator SyncModelEverySecond()
        {
            while (true)
            {
                yield return new WaitForSeconds(1);
                SyncModel();
            }
        }

        public void SyncModel()
        {
            RpcSync(DataAlg.Memonto(serverModel.ctx));
        }

        public void RpcSync(string ctxJson)
        {
            DataAlg.SetMemonto(clientModel.ctx, ctxJson);
        }

        public void RpcMessage(int player, string msg)
        {
            // alert
        }

        public void CmdCancelBuilding(int player, string key)
        {
            try
            {
                DataAlg.CancelBuildingProgress(serverModel.ctx, key);
                RpcSync(DataAlg.Memonto(serverModel.ctx));
            }
            catch (Exception e)
            {
                RpcMessage(player, e.Message);
            }
        }

        public void CmdBuilding(int player, int host, string entityPrototype)
        {
            try {
                DataAlg.Building(serverModel.ctx, player, host, entityPrototype);
                RpcSync(DataAlg.Memonto(serverModel.ctx));
            }
            catch (Exception e)
            {
                RpcMessage(player, e.Message);
            }
        }

        public void CmdCreateEntity(int player, int host, string prototype, Vector3 pos)
        {
            try {
                var progressKey = new BuildingProgress(player, host, prototype).Key;
                DataAlg.RemoveBuildingProgress(serverModel.ctx, progressKey);
                var key = DataAlg.CreateEntity(serverModel.ctx, player, prototype);
                var cfg = ConfigEntity.Get(prototype);
                switch (cfg.EntityType)
                {
                    case ConfigEntityType.ID_building:
                        {
                            serverModel.ctx.buildings[key].position = pos;
                        }
                        break;
                }
                SyncModel();

                RpcCreateEntity(key, prototype, pos);
                RpcNotifyUIUpdate();
            }
            catch (Exception e)
            {
                RpcMessage(player, e.Message);
            }
        }

        public void RpcCreateEntity(int key, string prototype, Vector3 pos)
        {
            View.SpawnEntity(key, prototype, pos);
        }

        public void RpcNotifyUIUpdate()
        {
            clientModel.OnBuildingChange();
        }

        #region basic control state implementaion
        IRedAlertControllerState state;

        public RedAlertModel Model { get { return clientModel; } }
        public RedAlertView View { get { return view; } }

        public void ChangeState(IRedAlertControllerState state)
        {
            if (this.state != null)
            {
                this.state.OnExit();
            }
            state.Holder = this;
            state.OnEnter();
            this.state = state;
            Debug.Log("change:" + this.state);
        }
        public int Player { get { return playerHolder.player; } }
        #endregion

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
    }
}