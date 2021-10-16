using UnityEngine;
using System.Collections;

public class EntityComponent : MonoBehaviour, IEntity
{
	public EnumEntityID entityId = EnumEntityID.Default;
	public EntityType entityType;

	public int EntityID{ get{ return (int)entityId; } set{ entityId = (EnumEntityID)value; } }
	public EntityType EntityType{ get { return entityType; } set{ entityType = value; } }
	public void OnEntityDestroy(IEntityManager mgr){}
}