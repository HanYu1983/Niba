using UnityEngine;
using System.Collections;

public class PlayerControllerDefaultAdapter : SenderAdapter, IPlayerController
{
	IPlayer _player;
	public IPlayer Owner{ get{ return _player; } set{ _player = value; } }

	IThinking _thinking;
	
	protected IThinking Thinking{ 
		get{
			if(_thinking == null){
				AIThinkingData think = new AIThinkingData();
				think.Match = Owner.Match;
				_thinking = think;
			}
			return _thinking;
		}
	}
	
	public IDeckPlayer CardOwner{ get{ return null; } }
	public Direction Direction{ 
		get{ return Direction.Forward; }
		set{ }
	}
	public void AddNumber(int number){ 
		// no feature
	}
	public void Pass(IDeckPlayer owner){
		// no feature
	}
	public void FullNumber(){
		// no feature
	}
	public virtual void AssignPlayer(IDeckPlayer owner){

	}
	public virtual void ControlNumber(int number, IDeckPlayer owner){

	}
	protected bool IsMyTurn{ 
		get{ 
			return Owner.Match.CurrentPlayer.Instance == Owner; 
		}
	}
}