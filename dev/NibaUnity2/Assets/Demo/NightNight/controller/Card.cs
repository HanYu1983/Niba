using UnityEngine;
using System.Collections.Generic;

public class Card : ICard
{
	CardType _type;
	int _number;
	CardAbility _ability;
	int _id;
	public CardType Type { get{ return _type; }}
	public int Id { get{ return _id; }}
	public int Number { get { return _number; } }
	public CardAbility Ability{ get { return _ability; } }
	public bool IsNormal{ get{ return _ability == CardAbility.Unknown; } }
	public bool IsSpecial{ get{ return !IsNormal; } }
	Card(CardType type, int number, CardAbility ability, int id){
		_type = type;
		_id = id;
		_number = number;
		_ability = ability;
	}
	public override string ToString(){
		return "Card(" + _type + "," +_number+ ")";
	}

	public void InvokeAbility(ICardAbilityReceiver receiver){
		switch (Ability) {
		case CardAbility.Unknown:
			receiver.AddNumber(Number);
			break;
		case CardAbility.Pass:
			receiver.Pass(receiver.CardOwner);
			break;
		case CardAbility.AddNumber10:
			receiver.ControlNumber(10, receiver.CardOwner);
			break;
		case CardAbility.AddNumber20:
			receiver.ControlNumber(20, receiver.CardOwner);
			break;
		case CardAbility.AddNumber99:
			receiver.FullNumber();
			break;
		case CardAbility.AssignPlayer:
			receiver.AssignPlayer(receiver.CardOwner);
			break;
		case CardAbility.InverseDirection:
			receiver.Direction = receiver.Direction == Direction.Forward ? Direction.Backward : Direction.Forward;
			break;
		}
	}

	public static Card SpadeA = new Card(CardType.Spade, 1, CardAbility.Unknown, 0);
	public static Card Spade2 = new Card(CardType.Spade, 2, CardAbility.Unknown, 1);
	public static Card Spade3 = new Card(CardType.Spade, 3, CardAbility.Unknown, 2);
	public static Card Spade4 = new Card(CardType.Spade, 4, CardAbility.InverseDirection, 3);
	public static Card Spade5 = new Card(CardType.Spade, 5, CardAbility.AssignPlayer, 4);
	public static Card Spade6 = new Card(CardType.Spade, 6, CardAbility.Unknown, 5);
	public static Card Spade7 = new Card(CardType.Spade, 7, CardAbility.Unknown, 6);
	public static Card Spade8 = new Card(CardType.Spade, 8, CardAbility.Unknown, 7);
	public static Card Spade9 = new Card(CardType.Spade, 9, CardAbility.Unknown, 8);
	public static Card Spade10 = new Card(CardType.Spade, 10, CardAbility.AddNumber10, 9);
	public static Card SpadeJ = new Card(CardType.Spade, 11, CardAbility.Pass, 10);
	public static Card SpadeQ = new Card(CardType.Spade, 12, CardAbility.AddNumber20, 11);
	public static Card SpadeK = new Card(CardType.Spade, 13, CardAbility.AddNumber99, 12);
	
	public static Card HeartA = new Card(CardType.Heart, 1, CardAbility.Unknown, 13);
	public static Card Heart2 = new Card(CardType.Heart, 2, CardAbility.Unknown, 14);
	public static Card Heart3 = new Card(CardType.Heart, 3, CardAbility.Unknown, 15);
	public static Card Heart4 = new Card(CardType.Heart, 4, CardAbility.InverseDirection, 16);
	public static Card Heart5 = new Card(CardType.Heart, 5, CardAbility.AssignPlayer, 17);
	public static Card Heart6 = new Card(CardType.Heart, 6, CardAbility.Unknown, 18);
	public static Card Heart7 = new Card(CardType.Heart, 7, CardAbility.Unknown, 19);
	public static Card Heart8 = new Card(CardType.Heart, 8, CardAbility.Unknown, 20);
	public static Card Heart9 = new Card(CardType.Heart, 9, CardAbility.Unknown, 21);
	public static Card Heart10 = new  Card(CardType.Heart, 10, CardAbility.AddNumber10, 22);
	public static Card HeartJ = new Card(CardType.Heart, 11, CardAbility.Pass, 23);
	public static Card HeartQ = new Card(CardType.Heart, 12, CardAbility.AddNumber20, 24);
	public static Card HeartK = new Card(CardType.Heart, 13, CardAbility.AddNumber99, 25);
	
