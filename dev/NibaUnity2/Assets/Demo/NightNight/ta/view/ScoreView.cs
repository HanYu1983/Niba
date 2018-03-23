using UnityEngine;
using System.Collections;

public class ScoreView : MonoBehaviour {

	public GameObject txt_turn;
	public GameObject txt_player;

	//改變目前數字
	public void GameNumberChanged(IGameState state, int number){
		txt_turn.GetComponent<TextMesh> ().text = number.ToString ();
	}
	
	//改變玩家
	public void DirectionChanged(IGameState state, Direction direction){
		txt_player.GetComponent<TextMesh> ().text = direction.ToString ();
	}
}
