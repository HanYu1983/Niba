using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public class AutoRemoveGameObject : MonoBehaviour
    {
        public float duration;
        // Use this for initialization
        void Start()
        {
            StartCoroutine(DelayRemove());
        }
        IEnumerator DelayRemove()
        {
            yield return new WaitForSeconds(duration);
            Destroy(gameObject);
        }
    }
}