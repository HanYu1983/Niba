using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using GameFramework.GameStructure;

namespace RedAlert
{
    public enum CreateEntityType
    {
        Entity, Resource
    }

    public class CreateEntity : MonoBehaviour, IInjectServerModel, IInjectRedAlertController
    {
        public CreateEntityType createType;
        public string prototype;
        public int player;

        private void Start()
        {
            Injector.Inject(this);
            if(RedAlertController.Player == 0)
            {
                var pos = transform.localPosition;
                var rot = transform.localEulerAngles;

                switch (createType)
                {
                    case CreateEntityType.Entity:
                        {
                            var key = DataAlg.CreateEntity(ServerModel.ctx, player, prototype, true);
                            ServerModel.ctx.entities[key].position = pos;
                            ServerModel.ctx.entities[key].player = player;
                            /*
                            var entity = gameObject.AddComponent<RedAlertEntity>();
                            entity.isUpdatePosition = true;
                            entity.key = key;
                            var cfg = ConfigEntity.Get(prototype);
                            RedAlertController.View.entities.Add(key, entity);
                            */
                            RedAlertController.Client.ServerCreateViewEntity(key, prototype, pos, rot);
                        }
                        break;
                    case CreateEntityType.Resource:
                        {
                            var key = DataAlg.CreateResource(ServerModel.ctx, prototype);
                            ServerModel.ctx.resources[key].position = pos;
                            /*
                            var entity = gameObject.AddComponent<RedAlertEntity>();
                            entity.key = key;
                            RedAlertController.View.entities.Add(key, entity);
                            */
                            RedAlertController.Client.ServerCreateViewEntity(key, prototype, pos, rot);
                        }
                        break;
                }
            }
            Destroy(gameObject);
        }

        public RedAlertModel ServerModel { set; get; }
        public IRedAlertController RedAlertController { set; get; }
    }
}
