using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    public class GridView : MonoBehaviour
    {
        public static Action<GridView> OnClick = delegate { };
        public Vector2Int coord;
        public GameObject top;

        public string Key
        {
            get
            {
                return coord.y + "_" + coord.x;
            }
        }

        public void UpdateView(Model model)
        {
            var gk = new Grid(coord).Key;
            var g = model.mapCtx.grids[gk];
            switch (g.prototype)
            {
                case "deepOcean":
                    top.GetComponent<Renderer>().material.color = Color.blue;
                    break;
                case "ocean":
                    top.GetComponent<Renderer>().material.color = Color.Lerp(Color.blue, Color.white, 0.5f);
                    break;
                case "plain":
                    top.GetComponent<Renderer>().material.color = Color.green;
                    break;
                case "city":
                    top.GetComponent<Renderer>().material.color = Color.gray;
                    break;
                case "mori":
                    top.GetComponent<Renderer>().material.color = Color.Lerp(Color.green, Color.black, 0.5f);
                    break;
                case "mountain":
                    top.GetComponent<Renderer>().material.color = Color.yellow;
                    break;
            }
        }

        /*protected virtual void OnMouseEnter()
        {
            GetComponent<Renderer>().material.color = Color.gray;
        }
        protected virtual void OnMouseExit()
        {
            GetComponent<Renderer>().material.color = Color.white;
        }*/

        void OnMouseDown()
        {
            Debug.Log("OnPointerClick");
            OnClick(this);
        }
    }
}