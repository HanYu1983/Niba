using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

public class EntityManager : MonoBehaviour {

    public interface IEntitySystem
    {
        void OnAddEntity(GameObject go);
        void OnRemoveEntity(GameObject go);
    }

    public static EntityManager single;
    public GameObject[] systems;
    public List<GameObject> entities;
    public int idCounter;

	void Awake () {
        single = this;
	}

    public void Register(HanEntity entity)
    {
        if (string.IsNullOrEmpty(entity.id))
        {
            entity.id = "Entity_"+idCounter++;
        }
        entities.Add(entity.gameObject);

        var sys = systems.SelectMany(o => { return o.GetComponents<IEntitySystem>(); });
        foreach (var s in sys)
        {
            s.OnAddEntity(entity.gameObject);
        }
    }

    public void Unregister(HanEntity entity)
    {
        entities.Add(entity.gameObject);

        var sys = systems.SelectMany(o => { return o.GetComponents<IEntitySystem>(); });
        foreach (var s in sys)
        {
            s.OnRemoveEntity(entity.gameObject);
        }
    }
}
