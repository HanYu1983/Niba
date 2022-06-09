using UnityEngine;
using System.Collections;

public class StackView : MonoBehaviour {
	public GameObject prefabCard;
	public GameObject handView;
	public GameObject handView2;
	public GameObject handView3;
	public GameObject handView4;

	private ArrayList _ary_fakeCards = new ArrayList();

	void Start(){
		CreateFakeCards ();
	}

	public void dealCard( IDeckPlayer player, ICard card ){
		GameObject cv = (GameObject)Instantiate (prefabCard, this.transform.position, this.transform.rotation);
		cv.GetComponent<CardViewConfig> ().cardModel = card;
		cv.transform.parent = this.transform;
		cv.transform.localScale = new Vector3( .45f, .45f, 1 );
		cv.transform.localRotation = Quaternion.Euler( new Vector3( 0, 180, 0 ));
		cv.transform.localPosition = new Vector3( cv.transform.localPosition.x , cv.transform.localPosition.y , -10 );
		Transform targetTransform = null;

		switch (player.EntityID) {
		case (int)EnumEntityID.Player1:targetTransform = handView.transform;break;
		case (int)EnumEntityID.Player2:targetTransform = handView2.transform;break;
		case (int)EnumEntityID.Player3:targetTransform = handView3.transform;break;
		case (int)EnumEntityID.Player4:targetTransform = handView4.transform;break;
		}
		iTween.MoveTo ((GameObject)cv, iTween.Hash (	"x", targetTransform.position.x,
						                               	"y", targetTransform.position.y,
						                               	"time", 1));
		iTween.ScaleTo((GameObject)cv, iTween.Hash( 	"x", .7f,
			                                          	"y", .7f,
			                                          	"time", 1 ));
		iTween.FadeTo ((GameObject)cv, iTween.Hash (	"alpha", 0,
		                                            	"time", 1,
		                                          		"oncomplete", "onMoveToComplete",
		                                            	"oncompletetarget", this.gameObject,
		                                           		"oncompleteparams",(GameObject)cv));

	}

	public void onMoveToComplete( GameObject cardView){
		Destroy (cardView);
	}

	void CreateFakeCards(){
		_ary_fakeCards.Add ((GameObject)Instantiate (prefabCard, this.transform.position, this.transform.rotation));
		_ary_fakeCards.Add ((GameObject)Instantiate (prefabCard, this.transform.position, this.transform.rotation));
		_ary_fakeCards.Add ((GameObject)Instantiate (prefabCard, this.transform.position, this.transform.rotation));
		_ary_fakeCards.Add ((GameObject)Instantiate (prefabCard, this.transform.position, this.transform.rotation));

		GameObject fc;
		for( int i = 0; i < _ary_fakeCards.Count; ++i ){
			fc = (GameObject)_ary_fakeCards[i];
			fc.transform.parent = this.transform;
			fc.transform.localScale = new Vector3( .45f, .45f, 1 );
			fc.transform.localRotation = Quaternion.Euler( new Vector3( 0, 180, 0 ));
			fc.transform.localPosition = new Vector3( -(float)i / 20 , -(float)i / 20 , -i );
		}
	}
}
