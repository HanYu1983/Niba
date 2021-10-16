using UnityEngine;
using System.Collections;

public class AIPlayerController : PlayerControllerDefaultAdapter, IMatchDelegate, IInjectUpdate
{
	public void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player){
		if (match == Owner.Match) {
			bool isTurnToMe = player.Identity == Owner.EntityID;
			if (isTurnToMe) {
				Owner.DrawCard();
			}
		}
	}
	public void OnUpdate(object sender){
		if (IsMyTurn) {

			if(Owner.Match.MatchPhase == MatchPhase.Idle)
				return;

			if(Owner.Match.MatchPhase == MatchPhase.Stop)
				return;

			if(Owner.Cards.Count == 0)
				return;

			if(Thinking.WillOutOf99(Owner)){
				if( Thinking.HasSpecialCard(Owner) ){
					Thinking.RandomCardButSpecial(Owner).Map((ICard card)=>{
						Owner.PushCard(card);
					});

				}else{
					Owner.ImDie();

				}

			}else{
				if( Thinking.HasNormalCard(Owner) ){
					IOption<ICard> cardOp = Thinking.SelectLargestCardNumberButNoOutOf99(Owner);
					if(cardOp.IsDeleted){
						if( Thinking.HasSpecialCard(Owner) ){
							Thinking.RandomCardButSpecial(Owner).Map((ICard card)=>{
								Owner.PushCard(card);
							});

						}else{
							Owner.ImDie();

						}

					}else{
						Owner.PushCard (cardOp.Instance);
					}
				}else{
					ICard card = Thinking.RandomCard(Owner);
					Owner.PushCard (card);
				}
			}
		}
	}
	public override void AssignPlayer(IDeckPlayer owner){
		IPlayer player = Thinking.TheFewestCardPlayer;
		Owner.Match.CurrentPlayer = EntityManager.Singleton.GetEntity<IPlayer>(player.EntityID);
	}
	public override void ControlNumber(int number, IDeckPlayer owner){
		if(Owner.Match.GameState.CurrentNumber + number > 99){
			Owner.Match.GameState.AddNumber (-number);
		}else{
			Owner.Match.GameState.AddNumber (number);
		}
	}
}