using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using GameFramework.GameStructure;
using HanUtil;

namespace RobotWar
{
    public class Controller : MonoBehaviour, IControlStateHolder
    {
        public Model model;
        public View view;

        private void Start()
        {
            // GameFramework的Pause按鈕一按下去後Time.timeScale會設為0, 之後就變不回為1
            // 還沒去研究GameFramework的正確使用方式, 先在這裡用偷懒解法
            Time.timeScale = 1;
            model = GameManager.Instance.gameObject.GetComponent<Model>();
            view.Sync(model);
        }

        void Update()
        {
            StateUpdate(Time.deltaTime);
        }

        public void StartPlay()
        {
            ChangeState(new SystemState());
        }

        #region control state
        IControlState controlState;
        public void ChangeState(IControlState next)
        {
            Debug.Log("ChangeState:" + next);
            if(controlState != null)
            {
                controlState.OnExitState();
            }
            next.Holder = this;
            next.Model = model;
            next.View = view;
            next.OnEnterState();
            controlState = next;
        }
        public void StateUpdate(float t)
        {
            if(controlState == null)
            {
                return;
            }
            controlState.OnUpdate(t);
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
            for (var i=0; i<5; ++i)
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

    public interface IControlStateHolder
    {
        void ChangeState(IControlState state);
    }

    public interface IControlState
    {
        IControlStateHolder Holder { set; }
        Model Model { set; }
        View View { set; }
        void OnEnterState();
        void OnExitState();
        void OnUpdate(float t);
    }

    public abstract class DefaultControlState : IControlState
    {
        public IControlStateHolder Holder { set; get; }
        public Model Model { set; get; }
        public View View { set; get; }
        public virtual void OnEnterState() { }
        public virtual void OnExitState() { }
        public virtual void OnUpdate(float t) { }
    }
}