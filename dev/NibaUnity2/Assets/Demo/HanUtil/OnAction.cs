using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace HanUtil
{
    public class OnAction : MonoBehaviour
    {
        public string listen;
        public UnityEvent on = new UnityEvent();

        private void Start()
        {
            SendAction.OnEvent += OnEvent;
        }

        private void OnDestroy()
        {
            SendAction.OnEvent -= OnEvent;
        }

        void OnEvent(string evt)
        {
            if(evt.Equals(listen))
            {
                on.Invoke();
            }
        }
    }
}