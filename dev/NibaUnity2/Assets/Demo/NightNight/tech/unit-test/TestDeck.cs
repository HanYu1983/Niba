using UnityEngine;
using System.Collections;
using System.Linq;

namespace NN
{
    public class TestDeck : TestMono
    {
        IDeck _deck = new Deck();
        IPlayer _player = new Player();
        void Start()
        {
            Card.AllCard.ToList().ForEach(card => _deck.AddCard(card));

            Assert(_deck.Cards.Count == 52, "1");
            Assert(_player.Cards.Count == 0, "2");
            Assert(Card.ClubK == _deck.Peek(1)[0], "3");
            _deck.Draw(_player);
            Assert(_player.Cards.Count == 1, "4");
            Assert(_player.Cards[0] == Card.ClubK, "5");
            Assert(_deck.Cards.Count == 51, "6");
            Assert(Card.ClubQ == _deck.Peek(1)[0], "7");
            _deck.InsertBottom(_player, Card.ClubK);
            Assert(_player.IsNoCard, "8");
            Assert(_deck.Cards[0] == Card.ClubK, "9");
            _deck.Draw(_player);
            _deck.Draw(_player);
            Assert(_player.Cards.Count == 2, "10");
            Assert(_player.Cards[0] == Card.ClubQ && _player.Cards[1] == Card.ClubJ, "11");
            Assert(_deck.Peek(1)[0] == Card.Club10, "12");
            _deck.Insert(_player, Card.ClubQ, 1);
            Assert(_player.Cards.Count == 1, "13");
            Assert(_deck.Cards[1] == Card.ClubQ, "14");
            _deck.Insert(_player, Card.ClubJ, 1);
            Assert(_deck.Cards[1] == Card.ClubJ, "15");
            Assert(_player.IsNoCard, "16");
            Assert(_deck.Cards.Count == 52, "17");
        }
    }
}