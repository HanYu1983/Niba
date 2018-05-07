using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System;
using System.Linq;
using GameFramework.GameStructure;

namespace RedAlert
{
    public class SingleController : MonoBehaviour, IRedAlertController
    {
        public PlayerHolder playerHolder;
        public RedAlertModel clientModel;
        public RedAlertModel serverModel;
        public RedAlertView view;
        public bool isAutoStart;

        void Awake()
        {
            serverModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
        }

        void Start()
        {
            if (isAutoStart)
            {
                StartGame();
            }
        }

        void OnGUI()
        {
            GUILayout.BeginArea(new Rect(200, 20, 200, 500));
            if (GUILayout.Button("StartGame"))
            {
                StartGame();
            }
            GUILayout.EndArea();
        }

        private void Update()
        {
            Step();
        }

        [ContextMenu("StartGame")]
        void StartGame()
        {
            if(Player == 0)
            {
                // 建立測試資料
                serverModel.TestData();
                // 同步到Client
                Client.ServerSyncModel();
                // 促使UI菜單更新
                Client.ServerNotifyUIUpdate();
                // 每秒同步一次資料
                StartCoroutine(SyncModelEverySecond());
            }
            // 開始
            var state = new NormalState();
            ChangeState(state);
        }

        void Step()
        {
            if(Client == null)
            {
                return;
            }
            StepState();
            // 這裡模仿client-server架構
            // 所以兩個要一起更新
            // client用來預先計算
            // server是真正的model
            DataAlg.Step(clientModel.ctx, Time.deltaTime);

            // 0代表host
            // 身為host才要計算serverModel
            if (Player == 0)
            {
                DataAlg.Step(serverModel.ctx, Time.deltaTime);
                CheckNewEntity();
            }
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
                var hostBuilding = serverModel.ctx.entities[host];
                var pos = hostBuilding.position;
                Client.ClientCreateEntity(Player, host, prototype, pos);
            }
        }

        IEnumerator SyncModelEverySecond()
        {
            while (true)
            {
                yield return new WaitForSeconds(1);
                Client.ServerSyncModel();
            }
        }
        /*
        public void ClientBuilding(int player, int host, string prototype)
        {
            Client.ClientBuilding(player, host, prototype);
        }
        public void ClientCancelBuilding(int player, string progressKey)
        {
            Client.ClientCancelBuilding(player, progressKey);
        }
        public void ClientCreateEntity(int player, int host, string prototype, Vector3 pos)
        {
            Client.ClientCreateEntity(player, host, prototype, pos);
        }
        */
        #region basic control state implementaion
        public void StepState()
        {
            if (state != null)
            {
                state.OnUpdate(Time.deltaTime);
            }
        }

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
        public int Player { get { return playerHolder.player;  } set { playerHolder.player = value; } }
        #endregion

        public IClient Client { get; set; }
    }
}