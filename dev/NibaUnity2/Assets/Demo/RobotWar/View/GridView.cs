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

        public string Key
        {
            get
            {
                return coord.y + "_" + coord.x;
            }
        }

        protected virtual void OnMouseEnter()
        {
            GetComponent<Renderer>().material.color = Color.gray;
        }
        protected virtual void OnMouseExit()
        {
            GetComponent<Renderer>().material.color = Color.white;
        }

        void OnMouseDown()
        {
            Debug.Log("OnPointerClick");
            OnClick(this);
        }
    }
}