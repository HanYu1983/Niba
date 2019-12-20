using UnityEngine;
using System.Collections;

public class ReceiverMono : MonoBehaviour {

	protected virtual void Start(){
		RegisterToEntityManager ();
	}
	
	protected virtual void OnDestroy(){
		UnregisterToEntityManager ();
	}

	protected void RegisterToEntityManager(){
        EventManager.Singleton.Add(this);
    }

	protected void UnregisterToEntityManager(){
        EventManager.Singleton.Remove(this);
    }
}
