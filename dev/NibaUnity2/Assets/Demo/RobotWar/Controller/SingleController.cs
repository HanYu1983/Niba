using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;
using GameFramework.UI.Dialogs.Components;
using System.Linq;

namespace RobotWar
{
    public class SingleController : DefaultController
    {
        public View view;
        public Model model;

        void Start()
        {
            // GameFramework的Pause按鈕一按下去後Time.timeScale會設為0, 之後就變不回為1
            // 還沒去研究GameFramework的正確使用方式, 先在這裡用偷懒解法
            Time.timeScale = 1;

            model = GameManager.Instance.gameObject.GetComponent<Model>();
            view.Sync(model);
        }

        void Update()
        {
            Step(Time.deltaTime);
        }

        public void StartPlay()
        {
            ChangeState(new SystemState());
        }
        public override void ServerAlart(string title, string msg)
        {
            RpcAlert(title, msg);
        }
        public override void ServerNotifySelectUnitAction(int playerId, string unit)
        {
            var u = model.mapCtx.units[unit];
            ChangeState(new SelectUnitActionState(u));
        }
        public override void ClientMoveUnit(int playerId, string unit, Vector2Int pos)
        {
            CmdMoveUnit(playerId, unit, pos);
        }
        public override void ClientCancelMoveUnit(int playerId, string unit)
        {
            CmdCancelMoveUnit(playerId, unit);
        }
        public override void ClientPushTask(int playerId, Task task, bool isAttack)
        {
            CmdPushTask(playerId, JsonUtility.ToJson(task), isAttack);
        }
        public override void ClientSetUnitDirection(int playerId, string unit, Direction dir)
        {
            CmdSetUnitDirection(playerId, unit, dir);
        }
        public override void ClientPassUnit(int playerId, string unit)
        {
            CmdPassUnit(playerId, unit);
        }
        public override void ClientNotifyServerState(string state)
        {
            // ignore
        }

        void CmdPassUnit(int playerId, string unit)
        {
            DataAlg.PassUnit(model.mapCtx, unit);
            model.RequestSaveMap();
        }

        void CmdMoveUnit(int playerId, string unit, Vector2Int pos)
        {
            var s = model.mapCtx.grids[model.mapCtx.unit2Grid[unit]].pos;
            var e = pos;
            var path = DataAlg.FindPath(model.mapCtx, s, e).Select(g=>g.Key).ToArray();
            DataAlg.MoveUnit(model.mapCtx, pos, unit);
            model.RequestSaveMap();

            RpcAnimateUnitMove(unit, path);
        }

        void CmdCancelMoveUnit(int playerId, string unit)
        {
            var pos = DataAlg.CancelMoveUnit(Model.mapCtx, unit);
            model.RequestSaveMap();

            RpcSetUnitPos(unit, pos);
        }

        void CmdPushTask(int playerId, string taskJson, bool isAttack)
        {
            var task = JsonUtility.FromJson<Task>(taskJson);
            DataAlg.PushTask(Model.mapCtx, task, isAttack);
            model.RequestSaveMap();
        }

        void CmdSetUnitDirection(int playerId, string unit, Direction dir)
        {
            model.mapCtx.units[unit].dir = dir;
            model.RequestSaveMap();
            RpcAnimateUnitDirection(unit, dir);
        }

        void RpcAlert(string title, string msg)
        {
            ModelController.Alarm(DialogInstance.DialogButtonsType.Ok, title, msg, null);
        }

        void RpcAnimateUnitDirection(string unit, Direction dir)
        {

        }

        void RpcAnimateUnitMove(string unit, string[] path)
        {
            var grids = path.Select(k => model.mapCtx.grids[k]).ToList();
            View.StartCoroutine(View.AnimateUnitMove(unit, grids));
        }

        void RpcSetUnitPos(string unit, string pos)
        {
            View.SetUnitPos(unit, Model.mapCtx.grids[pos]);
        }

        #region IController impl
        public override Model Model { get { return model; } }
        public override View View { get { return view; } }
        public override int Player
        {
            get { return 0; }
        }
        #endregion

