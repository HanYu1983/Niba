using UnityEngine;
using System.Collections;

public class TouchConsumer : MonoBehaviour {

	public string eventName = "default";

	void onMouseDown(){
		if (eventName == "default")	eventName = this.transform.name;
		Transform target = this.transform;
		SendMessageUpwards ("onTouchConsumerEventMouseDown", new TouchEvent(eventName, target),SendMessageOptions.DontRequireReceiver);
	}
	
	void onMouseUp(){
		if (eventName == "default")	eventName = this.transform.name;
		Transform target = this.transform;
		SendMessageUpwards ("onTouchConsumerEventMouseUp", new TouchEvent(eventName, target),SendMessageOptions.DontRequireReceiver);
	}
}
