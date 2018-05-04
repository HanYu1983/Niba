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
            return DataAlg.GetBuildMenu(model.ctx, playerHolder.player, buildingKey).Select(b => b.Id).ToList();
        }
    }
}