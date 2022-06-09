using UnityEngine;
using System.Collections;

public class RealPlayerController : PlayerControllerDefaultAdapter, IPlayPageDelegate, IMatchDelegate
{
	bool _isAutoControlNumber;
	public bool IsAutoControlNumber{
		get{ return _isAutoControlNumber; }
		set{ _isAutoControlNumber = value; }
	}

	public void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player){
		if (match == Owner.Match) {
			bool isTurnToMe = player.Identity == Owner.EntityID;
			if (isTurnToMe) {
				Owner.DrawCard();
			}
		}
	}

	public void onPlayPageBtnPauseClick( object sender ){}
	public void onPlayPageBtnEnterClick( object sender ){}
	public void onPlayPageGameStart( object sender ){}
	public void onPlayPageSendCard( object sender, ICard cardModel ){
		if(cardModel.IsNormal){
			bool isOutOf99 = Owner.Match.GameState.CurrentNumber + cardModel.Number > 99;
			if(isOutOf99)
				Owner.ImDie();
		}
		Owner.PushCard(cardModel);
	}
	public override void AssignPlayer(IDeckPlayer owner){
		
	}
	public override void ControlNumber(int number, IDeckPlayer owner){
		if( IsAutoControlNumber ){
			if(Owner.Match.GameState.CurrentNumber + number > 99){
				Owner.Match.GameState.AddNumber (-number);
			}else{
				Owner.Match.GameState.AddNumber (number);
			}
		}
	}
}

