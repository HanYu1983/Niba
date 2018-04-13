using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using GameFramework.GameStructure;
using System.Linq;
using GameFramework.UI.Dialogs.Components;

namespace RobotWar
{
    public class RobotWarClient : NetworkBehaviour
    {
        public override void OnStartLocalPlayer()
        {
            Debug.Log("OnStartLocalPlayer");
            if (isLocalPlayer == false)
            {
                return;
            }
            CmdAddClient();
        }

        public void ServerAlert(string title, string msg)
        {
            foreach (var c in clients)
            {
                c.RpcAlert(title, msg);
            }
        }

        #region client manager
        public int playerId;
        public static List<RobotWarClient> clients = new List<RobotWarClient>();
        [Command]
        void CmdAddClient()
        {
            var team = clients.Count;
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var player = DataAlg.CreatePlayer(model.mapCtx, team, false);
            playerId = player.Key;
            clients.Add(this);
            RpcSetClient(playerId);
        }
        #endregion
        [ClientRpc]
        void RpcSetClient(int playerId)
        {
            Debug.Log("RpcSetClient");
            this.playerId = playerId;
            var ctr = FindObjectOfType<MultiController>();
            if (ctr != null)
            {
                ctr.client = this;
            }
        }
        [Command]
        public void CmdPassUnit(int playerId, string unit)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            DataAlg.PassUnit(model.mapCtx, unit);
            model.RequestSaveMap();
        }
        [Command]
        public void CmdMoveUnit(int playerId, string unit, string pos)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var s = model.mapCtx.grids[model.mapCtx.unit2Grid[unit]].pos;
            var e = model.mapCtx.grids[pos].pos;
            var path = DataAlg.FindPath(model.mapCtx, s, e).Select(g => g.Key).ToArray();
            DataAlg.MoveUnit(model.mapCtx, e, unit);
            model.RequestSaveMap();
            foreach (var c in clients)
            {
                c.RpcAnimateUnitMove(unit, path);
            }
        }
        [Command]
        public void CmdCancelMoveUnit(int playerId, string unit)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var pos = DataAlg.CancelMoveUnit(model.mapCtx, unit);
            model.RequestSaveMap();

            foreach (var c in clients)
            {
                c.RpcSetUnitPos(unit, pos);
            }
        }
        [Command]
        public void CmdPushTask(int playerId, string taskJson, bool isAttack)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var task = JsonUtility.FromJson<Task>(taskJson);
            DataAlg.PushTask(model.mapCtx, task, isAttack);
            model.RequestSaveMap();
        }
        [Command]
        public void CmdSetUnitDirection(int playerId, string unit, Direction dir)
        {
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            model.mapCtx.units[unit].dir = dir;
            model.RequestSaveMap();
            foreach (var c in clients)
            {
                c.RpcAnimateUnitDirection(unit, dir);
            }
        }
        [ClientRpc]
        public void RpcAlert(string title, string msg)
        {
            ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, title, msg, null);
        }
        [ClientRpc]
        void RpcAnimateUnitDirection(string unit, Direction dir)
        {

        }
        [ClientRpc]
        void RpcAnimateUnitMove(string unit, string[] path)
        {
            var view = FindObjectOfType<View>();
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            var grids = path.Select(k => model.mapCtx.grids[k]).ToList();
            view.StartCoroutine(view.AnimateUnitMove(unit, grids));
        }
        [ClientRpc]
        void RpcSetUnitPos(string unit, string pos)
        {
            var view = FindObjectOfType<View>();
            var model = GameManager.Instance.gameObject.GetComponent<Model>();
            view.SetUnitPos(unit, model.mapCtx.grids[pos]);
        }
    }
}