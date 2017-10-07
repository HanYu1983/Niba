using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GamePage : AbstractView {

	public void OnBtnBackClick(){
		View.ChangeToPage ("Prefabs/TitlePage");
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}

	void CreateTile( ArrayList tileData ){

	}
}
