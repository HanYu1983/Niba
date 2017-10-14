using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
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

        public IEnumerator OpenPopup(Popup page, Action<Exception> callback)
        {
            return null;
        }
    }
}