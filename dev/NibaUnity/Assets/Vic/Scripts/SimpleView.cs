using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
using System;

namespace GameView
{
    public class SimpleView : MonoBehaviour, IView
    {
        public View view;

        IModelGetter model;

        public IModelGetter ModelGetter
        {
            set
            {
                model = value;
                view.Model = model;
            }
        }

        public IEnumerator ChangePage(Page page, Action<Exception> callback)
        {
            switch (page)
            {
                case Page.Title:
                    view.OpenTitlePage();
                    break;
                case Page.Game:
                    view.OpenGamePlayPage();
                    view.SetGamePageTile();
                    break;
            }
            yield return null;
        }

        public IEnumerator ShowInfo(Info page, Action<Exception> callback)
        {
			switch (page) {
			case Info.Map:
				{
					yield return UpdateMap (callback);
				}
				break;
			case Info.Work:
				{
					var works = model.Works;
					foreach (var work in works) {
						Debug.Log (work.description);
						if (work.description == Description.WorkCollectResource) {
							var mapObjectId = int.Parse (work.values.Get ("mapObjectId"));
							var mapObject = model.MapObjects [mapObjectId];
							var mapObjectInfo = model.ResourceInfos [mapObject.infoKey];
							var config = ConfigResource.Get (mapObjectInfo.type);
							Debug.Log ("采集任務，目標為:"+config.Name);
						}

						if (work.description == Description.WorkAttack) {
							var mapObjectId = int.Parse (work.values.Get ("mapObjectId"));
							var mapObject = model.MapObjects [mapObjectId];
							var mapObjectInfo = model.MonsterInfos [mapObject.infoKey];
							var config = ConfigMonster.Get (mapObjectInfo.type);
							Debug.Log ("攻擊任務，目標為:"+config.Name);
						}
					}
					callback (null);
				}
				throw new NotImplementedException();
			case Info.Event:
				{
                        view.ProcessEvent();
					callback (null);
				}
                    break;
			default:
				throw new NotImplementedException();
			}
        }

		IEnumerator UpdateMap (Action<Exception> callback){
            // implement for test
            yield return ChangePage(Page.Game, callback);
		}
    }
}