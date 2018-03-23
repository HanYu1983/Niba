using UnityEngine;
using System.Collections.Generic;

public interface IEntityManager : IOptionContainer
{
	T Create<T> ()where T : IEntity, new();
	T Create<T> (int id) where T : IEntity, new();
	void Destroy(int id);
	void Register(IEntity entity);
	void Unregister(IEntity entity);
	IOption<T> GetEntity<T>(int entityId);
	IEnumerable<IOption<T>> GetType<T>(EntityType type);
}