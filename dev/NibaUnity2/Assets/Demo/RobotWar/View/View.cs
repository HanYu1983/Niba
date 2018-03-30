using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    

    public class View : MonoBehaviour
    {
        #region state
        public void UpdateState(Model model)
        {

        }
        #endregion

        #region map
        public GameObject gridPrefab;
        public Transform gridRoot;
        public int gridWidth, gridHeight;
        Dictionary<string, GridView> gridView = new Dictionary<string, GridView>();

        public void CreateMap(MapData mapData)
        {
            gridView.Clear();
            foreach(var g in mapData.grids)
            {
                var go = Instantiate(gridPrefab, gridRoot, false);
                var pos = go.transform.localPosition;
                pos.x = g.pos.x * gridWidth;
                pos.z = g.pos.y * gridHeight;
                go.transform.localPosition = pos;

                var gv = go.GetComponent<GridView>();
                gv.coord = g.pos;
                gridView.Add(gv.Key, gv);

                go.SetActive(true);
            }
        }

        public void SetGridColor(IEnumerable<Grid> grids, Color color)
        {
            if(grids == null)
            {
                foreach (var gv in gridView.Values)
                {
                    gv.gameObject.GetComponent<Renderer>().material.color = color;
                }
                return;
            }
            foreach(var g in grids)
            {
                var gv = gridView[g.Key];
                gv.gameObject.GetComponent<Renderer>().material.color = color;
            }
        }
        #endregion

        #region unit
        public IEnumerator AnimateUnitMove(string key, Vector2Int dist)
        {
            yield return 0;
        }
        #endregion

        #region popup
        public UnitMenu GetUnitMenu()
        {
            return null;
        }

        public WeaponMenu GetWeaponMenu()
        {
            return null;
        }
        #endregion
    }

    public class Menu<T> : MonoBehaviour
    {
        public Action<Menu<T>> OnSelect = delegate { };
        public T selected;
        public List<T> menu;
        public Model model;

        public void Select(int idx)
        {
            if (menu.Count <= idx)
            {
                throw new Exception("XXX");
            }
            selected = menu[idx];
            OnSelect(this);
        }

        public T Selected
        {
            get
            {
                return selected;
            }
        }
    }
}