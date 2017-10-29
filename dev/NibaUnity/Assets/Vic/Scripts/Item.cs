using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
namespace GameView {
    public abstract class Item : AbstractView
    {
        public abstract void SetType(MapObject mapObject, IModelGetter model);
        public abstract void Clear();
        public int Index
        {
            set;
            get;
        }
        public Vector2 Position
        {
            get
            {
                return View.GetXYByIndex(Index);
            }
        }
    }
}

