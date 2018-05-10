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

        void Awake()
        {
            unitKeyRef.OnValueChange += pageList.UpdateView;
        }
        
        public List<string> GetData()
        {
            var uk = unitKeyRef.Ref;
            var unit = model.ctx.entities[uk];
            var techs = DataAlg.GetUnitTechMenu(unit.prototype);
            return techs.Select(t => t.Id).ToList();
        }
    }
}