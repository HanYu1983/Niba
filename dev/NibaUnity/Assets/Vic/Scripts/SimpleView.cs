﻿using System.Collections;
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
                case Page.Home:
                    view.OpenTitlePage();
                    break;
                case Page.Game:
                    view.OpenGamePlayPage();
                    view.SetGamePageTile();
                    break;
            }
            yield return null;
        }

		public IEnumerator ShowInfo(Info page, object args, Action<Exception> callback){
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
						var result = model.MoveResult;
						var events = result.events;
                        view.ProcessEvent(events, callback);
                    }
                    break;
			case Info.WorkResult:
				{
					var events = model.WorkResults;
					view.ProcessEvent(events, callback);
				}
				break;
			case Info.Item:
				{
                        view.ShowBackpack();
				}
                    break;
			case Info.Ability:
				{
                        view.ShowProperties();
				}
                    break;
                default:
                    throw new NotImplementedException();
            }
        }

		public IEnumerator HideInfo(Info page)
		{
			switch (page)
			{
			case Info.Work:
				{
					view.CloseWorkSideMenu ();
				}
				break;
			case Info.Event:
				{
					view.CloseMessagePopup ();
				}
				break;
			case Info.Item:
				{
					view.HidePackpack ();	
				}
				break;
			case Info.WorkResult:
				{
					view.CloseMessagePopup ();
				}
				break;
			case Info.Ability:
				{
					view.CloseMessagePopup ();
				}
				break;
			}
			yield return null;
		}

        IEnumerator UpdateMap(Action<Exception> callback)
        {
            // implement for test
            yield return ChangePage(Page.Game, callback);
        }

		public IEnumerator HandleCommand(string msg, object args, Action<Exception> callback){
			yield return null;
		}

		public void Alert (string msg){

		}
    }
}