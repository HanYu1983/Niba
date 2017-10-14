using System;
using UnityEngine;
using HanUtil;
using GameView;

namespace Model
{
	public class Main : MonoBehaviour
	{
		public HandleDebug debug;
		public SimpleView gameView;

        void Start()
        {
            TestGame();
        }

		IModel Model{
			get{
				var model = GetComponent<Model> ();
				if (model == null) {
					throw new UnityException ("model not found");
				}
				return model;
			}
		}
		IView View{
			get{
				if (gameView == null) {
					throw new UnityException ("view not found");
				}
				return gameView;
			}
		}

		void TestGame(){
			View.ModelGetter = Model;

			Common.OnEvent += (evt, arg) => {
				switch(evt){
				case "btn_move_up":
					{
						Model.MoveUp();
						var result = Model.MoveResult;
						View.OpenPopup(Popup.Event, e=>{

						});
					}
					break;
				case "btn_move_down":
					break;
				}
			};

			Model.LoadMap (MapType.Unknown, e => {
				if(e != null){

				} else {
					View.ChangePage (Page.Game, e2 => {
						if(e2 != null){

						} else {

						}
					});
				}
			});
		}
	}
}

