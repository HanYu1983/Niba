using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IClient
    {
        //List<IClient> Clients { get; }
        /*
        void RpcSync(string ctxJson);
        void RpcMessage(int player, string msg);
        void RpcCreateEntity(int key, string prototype, Vector3 pos);
        void RpcNotifyUIUpdate();
        */
        /*
        void CmdCancelBuilding(int player, string key);
        void CmdBuilding(int player, int host, string entityPrototype);
        void CmdCreateEntity(int player, int host, string prototype, Vector3 pos);
        */
        void ClientBuilding(int player, int host, string prototype);
        void ClientCancelBuilding(int player, string progressKey);
        void ClientCreateEntity(int player, int host, string prototype, Vector3 pos);
        void ServerSyncModel();
        void ServerNotifyUIUpdate();
    }
}