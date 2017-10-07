using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class testView : MonoBehaviour {

	public View View;

	// Use this for initialization
	void Start () {
		View.OnChangePage += OnChangePage;
	}

	void OnChangePage( string name, View view ){
		print ("OnChangePage");
	}
}
