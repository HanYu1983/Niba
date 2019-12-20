using UnityEngine;
using System.Collections;

public interface IGameState : IEntity
{
	void AddNumber(int number);
	IDeck CenterDeck{ get; set; }
	int CurrentNumber{ get; }
	Direction Direction{ get; }
	bool IsOutOf99{ get; }
}