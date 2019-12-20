using UnityEngine;
using System.Collections;
using System.Linq;

namespace NN{
public class TestMatchStart : TestMono
{
	IMatch _match = EntityManager.Singleton.Create<Match>();
	IPlayer _p1 = EntityManager.Singleton.Create<Player> ();
	IPlayer _p2 = EntityManager.Singleton.Create<Player> ();
	IPlayer _p3 = EntityManager.Singleton.Create<Player> ();
	IPlayer _p4 = EntityManager.Singleton.Create<Player> ();
	void Start (){
		Assert (_match.MatchPhase == MatchPhase.Idle, "p0");

		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p1.EntityID));
		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p2.EntityID));
		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p3.EntityID));
		_match.PlayerJoin (EntityManager.Singleton.GetEntity<IPlayer>(_p4.EntityID));

		_match.StartMatch ();
		Assert (_match.MatchPhase == MatchPhase.Stop, "p1");
		Assert (_p1.Cards.Count == 4, "2");
		Assert (_p2.Cards.Count == 4, "3");
		Assert (_p3.Cards.Count == 4, "4");
		Assert (_p4.Cards.Count == 4, "5");

		Assert (_p1.Cards[0] == Card.ClubK, "c10");
		Assert (_p1.Cards[1] == Card.Club9, "c11");
		Assert (_p1.Cards[2] == Card.Club5, "c12");
		Assert (_p1.Cards[3] == Card.ClubA, "c13");

		Assert (_p2.Cards[0] == Card.ClubQ, "c20");
		Assert (_p2.Cards[1] == Card.Club8, "c21");
		Assert (_p2.Cards[2] == Card.Club4, "c22");
		Assert (_p2.Cards[3] == Card.DiamondK, "c23");

		Assert (_p3.Cards[0] == Card.ClubJ, "c30");
		Assert (_p3.Cards[1] == Card.Club7, "c31");
		Assert (_p3.Cards[2] == Card.Club3, "c32");
		Assert (_p3.Cards[3] == Card.DiamondQ, "c33");

		Assert (_p4.Cards[0] == Card.Club10, "c40");
		Assert (_p4.Cards[1] == Card.Club6, "c41");
		Assert (_p4.Cards[2] == Card.Club2, "c42");
		Assert (_p4.Cards[3] == Card.DiamondJ, "c43");

		Assert (_match.Deck.Peek(1)[0] == Card.Diamond10, "diamond10");

		_match.EndMatch ();
		Assert (_match.MatchPhase == MatchPhase.Idle, "p2");
	}
	void OnDestroy(){
		EntityManager.Singleton.Destroy (_p1.EntityID);
		EntityManager.Singleton.Destroy (_p2.EntityID);
		EntityManager.Singleton.Destroy (_p3.EntityID);
		EntityManager.Singleton.Destroy (_p4.EntityID);
		EntityManager.Singleton.Destroy (_match.EntityID);
	}
}

}