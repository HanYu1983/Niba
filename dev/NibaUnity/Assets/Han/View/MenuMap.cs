using System;
using UnityEngine;
using Common;
using System.Collections;
using UnityEngine.UI;

namespace View
{
	public class MenuMap : MonoBehaviour
	{
		public GameObject gridLayout;
		public GameObject playerLayout;

		public GameObject[] grids;

		void InitGridOnce(){
			if (grids.Length == 100) {
				return;
			}
			grids = new GameObject[100];
			var gridParent = gridLayout.transform.parent;
			for (var i = 0; i<grids.Length; ++i) {
				var go = Instantiate (gridLayout, gridParent, false);
				go.SetActive (true);
				grids [i] = go;
			}
		}

		public IEnumerator UpdateUI(IModelGetter model){
			InitGridOnce ();
			SetTileWithPlayerPositionCenterExpend (model);
			yield return null;
		}

		void SetTileWithPlayerPositionCenterExpend(IModelGetter model){

			var gridParent = gridLayout.transform.parent;
			for (var i = 0; i<grids.Length; ++i) {
				grids [i].GetComponent<Text> ().text = "*";
			}

			MapObject[,] mapObjs;
			var leftTop = model.MapPlayer.position.Add (-5, -5).Max (0, 0);
			var rightBottom = leftTop.Add(10, 10).Min(model.MapWidth, model.MapHeight);
			Common.Common.FlattenMapObjects(model, MapObjectType.Resource, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var idx = y * 10 + x;
					var txt = grids [idx].GetComponent<Text> ();
					var mapObj = mapObjs[x,y];
					if(mapObj.type == MapObjectType.Unknown){
						txt.text = "*";
						continue;
					}
					if (mapObj.position.Equals (model.MapPlayer.position)) {
						playerLayout.transform.SetParent (txt.transform, false);
					}
					var info = model.ResourceInfos [mapObj.infoKey];
					var cfg = ConfigResource.Get (info.type);
					var name = cfg.Name;

					txt.text = name;
				}
			}

			Common.Common.FlattenMapObjects(model, MapObjectType.Monster, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var mapObj = mapObjs[x,y];
					if(mapObj.type == MapObjectType.Unknown){
						continue;
					}

				}
			}
		}
	}
}

