using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace NightmarketAssistant
{
    public class NMAEvent : MonoBehaviour
    {
        public static Action<MonoBehaviour> OnComponentStart = delegate { };
        public static Action<MonoBehaviour> OnComponentDestroy = delegate { };
        public static Action OnBoothListChange = delegate { };
        public static Action OnEarnListChange = delegate { };
    }
}