using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
namespace GameView {
    public abstract class Item : MonoBehaviour
    {
        public abstract void SetType(MapObject mapObject, IModelGetter model);
        public abstract void Clear();
    }
}

