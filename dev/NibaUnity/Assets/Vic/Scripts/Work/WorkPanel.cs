using Common;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;
using HanRPGAPI;

namespace GameView
{
    public class WorkPanel : BasicPanel
    {
        override public void UpdateContent()
        {
            IModelGetter model = View.Instance.Model;
            var works = model.Works;
            var workcount = works.Count();
            SetContentHeight(workcount);
            for (int i = 0; i < WorkItems.Count; ++i)
            {
                WorkItem workitem = WorkItems[i].GetComponent<WorkItem>();
                workitem.gameObject.SetActive(i < workcount);
                if (i < workcount)
                {
                    Description workModel = works.ElementAt(i);
                    string describe = "";
                    string doName = "";
                    if (workModel.description == Description.WorkCollectResource)
                    {
                        var mapObjectId = int.Parse(workModel.values.Get("mapObjectId"));
                        var mapObject = model.MapObjects[mapObjectId];
                        var mapObjectInfo = model.ResourceInfos[mapObject.infoKey];
                        var config = ConfigResource.Get(mapObjectInfo.type);
                        describe += "采集[" + config.Name + "]";
                        doName += "采集";
                    }

                    if (workModel.description == Description.WorkAttack)
                    {
                        var mapObjectId = int.Parse(workModel.values.Get("mapObjectId"));
                        var mapObject = model.MapObjects[mapObjectId];
                        var mapObjectInfo = model.MonsterInfos[mapObject.infoKey];
                        var config = ConfigMonster.Get(mapObjectInfo.type);
                        describe += "攻擊[" + config.Name + "]";
                        doName += "攻擊";
                    }
                    workitem.Describe = describe;
                    workitem.DoName = doName;
                    workitem.WorkModel = workModel;
                }
            }
        }
        
    }
}