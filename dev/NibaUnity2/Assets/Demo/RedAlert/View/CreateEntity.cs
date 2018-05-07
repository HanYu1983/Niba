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

    public class CreateEntity : MonoBehaviour
    {
        public RedAlertModel model;
        public CreateEntityType createType;
        public string prototype;
        public int player;

        private void Awake()
        {
            var serverModel = GameManager.Instance.gameObject.GetComponent<RedAlertModel>();
            var pos = transform.localPosition;
            switch (createType)
            {
                case CreateEntityType.Entity:
                    {
                        var key = DataAlg.CreateEntity(serverModel.ctx, player, prototype, true);
                        var entity = gameObject.AddComponent<RedAlertEntity>();
                        entity.key = key;
                        var cfg = ConfigEntity.Get(prototype);
                        serverModel.ctx.entities[key].position = pos;
                        serverModel.ctx.entities[key].player = player;
                    }
                    break;
                case CreateEntityType.Resource:
                    {
                        var key = DataAlg.CreateResource(serverModel.ctx, prototype);
                        var entity = gameObject.AddComponent<RedAlertEntity>();
                        entity.key = key;
                        serverModel.ctx.resources[key].position = pos;
                    }
                    break;
            }
            
        }
    }
}
