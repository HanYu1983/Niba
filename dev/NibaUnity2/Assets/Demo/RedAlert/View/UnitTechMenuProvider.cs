using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class UnitTechMenuProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public StrShowPageList pageList;
        public IntRef unitKeyRef;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        void Awake()
        {
            unitKeyRef.OnValueChange += pageList.UpdateView;
        }
        
        public List<string> GetData()
        {
            var uk = unitKeyRef.Ref;
            var unit = model.ctx.entities[uk];
            var cfg = ConfigEntity.Get(unit.prototype);
            switch (cfg.EntityType)
            {
                case ConfigEntityType.ID_building:
                    {
                        var techs = DataAlg.GetBuildingTechMenu(model.ctx, playerHolder.player, unit.prototype);
                        return techs.Select(t => t.prototype).ToList();
                    }
                default:
                    {
                        var techs = DataAlg.GetUnitTechMenu(unit.prototype);
                        return techs.Select(t => t.Id).ToList();
                    }
            }
            
        }
    }
}