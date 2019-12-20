using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Test
{
    public class TestThrust : MonoBehaviour
    {
        public float stopHeight;
        public float factor;

        public void Update()
        {
            StopAir(stopHeight);
        }

        public void StopAir(float height)
        {
            var rigid = GetComponent<Rigidbody>();
            var y = transform.localPosition.y;
            if (y < height)
            {
                var offset = height - y;
                rigid.AddForce(Vector3.up * offset * 100);
            }
            else
            {
                var vy = rigid.velocity.y;
                if (vy < 0)
                {
                    var offset = 0 - vy;
                    rigid.AddForce(Vector3.up * offset * factor);
                }
            }
        }
    }
}