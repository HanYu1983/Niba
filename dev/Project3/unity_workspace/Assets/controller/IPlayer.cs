using UnityEngine;
using System.Collections;

public interface IPlayer : IDeckPlayer, IEntity, IInjectMatch
{
	void PushCard(ICard card);
	void DrawCard();
	void ImDie();
	IPlayerController Controller{ get; set; }
	IOption<IPlayer> Next{ get; set; }
	IOption<IPlayer> Prev{ get; set; }
}