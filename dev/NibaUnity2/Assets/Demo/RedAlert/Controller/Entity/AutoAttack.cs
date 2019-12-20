using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace RedAlert
{
    public class AutoAttack : MonoBehaviour, IInjectRedAlertController, IInjectServerModel
    {
        public GameObject self;
        GameObject target;

        private void Awake()
        {
            if (self == null)
            {
                self = gameObject;
            }
        }

        void Start()
        {
            Injector.Inject(this);
            StartCoroutine(FindTarget());
        }

        IEnumerator FindTarget()
        {
            while (true)
            {
                yield return new WaitForSeconds(1f);
                if (true)//target == null)
                {
                    var viewEntity = self.GetComponent<RedAlertEntity>();
                    var isExist = ServerModel.ctx.entities.ContainsKey(viewEntity.key);
                    if (isExist == false)
                    {
                        continue;
                    }
                    var entity = ServerModel.ctx.entities[viewEntity.key];
                    var targetEntity = DataAlg.GetClosestEntity(ServerModel.ctx, -1, null, ConfigEntityType.ID_unit, self.transform.localPosition)
                        .Where(e=>e.player != entity.player)
                        .FirstOrDefault();
                    if(targetEntity == null)
                    {
                        continue;
                    }
                    var hasTarget = RedAlertController.View.entities.ContainsKey(targetEntity.Key);
                    if(hasTarget == false)
                    {
                        Debug.LogWarning("must have unit:" + targetEntity.Key);
                        continue;
                    }
                    target = RedAlertController.View.entities[targetEntity.Key].gameObject;
                }
            }
        }

        void Update()
        {
            if(RedAlertController.Client == null)
            {
                Debug.LogWarning("no connect");
                return;
            }
            if(RedAlertController.Player != 0)
            {
                return;
            }
            var viewEntity = self.GetComponent<RedAlertEntity>();
            var entity = ServerModel.ctx.entities[viewEntity.key];

            if(target != null)
            {
                var weapons = DataAlg.GetUnitWeapon(ServerModel.ctx, entity.player, entity.Key);
                foreach (var w in weapons)
                {
                    if (DataAlg.FireWeapon(ServerModel.ctx, w.Key))
                    {
                        RedAlertController.Client.ServerCreateBullet(w.Key, self.transform.localPosition, target.transform.localPosition);
                    }
                }
            }
        }

        public IRedAlertController RedAlertController { set; get; }
        public RedAlertModel ServerModel { set; get; }
    }
}