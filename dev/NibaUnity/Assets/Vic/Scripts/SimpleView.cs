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
            switch (page)
            {
                case Info.Map:
                    {
                        yield return UpdateMap(callback);
                    }
                    break;
                case Info.Work:
                    {
                        view.ProcessWork(callback);
                    }
                    break;
                case Info.Event:
                    {
                        view.ProcessEvent(callback);
                    }
                    break;
			case Info.ItemInMap:
				{
					var items = model.StorageInMap;
					foreach (var item in items) {
						var config = ConfigItem.Get (item.prototype);
						var itemName = config.Name;
						var count = item.count;
						Debug.Log (itemName + "/" + count);
					}
				}
				throw new NotImplementedException();
                default:
                    throw new NotImplementedException();
            }
        }

		public void HideInfo(Info page)
		{
			switch (page)
			{
			case Info.Work:
				{
					
				}
				throw new NotImplementedException();
			case Info.Event:
				{
					
				}
				throw new NotImplementedException();
			case Info.ItemInMap:
				{
					
				}
				throw new NotImplementedException();
			}
		}

        IEnumerator UpdateMap(Action<Exception> callback)
        {
            // implement for test
            yield return ChangePage(Page.Game, callback);
        }
    }
}