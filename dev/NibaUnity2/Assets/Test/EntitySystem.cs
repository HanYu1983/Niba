using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class EntitySystem : MonoBehaviour, EntityManager.IEntitySystem {
    public abstract void OnAddEntity(GameObject go);
    public abstract void OnRemoveEntity(GameObject go);
}