        #region test
        IEnumerator CreateMap(string path)
        {
            /*
            var request = Resources.LoadAsync<MapData>(path);
            yield return request;
            var data = request.asset as MapData;
            model.CreateMap(data);
            view.Sync(model);
            */
            DataAlg.GenMap(model.mapCtx, 20, 20);
            view.Sync(model);
            yield return null;
        }

        void CreateUnit(int owner, Vector2Int pos)
        {
            var unit = DataAlg.CreateUnit(model.mapCtx, ConfigUnit.ID_test01);
            var w = DataAlg.CreateWeapon(model.mapCtx, ConfigWeapon.ID_handGun);
            DataAlg.AssignWeapon(model.mapCtx, w.Key, unit.Key);
            DataAlg.PutUnit(model.mapCtx, pos, owner, unit.Key);

            w = DataAlg.CreateWeapon(model.mapCtx, ConfigWeapon.ID_lightSword);
            DataAlg.AssignWeapon(model.mapCtx, w.Key, unit.Key);

            w = DataAlg.CreateWeapon(model.mapCtx, ConfigWeapon.ID_bomb);
            DataAlg.AssignWeapon(model.mapCtx, w.Key, unit.Key);

            w = DataAlg.CreateWeapon(model.mapCtx, ConfigWeapon.ID_bigGun);
            DataAlg.AssignWeapon(model.mapCtx, w.Key, unit.Key);

            var p = DataAlg.CreatePilot(model.mapCtx, ConfigPilot.ID_solider1);
            DataAlg.AssignPilot(model.mapCtx, p.Key, unit.Key);

            view.CreateUnit(model, unit.Key, pos);
        }

        [ContextMenu("TestLoadMap")]
        public void TestLoadMap()
        {
            StartCoroutine(CreateMap("Map/map01"));
        }
        [ContextMenu("TestPlay")]
        public void TestPlay()
        {
            StartPlay();
        }
        [ContextMenu("TestCreateUnit")]
        public void TestCreateUnit()
        {
            var p = DataAlg.CreatePlayer(model.mapCtx, 0, false);
            for (var i = 0; i < 5; ++i)
            {
                CreateUnit(p.Key, new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            }
        }

        [ContextMenu("TestCreateEnemy")]
        public void TestCreateEnemy()
        {
            var p = DataAlg.CreatePlayer(model.mapCtx, 1, false);
            for (var i = 0; i < 5; ++i)
            {
                CreateUnit(p.Key, new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            }
        }

        [ContextMenu("TestCanMove")]
        public void TestCanMove()
        {
            view.SetGridColor(null, Color.white);

            var paths = DataAlg.FindAllPath(model.mapCtx, Random.Range(3, 10), new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            view.SetGridColor(paths.Keys, Color.green);

            var dis = new Grid[paths.Keys.Count];
            paths.Keys.CopyTo(dis, 0);
            var path = paths[dis[Random.Range(1, dis.Length)]];
            view.SetGridColor(path, Color.red);
        }

        [ContextMenu("TestAttackRange")]
        public void TestAttackRange()
        {
            view.SetGridColor(null, Color.white);
            var paths = DataAlg.FindAllRange(model.mapCtx, Random.Range(1, 5), Random.Range(5, 10), new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            view.SetGridColor(paths.Keys, Color.red);
        }

        [ContextMenu("TestPolar")]
        public void TestPolar()
        {
            var region = PolarVector.Region(5);
            var p1 = new PolarVector(1, 0);
            var w1 = PolarVector.WhereRegion(region, p1.angle);

            var p2 = new PolarVector(1, region);
            var w2 = PolarVector.WhereRegion(region, p2.angle);

            var p3 = new PolarVector(1, 2 * region);
            var w3 = PolarVector.WhereRegion(region, p3.angle);

            Debug.Log(w1);
            Debug.Log(w2);
            Debug.Log(w3);

            var angle = PolarVector.Angle(p1, p2);
            var offset = PolarVector.WhereRegion(region, angle);
            Debug.Log(angle);
            Debug.Log(offset);

            var area = PolarVector.Area(p1, p2);
            Debug.Log(area);

            Debug.Log("----");
            angle = PolarVector.Angle(p1, p3);
            offset = PolarVector.WhereRegion(region, angle);
            Debug.Log(angle);
            Debug.Log(offset);

            area = PolarVector.Area(p1, p3);
            Debug.Log(area);
        }
        #endregion
    }
}