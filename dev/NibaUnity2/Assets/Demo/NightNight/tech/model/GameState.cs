using UnityEngine;
using System.Collections;
using System.Linq;

public class GameState : SenderAdapter, IGameState, ICardAbilityReceiver
{
	IDeck _centerDeck;
	Direction _direction = Direction.Forward;
	int _currentNumber;

	public IDeck CenterDeck{ 
		get{ return _centerDeck; } 
		set{ _centerDeck = value; } 
	}
	public int CurrentNumber{ 
		get{ return _currentNumber; }
		set{ 
			if(_currentNumber != value){
				_currentNumber = value;
				Sender.Receivers.ToList().ForEach(obj=>{
					((IGameStateDelegate)obj).OnGameNumberChanged(this, _currentNumber);
				});
			}
		}
	}
	public bool IsOutOf99{ get{ return CurrentNumber > 99; } }

	public IDeckPlayer CardOwner{ get{ return null; } }
	public Direction Direction{ 
		get{ return _direction; } 
		set{ 
			if(_direction != value){
				_direction = value;
				Sender.Receivers.ToList().ForEach(obj=>{
					((IGameStateDelegate)obj).OnDirectionChanged(this, _direction);
				});
			}
		}
	}
	public void AddNumber(int number){ 
		CurrentNumber += number;
	}
	public void Pass(IDeckPlayer owner){
		// no feature
	}
	public void FullNumber(){
		CurrentNumber = 99;
	}
	public void AssignPlayer(IDeckPlayer owner){
		// no feature
	}
	public void ControlNumber(int number, IDeckPlayer owner){
		// no feature
	}
	protected override bool HandleVerifyReceiverDelegate (object receiver){
		return receiver is IGameStateDelegate;
	}
}