using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace GameView{
	public class TileLayer : AbstractView {

		public GameObject TilePrefab;

		void CreateTile( Dictionary<string,object>[] tileDatas ){
			for (int i = 0; i < tileDatas.Length; ++i) {
				Dictionary<string,object> tileData = tileDatas [i];
				print (tileData["tileType"]);
			}
		}

		// Use this for initialization
		void Start () {
			for (int i = 0; i < 50; ++i) {
				GameObject tileview = Instantiate (TilePrefab);
				tileview.transform.SetParent (this.transform);
				tileview.GetComponent<RectTransform> ().localScale = new Vector3 (1, 1, 1);
			}
//
	//		Dictionary<string,object>[] tileDatas = new Dictionary<string,object>[100];
	//		for (int i = 0; i < tileDatas.Length; ++i) {
	//			Dictionary<string, object> td = new Dictionary<string, object>()
	//			{
	//				{ "tileType", i}
	//			};
	//			tileDatas[i] = td;
	//		}
	//
	//		CreateTile (tileDatas);
		}
		
		// Update is called once per frame
		void Update () {
			
		}
	}
}
