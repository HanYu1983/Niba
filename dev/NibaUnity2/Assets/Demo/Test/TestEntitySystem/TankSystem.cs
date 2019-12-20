using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace Temp{
public class TankSystem : MonoBehaviour, EntityManager.IEntitySystem {
    public List<GameObject> tanks;

    public void OnAddEntity(GameObject go)
    {
        if (go.GetComponent<TankBehaviour>())
        {
            tanks.Add(go);
        }
    }

    public void OnRemoveEntity(GameObject go)
    {
        if (go.GetComponent<TankBehaviour>())
        {
            tanks.Remove(go);
        }
    }

    public int Go(string id, int avg)
    {
        Debug.Log("go:" + id + ":" + avg);
        return 10;
    }
}
}