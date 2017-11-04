using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
namespace GameView {
    public class Item : AbstractView
    {
        private MapObject _Model;
        public MapObject Model
        {
            get
            {
                return _Model;
            }
            set
            {
                _Model = value;
                SetType();
            }
        }
        public virtual void SetType() { }
        public virtual void Clear() { }
        public int Index
        {
            set;
            get;
        }
        public Position Position
        {
            get
            {
                return View.GetXYByIndex(Index);
            }
        }
    }
}

