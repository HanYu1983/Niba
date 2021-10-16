using UnityEngine;
using System.Collections;

public interface IGameStateDelegate
{
	void OnGameNumberChanged(IGameState state, int number);
	void OnDirectionChanged(IGameState state, Direction direction);
}