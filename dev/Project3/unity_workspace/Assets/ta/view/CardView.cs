using UnityEngine;
using System.Collections;

public class CardView : MonoBehaviour {

	TextMesh _txt_name;

	private CardViewConfig _config;

	// Use this for initialization
	void Start () {
		_txt_name = GetComponentInChildren<TextMesh> ();
		_config = GetComponent<CardViewConfig> ();
		setCard ();
	}

	public void flip(){
		if( this.transform.localRotation.y == 180 )	this.transform.localRotation = Quaternion.Euler( new Vector3( 0, 0, 0 ));
		else this.transform.localRotation = Quaternion.Euler( new Vector3( 0, 180, 0 ));
	}

	public void setCard(){
		if (_config.cardModel == null)	return;
		_txt_name.text = getShowText (_config.cardModel.Number - 1);
	}

	string getShowText( int id ){
		switch (id) {
		case 0:return "A";
		case 1:return "2";
		case 2:return "3";
		case 3:return "4";
		case 4:return "5";
		case 5:return "6";
		case 6:return "7";
		case 7:return "8";
		case 8:return "9";
		case 9:return "10";
		case 10:return "J";
		case 11:return "Q";
		case 12:return "K";
		default:return "";
		}
	}
}
