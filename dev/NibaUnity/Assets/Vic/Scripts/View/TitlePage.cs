using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace GameView{
	public class TitlePage : AbstractView {

		public void OnBtnStartClick(){
			View.ChangeToPage (PrefabPath.Game);
		}

		// Use this for initialization
		void Start () {
			
		}
		
		// Update is called once per frame
		void Update () {
			
		}
	}
}