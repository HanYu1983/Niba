using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
namespace GameView{
	public class TitlePage : AbstractView {

		public void OnBtnStartClick(){
            Common.Notify("TitlePage_btnStart_click", PrefabPath.Game);
        }

		// Use this for initialization
		void Start () {
			
		}
		
		// Update is called once per frame
		void Update () {
			
		}
	}
}