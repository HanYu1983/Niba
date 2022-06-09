using UnityEngine;
using System.Collections;

public class TableView : MonoBehaviour {
	public GameObject prefabCard;
	public GameObject handView;
	public GameObject handView2;
	public GameObject handView3;
	public GameObject handView4;
	public GameObject putCardToTablePosition;
	private GameObject _targetView;

	private int _zindex = 0;

	public void PushCardToTable( IDeck deck, IDeckPlayer player, ICard card ){
		switch (player.EntityID) {
		case (int)EnumEntityID.Player1:_targetView = handView;break;
		case (int)EnumEntityID.Player2:_targetView = handView2;break;
		case (int)EnumEntityID.Player3:_targetView = handView3;break;
		case (int)EnumEntityID.Player4:_targetView = handView4;break;
		}

		GameObject cv = (GameObject)Instantiate (prefabCard, this.transform.position, this.transform.rotation);
		cv.GetComponent<CardViewConfig> ().cardModel = card;
		cv.transform.parent = this.transform;
		cv.transform.position = new Vector3( _targetView.transform.position.x, _targetView.transform.position.y, this.transform.position.z + _zindex );
		cv.transform.Rotate( new Vector3(0, 0, Random.value * 360));
		iTween.ScaleBy (cv, iTween.Hash ("x", .8, "y", .8, "time", 1));
		iTween.RotateBy( cv, iTween.Hash("z", .6, "easeType", "easeOutCubic", "time", 1));
		iTween.MoveTo( cv, iTween.Hash("x", putCardToTablePosition.transform.position.x + Random.value * 3 - 1.5, 
		                               "y", putCardToTablePosition.transform.position.y + Random.value * 3 - 1.5,
		                               "z", putCardToTablePosition.transform.position.z + _zindex,
		                               "easeType", "easeOutCubic",
		                               "time", 1 ));
		_zindex--;
	}
}
