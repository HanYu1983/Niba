using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class OnEscapeQuit : MonoBehaviour
    {
        void Update()
        {
            if (Input.GetKeyUp("escape"))
            {
#if UNITY_EDITOR
                Debug.LogWarning("退出應用");
#endif
                Application.Quit();
            }
        }
    }
}