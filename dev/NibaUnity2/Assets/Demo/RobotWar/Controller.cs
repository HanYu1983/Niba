using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RobotWar
{
    public class Controller : MonoBehaviour
    {
        public Model model;
        public View view;

        private void Start()
        {
            TestLoadMap();
        }

        public IEnumerator LoadMap(string path)
        {
            var request = Resources.LoadAsync<MapData>(path);
            yield return request;
            var data = request.asset as MapData;
            model.CreateMap(data);
            view.CreateMap(data);
        }

        #region map control
        public enum ControlState
        {
            SelectUnit, SelectMoveDist, SelectAttackTarget
        }
        public ControlState controlState;
        public GridView gridViewSelected;

        public void InitMapControl()
        {
            GridView.OnClick += OnClickGrid;
        }

        void OnClickGrid(GridView g)
        {
            gridViewSelected = g;
        }

        IEnumerator PlayerControl()
        {
            gridViewSelected = null;

            switch (controlState)
            {
                case ControlState.SelectUnit:
                    {
                        yield return new WaitUntil(() =>
                        {
                            return gridViewSelected != null;
                        });
                        var k = new Grid(gridViewSelected.coord).Key;
                        var hasUnit = model.ctx.grid2Unit.ContainsKey(k);
                        if (hasUnit)
                        {
                            var unitKey = model.ctx.grid2Unit[k];
                            var unit = model.ctx.units[unitKey];
                            var movePower = DataAlg.GetMovePower(model.ctx, unitKey);
                            var paths = DataAlg.FindAllPath(model.ctx, movePower, gridViewSelected.coord);
                            view.SetGridColor(paths.Keys, Color.green);
                            if (unit.owner == 0)
                            {
                                // show menu
                                var unitMenu = view.OpenUnitMenu();
                                yield return unitMenu.WaitForResult();
                                unitMenu.gameObject.SetActive(false);

                                var selected = unitMenu.Selected;
                                switch (selected)
                                {
                                    case UnitMenuItem.Move:
                                        controlState = ControlState.SelectMoveDist;
                                        break;
                                    case UnitMenuItem.Attack:
                                        {
                                            // show weapon menu
                                        }
                                        break;
                                    case UnitMenuItem.Status:
                                        break;
                                }
                            }
                        }
                        else
                        {

                        }
                        gridViewSelected = null;
                    }
                    break;
                case ControlState.SelectMoveDist:
                    {

                    }
                    break;
            }
        }

        
        #endregion

        #region test
        [ContextMenu("TestLoadMap")]
        public void TestLoadMap()
        {
            StartCoroutine(LoadMap("Map/map01"));
        }

        [ContextMenu("TestCanMove")]
        public void TestCanMove()
        {
            view.SetGridColor(null, Color.white);

            var paths = DataAlg.FindAllPath(model.ctx, Random.Range(3, 10), new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
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
            var paths = DataAlg.FindAllRange(model.ctx, Random.Range(1, 5), Random.Range(5, 10), new Vector2Int(Random.Range(0, 10), Random.Range(0, 10)));
            view.SetGridColor(paths.Keys, Color.red);
        }
        #endregion
    }
}