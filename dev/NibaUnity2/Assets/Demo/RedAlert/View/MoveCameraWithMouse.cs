using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public class MoveCameraWithMouse : MonoBehaviour
    {
        public Transform cameraTrans;
        public Vector2Int min, max;
        public int offset;
        public float speed;

        private void Update()
        {
            Step();
        }

        void Step()
        {
            var mp = Input.mousePosition;
            if (mp.x < min.x + offset)
            {
                cameraTrans.transform.Translate(Vector3.left * speed, Space.World);
            }
            if (mp.x > max.x - offset)
            {
                cameraTrans.transform.Translate(Vector3.right * speed, Space.World);
            }
            if (mp.y < min.y + offset)
            {
                cameraTrans.transform.Translate(Vector3.back * speed, Space.World);
            }
            if (mp.y > max.y - offset)
            {
                cameraTrans.transform.Translate(Vector3.forward * speed, Space.World);
            }

            if (Input.GetAxis("Mouse ScrollWheel") > 0)
            {
                cameraTrans.transform.Translate(Vector3.forward * 10 * speed, Space.Self);
            }
            if (Input.GetAxis("Mouse ScrollWheel") < 0)
            {
                cameraTrans.transform.Translate(Vector3.back * 10 * speed, Space.Self);
            }
        }
    }
}