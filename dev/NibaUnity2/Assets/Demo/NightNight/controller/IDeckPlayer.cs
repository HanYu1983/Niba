using UnityEngine;
using System.Collections.Generic;

public interface IDeckPlayer : IEntity
{
	bool IsNoCard{ get; }
	void AddCard(ICard card);
	bool IsContainCard(ICard card);
	ICard RemoveCard(ICard card);
	IList<ICard> Cards{ get; }
}

