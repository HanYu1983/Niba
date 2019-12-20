using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System;
using System.Linq;
using GameFramework.GameStructure;

namespace RedAlert
{
    // 這個類同時可以用在單機和多人
    // 請參照SimpleClient, MultiClient
    // 當中會設定RedAlertController的IClient
    public class RedAlertController : MonoBehaviour, IRedAlertController, IInjectServerModel
    {
        [Tooltip("玩家ID. 由IClient中取值. 單機版本永遠回傳0, 大部分UI所使用的player都是指向這個")]
        public PlayerHolder playerHolder;
        [Tooltip("客戶端Model. 任何UI所使用的Model都是這個. 每秒會同步到Server的Model")]
        public RedAlertModel clientModel;
        [Tooltip("伺服端的Model不必設定. 會由Injector注入. 請參照Injector")]
        public RedAlertModel serverModel;
        public RedAlertView view;
        [Tooltip("自動讀進地圖, 單機模式可打開")]
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

        private void Update()
        {
            Step();
        }

        // 測試用
        void OnGUI()
        {
            GUILayout.BeginArea(new Rect(200, 20, 200, 500));
            if (GUILayout.Button("StartGame"))
            {
                StartCoroutine(StartGame());
            }
            GUILayout.EndArea();
        }

        void OnCollide(GameObject go, Collision collision)
        {
            // 玩家為0的代表是伺服玩家
            // 非伺服玩家不必處理
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
            // 判斷子彈碰撞. 
            // 由於只有子彈物件有加入Rigidbody, 所以只有第一個可能是子彈
            var isSelfBullet = serverModel.ctx.bullets.ContainsKey(selfViewEntity.key);
            // 碰撞到的物件就可以是任何有加入Collider的物件
            var isTargetEntity = serverModel.ctx.entities.ContainsKey(targetViewEntity.key);
            if(isSelfBullet && isTargetEntity)
            {
                var bullet = serverModel.ctx.bullets[selfViewEntity.key];
                var targetEntity = serverModel.ctx.entities[targetViewEntity.key];
                if (bullet.player != targetEntity.player)
                {
                    // 移除子彈
                    Client.ServerRemoveEntity(bullet.Key);
                    // 建立爆炸特效
                    Client.ServerCreateViewEntity(-1, "ExplosionFx", collision.contacts.First().point, Vector3.zero);
                }
            }
        }
        
        // 點擊技術研究
        // 點擊購買在NormalState中
        public void OnClickTech(StrRef techPrototypeRef)
        {
            Client.ClientResearch(Player, techPrototypeRef.Ref);
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
            // 還沒連線前不必更新
            if(Client == null)
            {
                return;
            }
            StepState();
            // 這裡模仿client-server架構
            // 所以兩個要一起更新
            // client用來假計算, 讓前台看起來比較即時
            // server是真正的model
            DataAlg.Step(clientModel.ctx, Time.deltaTime);
            // 0代表host
            // 身為host才要計算serverModel
            if (Player == 0)
            {
                DataAlg.Step(serverModel.ctx, Time.deltaTime);
                // 自動生成建好的單位
                CheckNewEntity();
            }
        }
        // 刪除無效的子彈
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
        // 自動生成建好的單位
        void CheckNewEntity()
        {
            var ps = DataAlg.GetBuildingProgress(serverModel.ctx).ToList();
            // 這個部分處理一般單位
            foreach(var p in ps)
            {
                if(p.state != BuildingProgressState.Complete)
                {
                    continue;
                }
                if(p.host == ControllerHelper.TechHost)
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
            // 這個部分處理研究
            foreach (var p in ps)
            {
                if (p.state != BuildingProgressState.Complete)
                {
                    continue;
                }
                if (p.host != ControllerHelper.TechHost)
                {
                    continue;
                }
                var player = p.player;
                var prototype = p.entityPrototype;
                Client.ServerConfirmBuilding(player, ControllerHelper.TechHost, prototype, Vector3.zero);
            }
        }
        // 同步資料
        IEnumerator SyncModelEverySecond()
        {
            while (true)
            {
                yield return new WaitForSeconds(1);
                Client.ServerSyncModel();
            }
        }
        
        #region basic control state implement
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
        }
        public int Player { get { return playerHolder.player;  } set { playerHolder.player = value; } }
        #endregion

        #region implement for inject
        public IClient Client { get; set; }

        public RedAlertModel ServerModel { set; get; }
        #endregion
    }
}