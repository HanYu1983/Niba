using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IClient
    {
        void ClientBuilding(int player, int host, string prototype);
        void ClientCancelBuilding(int player, string progressKey);
        void ClientCreateEntity(int player, int host, string prototype, Vector3 pos);
        void ClientDirectMoveTo(List<GameObject> objs, Vector3 pos);
        void ServerSyncModel();
        void ServerNotifyUIUpdate();
        void ServerSyncEntity(int key, Vector3 pos, Vector3 rotation);
    }
}