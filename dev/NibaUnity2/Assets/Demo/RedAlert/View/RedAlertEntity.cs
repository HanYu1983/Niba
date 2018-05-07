using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public class RedAlertEntity : MonoBehaviour, IInjectRedAlertController, IInjectServerModel
    {
        public int key;
        public bool isUpdatePosition;

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
                }
            }
        }

        public IRedAlertController RedAlertController { set; get; }
        public RedAlertModel ServerModel { set; get; }
    }
}