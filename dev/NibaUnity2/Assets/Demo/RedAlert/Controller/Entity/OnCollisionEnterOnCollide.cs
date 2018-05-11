using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public class OnCollisionEnterOnCollide : MonoBehaviour
    {
        void Start()
        {
            Injector.Inject(this);
        }
        
        private void OnCollisionEnter(Collision collision)
        {
            Injector.OnCollide(gameObject, collision);
        }
    }
}