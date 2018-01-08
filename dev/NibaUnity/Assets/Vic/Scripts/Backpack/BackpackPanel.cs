using UnityEngine;
using System.Collections;
using Common;
using System.Linq;
using System.Collections.Generic;

namespace GameView
{
    public class BackpackPanel : BasicPanel
    {
        public override void UpdateContent()
        {
			/*
            IModelGetter model = View.Instance.Model;
			var items = model.MapPlayer.storage;
            var workcount = items.Count();
            SetContentHeight(workcount);
            for (int i = 0; i < WorkItems.Count; ++i)
            {
                BackpackItem workitem = WorkItems[i].GetComponent<BackpackItem>();
                workitem.gameObject.SetActive(i < workcount);
                if (i < workcount)
                {
                    Common.Item itemModel = items.ElementAt(i);
                    var config = ConfigItem.Get(itemModel.prototype);
                    var itemName = config.Name;
                    var count = itemModel.count;

                    workitem.Describe = itemName + "/" + count;
                    workitem.DoName = "詳細";
                    workitem.BackpackItemModel = itemModel;
                }
            }
            */
        }
    }
}