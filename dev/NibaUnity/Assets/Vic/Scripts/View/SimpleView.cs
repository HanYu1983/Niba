using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
using System;

namespace GameView
{
    public class SimpleView : MonoBehaviour, IView
    {
        public View view;

        public IModelGetter ModelGetter
        {
            set
            {
                throw new NotImplementedException();
            }
        }

        public IEnumerator ChangePage(Page page, Action<Exception> callback)
        {
            throw new NotImplementedException();
        }

        public IEnumerator OpenPopup(Popup page, Action<Exception> callback)
        {
            throw new NotImplementedException();
        }
    }
}