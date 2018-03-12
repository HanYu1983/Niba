using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace NightmarketAssistant
{
    public class NMAEvent : MonoBehaviour
    {
        public static Action OnBoothListChange = delegate { };
        public static Action OnEarnListChange = delegate { };
    }
}