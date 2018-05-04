using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HanUtil;
using System.Linq;

namespace RedAlert
{
    public class BuildMenuProvider : MonoBehaviour, IShowPageListDataProvider<string>
    {
        public IntRef buildingKeyRef;
        public StrShowPageList pageList;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        void Awake()
        {
            buildingKeyRef.OnValueChange += pageList.UpdateView;
        }

        public List<string> GetData()
        {
            var buildingKey = buildingKeyRef.Ref;
            var prototype = model.ctx.buildings[buildingKey].prototype;
            return DataAlg.GetBuildMenu(model.ctx, playerHolder.player, prototype).Select(b => b.Id).ToList();
        }
    }
}