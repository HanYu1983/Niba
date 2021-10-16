using UnityEngine;
using System.Collections;

public class ReceiverMono : MonoBehaviour, IEntity {

	public int EntityID{ 
		get{ 
			return GetComponent<EntityComponent>().EntityID; 
		}
		set{ 
			GetComponent<EntityComponent>().EntityID = value; 
		}
	}
	public EntityType EntityType{ 
		get { 
			return GetComponent<EntityComponent>().EntityType;
		} 
		set{ 
			GetComponent<EntityComponent>().EntityType = value; 
		}
	}
	public virtual void OnEntityDestroy(IEntityManager mgr){}

	protected virtual void Start(){
		RegisterToEntityManager ();
	}
	
	protected virtual void OnDestroy(){
		UnregisterToEntityManager ();
	}

	protected void RegisterToEntityManager(){
		EntityComponent entity = GetComponent<EntityComponent> ();
		if (entity != null) {
			EntityManager.Singleton.Register(this);
		}
	}

	protected void UnregisterToEntityManager(){
		EntityComponent entity = GetComponent<EntityComponent> ();
		if (entity != null) {
			EntityManager.Singleton.Unregister(this);
		}
	}
}
