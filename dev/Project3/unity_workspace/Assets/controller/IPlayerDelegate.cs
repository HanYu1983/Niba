using UnityEngine;
using System.Collections;

public interface IPlayerDelegate
{
	void OnPlayerWillPushCard(IPlayer player, ICard card);
	void OnPlayerWillDrawCard(IPlayer player);
	void OnPlayerDie(IPlayer player);
}

