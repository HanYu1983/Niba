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
            if(RedAlertController.Player != 0)
            {
                return;
            }

            var pos = transform.localPosition;
            switch (createType)
            {
                case CreateEntityType.Entity:
                    {
                        var key = DataAlg.CreateEntity(ServerModel.ctx, player, prototype, true);
                        var entity = gameObject.AddComponent<RedAlertEntity>();
                        entity.isUpdatePosition = true;
                        entity.key = key;
                        var cfg = ConfigEntity.Get(prototype);
                        ServerModel.ctx.entities[key].position = pos;
                        ServerModel.ctx.entities[key].player = player;

                        RedAlertController.View.entities.Add(key, entity);
                    }
                    break;
                case CreateEntityType.Resource:
                    {
                        var key = DataAlg.CreateResource(ServerModel.ctx, prototype);
                        var entity = gameObject.AddComponent<RedAlertEntity>();
                        entity.key = key;
                        ServerModel.ctx.resources[key].position = pos;

                        RedAlertController.View.entities.Add(key, entity);
                    }
                    break;
            }
            Destroy(this);
        }

        public RedAlertModel ServerModel { set; get; }
        public IRedAlertController RedAlertController { set; get; }
    }
}
