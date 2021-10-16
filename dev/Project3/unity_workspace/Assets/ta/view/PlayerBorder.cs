using UnityEngine;
using System.Collections;

public class PlayerBorder : MonoBehaviour {
	public GameObject go_playPage;

	Vector3 _mouseDownPosition;
	Vector3 _currentMousePoisition;
	private float _borderMax = 4;
	private bool _mouseDown = false;
	private PlayerBorderState _isPlayerState;
	private PlayerBorderState _nonePlayerState;
	private PlayerBorderState _currentState;

	void Start(){
		_isPlayerState = new PlayerTurnState (this);
		_nonePlayerState = new NonePlayerTurnState (this);
		_currentState = _isPlayerState;
	}

	void Update(){
		if (_mouseDown) {
			_currentMousePoisition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
			float per = _currentMousePoisition.x / _borderMax;
			go_playPage.GetComponent<PlayPage>().onPlayerFocusCardByBorderPer( per );
			go_playPage.GetComponent<PlayPage>().onPlayerMoveCardByBorder( _currentMousePoisition.y - _mouseDownPosition.y );
		}
	}

	void onTouchConsumerEventMouseDown( TouchEvent te ){
		_mouseDown = true;
		_mouseDownPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	}
	
	void onTouchConsumerEventMouseUp( TouchEvent te ){
		_mouseDown = false;
		_currentState.onTouchConsumerEventMouseUp ( _currentMousePoisition.y );
	}

	public void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player){
		if (match.CurrentPlayer.Identity == (int)EnumEntityID.Player1)	_currentState = _isPlayerState;
		else _currentState = _nonePlayerState;
	}
}

class PlayerBorderState{
	private PlayerBorder _pb;
	public PlayerBorderState( PlayerBorder pb){	_pb = pb;}
	virtual public void onTouchConsumerEventMouseUp (float mouseY){}
	protected PlayerBorder getPlayerBorder(){ return _pb; }
}

class PlayerTurnState : PlayerBorderState{
	public PlayerTurnState( PlayerBorder pb):base( pb ){}
	override public void onTouchConsumerEventMouseUp( float mouseY ){
		if (mouseY > 0)	getPlayerBorder ().go_playPage.GetComponent<PlayPage> ().onPlayerSendCardByBorder ();
		else getPlayerBorder ().go_playPage.GetComponent<PlayPage> ().onPlayerReleaseCardByBorder();
	}
}

class NonePlayerTurnState : PlayerBorderState{
	public NonePlayerTurnState( PlayerBorder pb):base( pb ){}
	override public void onTouchConsumerEventMouseUp( float mouseY ){
		getPlayerBorder ().go_playPage.GetComponent<PlayPage> ().onPlayerReleaseCardByBorder();
	}
}

