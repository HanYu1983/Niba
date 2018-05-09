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
                var isExist = ServerModel.ctx.entities.ContainsKey(key);
                if (isExist)
                {
                    var e = ServerModel.ctx.entities[key];
                    var cfg = ConfigEntity.Get(e.prototype);
                    if (cfg.EntityType == ConfigEntityType.ID_bullet)
                    {
                        ProjectileHelper.UpdateProjectile(ref e.position, ref e.rotation, -9.81f, Time.deltaTime);
                        transform.localPosition = e.position;
                    }
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