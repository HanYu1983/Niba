using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public class RedAlertEntity : MonoBehaviour, IInjectRedAlertController, IInjectServerModel
    {
        public int key;
        public bool isUpdatePosition;
        Vector3 lastPos, lastRot;

        void Start()
        {
            Injector.Inject(this);
        }

        private void Update()
        {
            if(RedAlertController.Player == 0)
            {
                var isEntity = ServerModel.ctx.entities.ContainsKey(key);
                if (isEntity)
                {
                    var isDirty = lastPos != transform.localPosition || lastRot != transform.localRotation.eulerAngles;
                    if (isDirty)
                    {
                        var pos = transform.localPosition;
                        var rot = transform.localRotation.eulerAngles;

                        var e = ServerModel.ctx.entities[key];
                        e.position = pos;
                        if (isUpdatePosition)
                        {
                            if (RedAlertController.Client == null)
                            {
                                Debug.LogWarning("Client Not Set");
                                return;
                            }
                            RedAlertController.Client.ServerSyncEntity(key, pos, rot);
                        }
                        lastPos = pos;
                        lastRot = rot;
                    }
                }

                var isBullet = ServerModel.ctx.bullets.ContainsKey(key);
                if (isBullet)
                {
                    var e = ServerModel.ctx.bullets[key];
                    ProjectileHelper.UpdateProjectile(ref e.position, ref e.velocity, -9.81f, Time.deltaTime);
                    transform.localPosition = e.position;

                    var isDirty = lastPos != transform.localPosition || lastRot != transform.localRotation.eulerAngles;
                    if (isDirty)
                    {
                        var pos = transform.localPosition;
                        var rot = transform.localRotation.eulerAngles;
                        e.position = pos;
                        if (isUpdatePosition)
                        {
                            if (RedAlertController.Client == null)
                            {
                                Debug.LogWarning("Client Not Set");
                                return;
                            }
                            RedAlertController.Client.ServerSyncEntity(key, pos, rot);
                        }
                        lastPos = pos;
                        lastRot = rot;
                    }
                }
            }
        }

        public IRedAlertController RedAlertController { set; get; }
        public RedAlertModel ServerModel { set; get; }
    }
}