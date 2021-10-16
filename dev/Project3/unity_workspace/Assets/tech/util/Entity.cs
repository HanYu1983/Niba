using UnityEngine;
using System.Collections;

public class Entity : IEntity
{
	int _entityId = -1;
	EntityType _entityType = EntityType.Unknown;
	public int EntityID{ get{ return _entityId; } set{ _entityId = value; } }
	public EntityType EntityType{ get { return _entityType; } set{ _entityType = value; } }
	public virtual void OnEntityDestroy(IEntityManager mgr){}
}

