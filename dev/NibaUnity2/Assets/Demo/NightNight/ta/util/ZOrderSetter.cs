using UnityEngine;
using System.Collections;

public class ZOrderSetter : MonoBehaviour
{
	public ZOrder zorder;
	void Start(){
		transform.position = new Vector3 (transform.position.x, transform.position.y, (int)zorder);
	}
}

