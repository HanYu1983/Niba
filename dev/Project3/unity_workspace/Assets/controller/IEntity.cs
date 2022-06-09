using UnityEngine;
using System.Collections;

public interface IEntity
{
	int EntityID{ get; set; }
	EntityType EntityType{ get; set; }
	void OnEntityDestroy(IEntityManager mgr);
}

