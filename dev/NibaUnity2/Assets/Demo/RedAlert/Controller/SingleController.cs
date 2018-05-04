using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System;

namespace RedAlert
{
    public class SingleController : MonoBehaviour
    {
        public PlayerHolder playerHolder;
        public RedAlertModel clientModel;
        public RedAlertModel serverModel;

        private void Start()
        {
            serverModel.TestData();
            SyncModel();
            clientModel.OnBuildingChange();

            StartCoroutine(SyncModelEverySecond());
        }

        private void Update()
        {
            DataAlg.Step(clientModel.ctx, Time.deltaTime);
            DataAlg.Step(serverModel.ctx, Time.deltaTime);
        }

        IEnumerator SyncModelEverySecond()
        {
            while (true)
            {
                yield return new WaitForSeconds(1);
                SyncModel();
            }
        }

        public void Building(StrRef keyRef)
        {
            var player = playerHolder.player;
            var entityPrototype = keyRef.Ref;
            var p = DataAlg.GetBuildingProgress(clientModel.ctx, player, entityPrototype);
            if (p != null)
            {
                if (p.state == BuildingProgressState.Building)
                {
                    CmdCancelBuilding(player, entityPrototype);
                    return;
                }
                if(p.state == BuildingProgressState.Complete)
                {
                    return;
                }
            }
            // client simulation
            DataAlg.Building(clientModel.ctx, player, entityPrototype);
            CmdBuilding(player, entityPrototype);
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

        public void CmdBuilding(int player, string entityPrototype)
        {
            try {
                DataAlg.Building(serverModel.ctx, player, entityPrototype);
                RpcSync(DataAlg.Memonto(serverModel.ctx));
            }
            catch (Exception e)
            {
                RpcMessage(player, e.Message);
            }
        }
    }
}