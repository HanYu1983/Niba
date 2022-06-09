using UnityEngine;
using System.Collections;

public class TestMatch : TestMono
{
	IMatch _match = EntityManager.Singleton.Create<Match>();
	IPlayer _p1 = EntityManager.Singleton.Create<Player> ();
	IPlayer _p2 = EntityManager.Singleton.Create<Player> ();
	IPlayer _p3 = EntityManager.Singleton.Create<Player> ();
	void Start (){
		Assert (_match.Players.Count == 0, "-1");
		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p1.EntityID));
		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p2.EntityID));
		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p3.EntityID));
		Assert (_match.Players.Count == 3, "0");
		_match.StartMatch ();
		Assert(_match.CurrentPlayer.Instance == _p1, "1");
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p2, "2");
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p3, "3");
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p1, "4");
		((ICardAbilityReceiver)_match.GameState).Direction = Direction.Backward;
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p3, "5");
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p2, "6");
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p1, "7");
		_match.CurrentPlayer = _match.NextPlayer;
		Assert(_match.CurrentPlayer.Instance == _p3, "8");
	}
	void OnDestroy(){
		EntityManager.Singleton.Destroy (_p1.EntityID);
		EntityManager.Singleton.Destroy (_p2.EntityID);
		EntityManager.Singleton.Destroy (_p3.EntityID);
		EntityManager.Singleton.Destroy (_match.EntityID);
	}
}

