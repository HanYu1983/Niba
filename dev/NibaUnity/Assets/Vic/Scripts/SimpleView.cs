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
                    yield return view.ChangeToPage(PrefabPath.Title, (GameObject obj)=>
                    {
                        callback(null);
                    });
                    break;
                case Page.Game:
                    yield return view.ChangeToPage(PrefabPath.Game, (GameObject obj) =>
                    {
                        view.SetGamePageTile(model);
                        callback(null);
                    });
                    break;
            }
        }

        public IEnumerator ShowInfo(Info page, Action<Exception> callback)
        {
			switch (page) {
			case Info.Work:
				{
					var works = model.Works;
					foreach (var work in works) {
						Debug.Log (work.description);
						if (work.description == Description.WorkCollectResource) {
							var mapObjectId = int.Parse (work.values.Get ("mapObjectId"));
							var mapObject = model.MapObjects [mapObjectId];
							var mapObjectInfo = model.ResourceInfos [mapObject.infoKey];
							Debug.Log ("采集任務，目標為:"+mapObjectInfo.type);
						}
					}
				}
				break;
			case Info.Event:
				{
					var result = model.MoveResult;
					var events = result.events;
					foreach (var e in events) {
						Debug.Log (e.description);
						if (e.description == Description.EventLucklyFind) {
							var itemPrototype = int.Parse (e.values.Get ("itemPrototype"));
							var count = int.Parse (e.values.Get ("count"));
							Debug.Log ("獲得item:"+itemPrototype+" 數量:"+count);
						}
					}
				}
				break;
			}
			throw new NotImplementedException();
        }

		public IEnumerator UpdateMap (Action<Exception> callback){
            // implement for test
            yield return ChangePage(Page.Game, callback);
		}
    }
}