using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RobotWar
{
    public class View : MonoBehaviour
    {
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

        #region popup
        public UnitMenu unitMenu;
        public UnitMenu OpenUnitMenu()
        {
            unitMenu.gameObject.SetActive(true);
            return unitMenu;
        }
        #endregion
    }
}