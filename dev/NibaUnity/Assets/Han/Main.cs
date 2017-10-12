using System;
using UnityEngine;
using HanUtil;
using GameView;

namespace Model
{
	public class Main : MonoBehaviour
	{
		public HandleDebug debug;
		public View gameView;

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
				return null;
			}
		}

		void TestGame(){
			Model.LoadMap (MapType.Unknown, e => {
				if(e != null){

				} else {
					View.ChangePage (PrefabPath.Game, Model, e2 => {
						if(e2 != null){

						} else {

						}
					});
				}
			});
		}
	}
}

