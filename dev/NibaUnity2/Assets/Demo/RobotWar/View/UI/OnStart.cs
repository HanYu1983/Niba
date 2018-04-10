using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace RobotWar
{
    public class OnStart : MonoBehaviour
    {
        public UnityEvent onStart = new UnityEvent();
        void Start()
        {
            Debug.Log("start");
            onStart.Invoke();
        }
    }
}