using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IClient
    {
        void ClientBuilding(int player, int host, string prototype);
        void ClientCancelBuilding(int player, string progressKey);
        void ClientConfirmBuilding(int player, int host, string prototype, Vector3 pos);
        void ClientDirectMoveTo(List<GameObject> objs, Vector3 pos);
        void ClientResearch(int player, string techPrototype);
        void ServerSyncModel();
        void ServerNotifyUIUpdate();
        void ServerSyncEntity(int key, Vector3 pos, Vector3 rotation);
        void ServerConfirmBuilding(int player, int host, string prototype, Vector3 pos);
        void ServerCreateViewEntity(int key, string prototype, Vector3 pos, Vector3 rot);
        void ServerCreateBullet(int weapon, Vector3 pos, Vector3 dest);
        void ServerRemoveEntity(int key);
        void ServerCreateViewMap();
    }
}