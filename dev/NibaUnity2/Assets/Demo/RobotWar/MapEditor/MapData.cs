using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RobotWar
{
    [Serializable]
    public class GridData
    {
        public Vector2Int pos;
    }

    public class MapData : ScriptableObject
    {
        public List<GridData> grids = new List<GridData>();
    }
}