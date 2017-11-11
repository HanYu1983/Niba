using System.Collections;
using System.Collections.Generic;
using Common;
using UnityEngine;

namespace GameView
{
    public class TileLayer : ItemLayer
    {
        internal override MapObjectType GetValidType()
        {
            return MapObjectType.Resource;
        }
    }
}
