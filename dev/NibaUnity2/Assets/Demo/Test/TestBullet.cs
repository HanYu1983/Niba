using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Test
{
    public class TestBullet : MonoBehaviour
    {
        public GameObject bullet;
        public List<GameObject> bullets;
        public List<Vector3> vecs;
        public GameObject target;
        public float gravity = -9.81f;
        public float speed = 100;

        private void Start()
        {
            StartCoroutine(Fire());
        }

        private void Update()
        {
            var dt = Time.deltaTime;
            for(var i=0; i<bullets.Count; ++i) {
                var b = bullets[i];
                var v = vecs[i];
                var pos = b.transform.localPosition;
                ProjectileHelper.UpdateProjectile(ref pos, ref v, gravity, dt);
                b.transform.localPosition = pos;

                vecs[i] = v;
            }
        }

        IEnumerator Fire()
        {
            while (true)
            {
                var tmp = Instantiate(bullet, null, false);
                tmp.transform.localPosition = transform.localPosition;

                ProjectileHelper.ComputeSpeedToReachTargetWithElevation(tmp.transform.localPosition, target.transform.localPosition, Mathf.PI / 4, gravity, ref speed);

                Vector3 dir1, dir2;
                if(ProjectileHelper.ComputeDirectionToHitTargetWithSpeed(tmp.transform.localPosition, target.transform.localPosition, gravity, speed, out dir1, out dir2))
                {

                }
                else
                {
                    Debug.LogWarning("Can not reach!");
                }
                bullets.Add(tmp);
                vecs.Add(dir1 * speed);

                yield return new WaitForSeconds(1f);
            }
        }
    }
}