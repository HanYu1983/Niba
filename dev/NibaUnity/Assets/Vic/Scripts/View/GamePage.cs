using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace GameView{
	public class GamePage : AbstractView {

		public TileLayer tileLayer;

		public void OnBtnBackClick(){
			
			
		}

		// Use this for initialization
		void Start () {
			tileLayer.View = View;
		}
		
		// Update is called once per frame
		void Update () {
			
		}

	}
}
