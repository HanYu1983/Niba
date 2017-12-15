using System;
using UnityEngine;
using View;
using Model;
using System.Collections;

namespace Common
{
	public class Controller : MonoBehaviour
	{
		public HanView hanView;
		public Model.Model defaultModel;

		public IView view;
		public IModel model;

		void Awake(){
			Common.OnEvent += Common_OnEvent;
			view = hanView;
			model = defaultModel;

			view.ModelGetter = model;
		}

		void HandleException(Exception e){
			Debug.LogError (e.Message);
		}

		void Common_OnEvent (string msg, object args)
		{
			switch (msg) {
			case "click_home_map":
				StartCoroutine (OpenMap ());
				break;
			case "click_map_down":
			case "click_map_left":
			case "click_map_right":
			case "click_map_up":
				{
					if (msg == "click_map_down") {
						model.MoveDown ();
					}
					if (msg == "click_map_left") {
						model.MoveLeft ();
					}
					if (msg == "click_map_right") {
						model.MoveRight ();
					}
					if (msg == "click_map_up") {
						model.MoveUp ();
					}
					var result = model.MoveResult;
					if (result.isMoveSuccess) {
						StartCoroutine (view.ShowInfo (Info.Map, e2 => {
							if (e2 != null) {

							} else {
								StartCoroutine(view.ShowInfo(Info.Work, e3=>{
									if(e3 != null){

									}
								}));
							}
						}));
					}
					model.ClearMoveResult ();
				}
				break;
			}
		}

		IEnumerator OpenMap(){
			Exception e = null;
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				HandleException (e);
				yield break;
			}
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				HandleException (e);
				yield break;
			}
			yield return view.ShowInfo(Info.Map, e2=>{
				e = e2;
			});
			if (e != null) {
				HandleException (e);
				yield break;
			}
		}
	}
}

