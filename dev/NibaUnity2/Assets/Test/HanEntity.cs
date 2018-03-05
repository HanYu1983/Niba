using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HanEntity : MonoBehaviour {
    public string id;
	void Start () {
        EntityManager.single.Register(this);
	}
	
	void OnDestroy () {
        EntityManager.single.Unregister(this);
    }
}
