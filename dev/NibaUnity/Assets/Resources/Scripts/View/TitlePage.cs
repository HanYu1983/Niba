using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TitlePage : AbstractView {

	public void OnBtnStartClick(){
		View.ChangeToPage ("Prefabs/GamePage");
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
