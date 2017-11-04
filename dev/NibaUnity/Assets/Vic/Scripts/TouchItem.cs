using System;
using System.Collections;
using System.Collections.Generic;
using Common;
using UnityEngine;
namespace GameView
{
    public class TouchItem : Item
    {
        public override void Clear()
        {
            throw new NotImplementedException();
        }

        public override void SetType()
        {
            throw new NotImplementedException();
        }

        void OnMouseUp()
        {
            View.Instance.OnTouchItem(this);
        }
    }
}

