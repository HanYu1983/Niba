using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    public class GridView : MonoBehaviour
    {
        public static Action<GridView> OnStart = delegate { };
        public Vector2Int coord;

        private void Start()
        {
            OnStart(this);
        }
    }
}