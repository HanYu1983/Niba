using System;
using UnityEngine;
using HanUtil;
using GameView;
using Common;
using System.Linq;

namespace Model
{
	public class Main : MonoBehaviour
	{
		public HandleDebug debug;
		public SimpleView gameView;

		void Start ()
		{
			TestGame ();
		}

		IModel Model {
			get {
				var model = GetComponent<Model> ();
				if (model == null) {
					throw new UnityException ("model not found");
				}
				return model;
			}
		}

		IView View {
			get {
				if (gameView == null) {
					throw new UnityException ("view not found");
				}
				return gameView;
			}
		}

		void TestGame ()
		{
			View.ModelGetter = Model;

			Common.Common.OnEvent += (evt, arg) => {
				print ("evt: " + evt);
				switch (evt) {
				case UIEventName.GamePage_btnMove_down:
				case UIEventName.GamePage_btnMove_left:
				case UIEventName.GamePage_btnMove_right:
				case UIEventName.GamePage_btnMove_up:
					{
						if(evt == UIEventName.GamePage_btnMove_down){
							Model.MoveDown ();
						}
						if(evt == UIEventName.GamePage_btnMove_left){
							Model.MoveLeft ();
						}
						if(evt == UIEventName.GamePage_btnMove_right){
							Model.MoveRight ();
						}
						if(evt == UIEventName.GamePage_btnMove_up){
							Model.MoveUp ();
						}
						var result = Model.MoveResult;
						if(result.isMoveSuccess){
							/*
							if(result.HasEvent){
								View.OpenPopup (Popup.Event, e => {

								});
							}
							*/
							StartCoroutine (View.UpdateMap (e2 => {
								if (e2 != null) {

								} else {

								}
							}));
						}
						Model.ClearMoveResult();
					}
					break;
                case UIEventName.TitlePage_btnStart_click: 
					break;
				}
			};

			StartCoroutine (Model.LoadMap (MapType.Unknown, e => {
				if (e != null) {

				} else {
					StartCoroutine (View.ChangePage (Page.Game, e2 => {
						if (e2 != null) {

						} else {
							
						}
					}));
				}
			}));
		}
	}
}

