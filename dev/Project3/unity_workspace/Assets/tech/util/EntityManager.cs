using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class EntityManager : IEntityManager
{
	public static IEntityManager Singleton = new EntityManager();
	Dictionary<int, IEntity> _entities = new Dictionary<int, IEntity>();
	public T Create<T>() where T : IEntity, new(){
		return Create<T> (-1);
	}
	public T Create<T>(int id) where T : IEntity, new(){
		T ret = new T ();
		ret.EntityID = id;
		Register (ret);
		return ret;
	}
	public void Destroy(int id){
		if (_entities.ContainsKey (id)) {
			_entities[id].OnEntityDestroy(this);
			Unregister(_entities[id]);
		}
	}
	public void Register(IEntity entity){
		if (entity.EntityID == -1) {
			entity.EntityID = GenerateId();
		}
		_entities [entity.EntityID] = entity;
		AddEventManager (entity);
	}
	public void Unregister(IEntity entity){
		RemoveEventManager(entity);
		_entities.Remove(entity.EntityID);
	}
	public IOption<T> GetEntity<T>(int entityId){
		return Option<T>.Wrap(entityId, this);
	}
	public IEnumerable<IOption<T>> GetType<T>(EntityType type){
		return _entities.Values.ToList ().FindAll (entity=>{
			return entity.EntityType == type;
		}).Select(entity=>{ return (IOption<T>)Option<T>.Wrap(entity.EntityID, this); });
	}
	public object GetObject(int id){
		if (_entities.ContainsKey (id))
			return _entities [id];
		else
			return null;
	}
	void AddEventManager(object obj){
		EventManager.Singleton.AddReceiver (obj);
		if (obj is IEventSender) {
			EventManager.Singleton.AddSender((IEventSender)obj);
		}
	}
	void RemoveEventManager(object obj){
		EventManager.Singleton.RemoveReceiver (obj);
		if (obj is IEventSender) {
			EventManager.Singleton.RemoveSender((IEventSender)obj);
		}
	}
	int _id = -1;
	int GenerateId(){
		return --_id;
	}
}