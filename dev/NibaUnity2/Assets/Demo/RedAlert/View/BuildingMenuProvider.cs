using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.UI;
using HanUtil;

namespace RedAlert
{
    public class BuildingMenuProvider : MonoBehaviour, IShowPageListDataProvider<int>
    {
        public IntShowPageList pageList;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        void Awake()
        {
            model.OnBuildingChange += pageList.UpdateView;
        }

        public List<int> GetData()
        {
            return DataAlg.GetBuildingMenu(model.ctx, playerHolder.player).Select(b=>b.Key).ToList();
        }
    }
}