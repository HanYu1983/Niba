using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.UI;

namespace RedAlert
{
    public class BuildingMenuProvider : MonoBehaviour, IDataProvider
    {
        public AbstractMenu menuHost;
        public RedAlertModel model;
        public PlayerHolder playerHolder;

        List<Building> menu;
        public void Prepared()
        {
            menu = DataAlg.GetBuildingMenu(model.ctx, playerHolder.player).ToList();
        }
        public int Count { get { return menu.Count; } }
        public void UpdateView(int i, GameObject row)
        {
            var data = menu[i];
            row.GetComponent<Text>().text = ConfigEntity.Get(data.prototype).Name;
        }
    }
}