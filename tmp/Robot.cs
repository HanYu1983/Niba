using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Robot : MonoBehaviour, IdManagerGetter {

    void Start()
    {
        EventManager.Singleton.Add(this);
    }
    void OnDestroy()
    {
        EventManager.Singleton.Remove(this);
    }

    void Update()
    {
        var ids = IdManager.FindName("enemy");
        Debug.Log(ids.Count);

        var p = transform.localPosition;
        p.x += 0.1f;
        transform.localPosition = p;
    }

    public IdManager IdManager { get; set; }
}
