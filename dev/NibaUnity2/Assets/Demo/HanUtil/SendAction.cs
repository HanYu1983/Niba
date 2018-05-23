using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace HanUtil
{
    public class SendAction : MonoBehaviour
    {
        public static Action<string> OnEvent = delegate { };
        public void Notify(string evt)
        {
            Debug.Log("SendAction-Notify:"+evt);
            OnEvent(evt);
        }
    }
}