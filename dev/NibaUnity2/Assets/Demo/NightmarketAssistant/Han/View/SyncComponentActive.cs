using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class SyncComponentActive : MonoBehaviour
    {
        public GameObject[] objs;

        private void OnEnable()
        {
            foreach(var o in objs)
            {
                o.SetActive(true);
            }
        }

        private void OnDisable()
        {
            foreach (var o in objs)
            {
                o.SetActive(false);
            }
        }
    }
}