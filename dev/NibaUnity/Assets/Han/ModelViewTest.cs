using System;
using System.Collections;
using UnityEngine;
using HanUtil;
using GameView;
using Common;
using System.Linq;

namespace Model
{
	public class ModelViewTest : MonoBehaviour
	{
		public HandleDebug debug;
		public SimpleView gameView;

		void Start ()
		{
			View.ModelGetter = Model;
			StartCoroutine (TestAll());
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

		IEnumerator TestAll(){
			yield return TestMap (Model, View);
			yield return TestShowInfo (Model, View);
		}

		static IEnumerator TestInteraction(IModel model, IView view){
			UnityEngine.Random.InitState (1);

			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			view.ShowInfo (Info.Work, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}

			model.MoveRight ();
			model.ClearMoveResult ();

			var works = model.Works;
			var firstWork = works.First ();

			model.StartWork (firstWork);
			var playerInteraction = model.MakeInteraction (firstWork);
			var inters = model.Interactions;


		}

		static IEnumerator TestShowInfo(IModel model, IView view){
			UnityEngine.Random.InitState (1);

			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			view.ShowInfo (Info.Work, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}

			model.MoveRight ();
			var result = model.MoveResult;
			if(result.isMoveSuccess){
				yield return view.ShowInfo (Info.Map, e2 => {
					e = e2;
				});
				if (e != null) {
					throw e;
				}
				if (result.HasEvent) {
					yield return view.ShowInfo (Info.Event, e2 => {
						e = e2;
					});
					if (e != null) {
						throw e;
					}
					yield return new WaitForSeconds (2f);
				}
			}
			model.ClearMoveResult();

			yield return view.ShowInfo (Info.Work, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return new WaitForSeconds (2f);
		}

		static IEnumerator TestMap(IModel model, IView view){
			UnityEngine.Random.InitState (1);

			Exception e = null;
			yield return model.LoadMap (MapType.Unknown, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			yield return view.ChangePage (Page.Game, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			Debug.Log ("向右移20步");
			for (var i = 0; i < 20; ++i) {
				model.MoveRight ();
				var result = model.MoveResult;
				if(result.isMoveSuccess){
					yield return view.ShowInfo (Info.Map, e2 => {
						e = e2;
					});
					if (e != null) {
						throw e;
					}
				}
				model.ClearMoveResult();
				yield return new WaitForSeconds (0f);
			}
			Debug.Log ("向下移20步");
			for (var i = 0; i < 20; ++i) {
				model.MoveDown ();
				var result = model.MoveResult;
				if(result.isMoveSuccess){
					yield return view.ShowInfo (Info.Map, e2 => {
						e = e2;
					});
					if (e != null) {
						throw e;
					}
				}
				model.ClearMoveResult();
				yield return new WaitForSeconds (0f);
			}
			Debug.Log ("目前位置:" + model.MapPlayer.position);
			var objs = model.MapObjectsAt (model.MapPlayer.position);
			foreach (var obj in objs) {
				Debug.Log ("有物件:" + obj.type);
			}
			var works = model.Works;
			Debug.Log ("取得目前工作數量:" + works.Count ());
			if (works.Count () > 0) {
				if (model.MapPlayer.IsWorking) {
					throw new Exception ("現在必須沒有工作在身");
				}

				var firstWork = works.First ();
				Debug.Log ("開始第一件工作，工作為:"+firstWork.description);
				model.StartWork (firstWork);

				if (model.MapPlayer.IsWorking == false) {
					throw new Exception ("現在必須有工作在身");
				}
				var finishedTime = new DateTime (model.MapPlayer.workFinishedTime);
				Debug.Log ("工作結束時間為:"+finishedTime);

				model.ApplyWork ();

				switch (firstWork.description) {
				case Description.WorkCollectResource:
					{
						var collectTargetId = int.Parse (firstWork.values.Get ("mapObjectId"));
						var target = model.MapObjects [collectTargetId];
						var targetInfo = model.ResourceInfos [target.infoKey];
						Debug.Log ("采集"+targetInfo.type+"結束");
						if (target.died == false) {
							throw new Exception ("采集完的物件必須死亡");
						}
						yield return view.ShowInfo (Info.Map, e2 => {
							e = e2;
						});
						if (e != null) {
							throw e;
						}
						foreach (var item in model.StorageInMap) {
							Debug.Log ("擁有" + item.prototype +"/"+item.count);
						}
					}
					break;
				case Description.WorkAttack:
					break;
				}
			}
			Debug.Log ("上移1格");
			model.MoveUp ();
			yield return view.ShowInfo (Info.Map, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
			model.ClearMoveResult();

			Debug.Log ("直接完成第1個工作");
			model.StartWork (model.Works.First());
			model.ApplyWork ();
			yield return view.ShowInfo (Info.Map, e2 => {
				e = e2;
			});
			if (e != null) {
				throw e;
			}
		}
	}
}

