using UnityEngine;
using System.Collections.Generic;

public interface IMatch : IEntity
{
	MatchPhase MatchPhase{ get; }
	void ContinuePlay();
	IDeck Deck{ get; }
	IDeck CenterDeck{ get; }
	IGameState GameState{ get; }
	void PlayerJoin(IOption<IPlayer> player);
	void PlayerLeave(IOption<IPlayer> player);
	IOption<IPlayer> CurrentPlayer{ get; set; }
	IOption<IPlayer> NextPlayer{ get; }
	IList<IOption<IPlayer>> Players{ get; }
	void StartMatch();
	void EndMatch();
}