	public static Card DiamondA = new Card(CardType.Diamond, 1, CardAbility.Unknown, 26);
	public static Card Diamond2 = new Card(CardType.Diamond, 2, CardAbility.Unknown, 27);
	public static Card Diamond3 = new Card(CardType.Diamond, 3, CardAbility.Unknown, 28);
	public static Card Diamond4 = new Card(CardType.Diamond, 4, CardAbility.InverseDirection, 29);
	public static Card Diamond5 = new Card(CardType.Diamond, 5, CardAbility.AssignPlayer, 30);
	public static Card Diamond6 = new Card(CardType.Diamond, 6, CardAbility.Unknown, 31);
	public static Card Diamond7 = new Card(CardType.Diamond, 7, CardAbility.Unknown, 32);
	public static Card Diamond8 = new Card(CardType.Diamond, 8, CardAbility.Unknown, 33);
	public static Card Diamond9 = new Card(CardType.Diamond, 9, CardAbility.Unknown, 34);
	public static Card Diamond10 = new Card(CardType.Diamond, 10, CardAbility.AddNumber10,35);
	public static Card DiamondJ = new Card(CardType.Diamond, 11, CardAbility.Pass, 36);
	public static Card DiamondQ = new Card(CardType.Diamond, 12, CardAbility.AddNumber20, 37);
	public static Card DiamondK = new Card(CardType.Diamond, 13, CardAbility.AddNumber99, 38);
	
	public static Card ClubA = new Card(CardType.Club, 1, CardAbility.Unknown, 39);
	public static Card Club2 = new Card(CardType.Club, 2, CardAbility.Unknown, 40);
	public static Card Club3 = new Card(CardType.Club, 3, CardAbility.Unknown, 41);
	public static Card Club4 = new Card(CardType.Club, 4, CardAbility.InverseDirection, 42);
	public static Card Club5 = new Card(CardType.Club, 5, CardAbility.AssignPlayer, 43);
	public static Card Club6 = new Card(CardType.Club, 6, CardAbility.Unknown, 44);
	public static Card Club7 = new Card(CardType.Club, 7, CardAbility.Unknown, 45);
	public static Card Club8 = new Card(CardType.Club, 8, CardAbility.Unknown, 46);
	public static Card Club9 = new Card(CardType.Club, 9, CardAbility.Unknown, 47);
	public static Card Club10 = new Card(CardType.Club, 10, CardAbility.AddNumber10, 48);
	public static Card ClubJ = new Card(CardType.Club, 11, CardAbility.Pass, 49);
	public static Card ClubQ = new Card(CardType.Club, 12, CardAbility.AddNumber20, 50);
	public static Card ClubK = new Card(CardType.Club, 13, CardAbility.AddNumber99, 51);

	public static IList<ICard> AllCard = new List<ICard>{
		SpadeA, Spade2, Spade3, Spade4, Spade5, Spade6, Spade7, Spade8, Spade9, Spade10, SpadeJ, SpadeQ, SpadeK,
		HeartA, Heart2, Heart3, Heart4, Heart5, Heart6, Heart7, Heart8, Heart9, Heart10, HeartJ, HeartQ, HeartK,
		DiamondA, Diamond2, Diamond3, Diamond4, Diamond5, Diamond6, Diamond7, Diamond8, Diamond9, Diamond10, DiamondJ, DiamondQ, DiamondK,
		ClubA, Club2, Club3, Club4, Club5, Club6, Club7, Club8, Club9, Club10, ClubJ, ClubQ, ClubK
	};
}

