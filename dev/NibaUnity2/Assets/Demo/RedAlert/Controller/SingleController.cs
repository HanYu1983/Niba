using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System;
using System.Linq;
using GameFramework.GameStructure;

namespace RedAlert
{
    public class SingleController : MonoBehaviour, IRedAlertController, IInjectServerModel
    {
        public PlayerHolder playerHolder;
        public RedAlertModel clientModel;
        public RedAlertModel serverModel;
        public RedAlertView view;
        public bool isAutoStart;

        void Start()
        {
            Injector.Inject(this);
            Injector.OnCollide += OnCollide;
            serverModel = ServerModel;

            if (isAutoStart)
            {
                StartGame();
            }
            // 開始
            var state = new NormalState();
            ChangeState(state);
        }

        void OnCollide(GameObject go, Collision collision)
        {
            if (Player != 0)
            {
                return;
            }
            var target = collision.gameObject;
            var targetViewEntity = target.GetComponent<RedAlertEntity>();
            if (targetViewEntity == null)
            {
                return;
            }
            var selfViewEntity = go.GetComponent<RedAlertEntity>();
            if (selfViewEntity == null)
            {
                return;
            }
            var isSelfBullet = serverModel.ctx.bullets.ContainsKey(selfViewEntity.key);
            var isTargetEntity = serverModel.ctx.entities.ContainsKey(targetViewEntity.key);
            if(isSelfBullet && isTargetEntity)
            {
                var bullet = serverModel.ctx.bullets[selfViewEntity.key];
                var targetEntity = serverModel.ctx.entities[targetViewEntity.key];
                if (bullet.player != targetEntity.player)
                {
                    Client.ServerRemoveEntity(bullet.Key);
                    Client.ServerCreateViewEntity(-1, "ExplosionFx", collision.contacts.First().point, Vector3.zero);
                }
            }
        }

        void OnGUI()
        {
            GUILayout.BeginArea(new Rect(200, 20, 200, 500));
            if (GUILayout.Button("StartGame"))
            {
                StartCoroutine(StartGame());
            }
            GUILayout.EndArea();
        }

        private void Update()
        {
            Step();
        }
        

        IEnumerator StartGame()
        {
            if(Player == 0)
            {
                // 建立測試資料
                serverModel.TestData();
                // 建立地圖, 地圖上的預設物件也會修改到serverModel
                Client.ServerCreateViewMap();
                yield return 0;
                // 同步到Client
                Client.ServerSyncModel();
                // 促使UI菜單更新
                Client.ServerNotifyUIUpdate();
                // 每秒同步一次資料
                StartCoroutine(SyncModelEverySecond());
                StartCoroutine(CheckBulletDeleteEverySecond());
            }
            yield return 0;
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

        IEnumerator CheckBulletDeleteEverySecond()
        {
            while (true)
            {
                foreach(var b in new List<Bullet>(serverModel.ctx.bullets.Values))
                {
                    if(b.position.y < -1)
                    {
                        Client.ServerRemoveEntity(b.Key);
                    }
                }
                yield return new WaitForSeconds(1);
            }
        }

        void CheckNewEntity()
        {
            var ps = DataAlg.GetBuildingProgress(serverModel.ctx).ToList();
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
                var player = p.player;
                var host = p.host;
                var prototype = p.entityPrototype;
                var hostBuilding = serverModel.ctx.entities[host];
                var pos = hostBuilding.position;
                Client.ServerConfirmBuilding(player, host, prototype, pos);
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

        public RedAlertModel ServerModel { set; get; }

    }
}