using UnityEngine;
using System.Collections;
using System.Collections.Generic;
public class TouchEvent
{
	public Transform target;
	public string name;

	public TouchEvent( string name, Transform target ){
		this.target = target;
		this.name = name;
	}
}

