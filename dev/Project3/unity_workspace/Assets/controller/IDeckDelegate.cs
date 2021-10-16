using UnityEngine;
using System.Collections;

public interface IDeckDelegate
{
	void OnPlayerDraw(IDeck deck, IDeckPlayer player, ICard card);
	void OnCardPush(IDeck deck, IDeckPlayer player, ICard card);
}