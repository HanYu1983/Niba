using System.Collections;
using System.Collections.Generic;
using UnityEngine;

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
            var pos = transform.localPosition;
            switch (createType)
            {
                case CreateEntityType.Entity:
                    {
                        var key = DataAlg.CreateEntity(model.ctx, player, prototype, true);
                        var entity = gameObject.AddComponent<RedAlertEntity>();
                        entity.key = key;
                        var cfg = ConfigEntity.Get(prototype);
                        switch (cfg.EntityType)
                        {
                            case ConfigEntityType.ID_building:
                                {
                                    model.ctx.buildings[key].position = pos;
                                    model.ctx.buildings[key].player = player;
                                }
                                break;
                            default:
                                {
                                    model.ctx.units[key].position = pos;
                                    model.ctx.units[key].player = player;
                                }
                                break;
                        }
                    }
                    break;
                case CreateEntityType.Resource:
                    {
                        var key = DataAlg.CreateResource(model.ctx, prototype);
                        var entity = gameObject.AddComponent<RedAlertEntity>();
                        entity.key = key;
                        model.ctx.resources[key].position = pos;
                    }
                    break;
            }
            
        }
    }
}
