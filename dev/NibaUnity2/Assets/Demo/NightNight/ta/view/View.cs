using UnityEngine;
using System.Collections;
using System.Collections.Generic;

namespace NN{
public class View : SenderMono, IView {
	Dictionary<UIType, GameObject> pages = new Dictionary<UIType, GameObject>();

	public GameObject prefab_mainPage;
	public GameObject prefab_playPage;
	public GameObject prefab_rankPage;
	public GameObject prefab_resultPage;
	public GameObject prefab_pausePanel;

	// Use this for initialization
	protected override void Start () {
		base.Start ();
		OpenTargetPage ( UIType.MainPage );
	}

	public void AddCard( IDeck deck, IDeckPlayer player, ICard card ){
		if (!pages.ContainsKey (UIType.PlayPage))	throw new UnityException ("You should at playPage");
		PlayPage playPage = pages [UIType.PlayPage].GetComponent<PlayPage> ();
		playPage.DealCard (deck, player, card);
	}

	public void PushCardToTable( IDeck deck, IDeckPlayer player, ICard card ){
		if (!pages.ContainsKey (UIType.PlayPage))	throw new UnityException ("You should at playPage");
		PlayPage playPage = pages [UIType.PlayPage].GetComponent<PlayPage> ();
		playPage.PushCardToTable (deck, player, card);
	}

	public void GameNumberChanged(IGameState state, int number){
		if (!pages.ContainsKey (UIType.PlayPage))	throw new UnityException ("You should at playPage");
		PlayPage playPage = pages [UIType.PlayPage].GetComponent<PlayPage> ();
		playPage.GameNumberChanged (state, number);
	}
	
	public void DirectionChanged(IGameState state, Direction direction){
		if (!pages.ContainsKey (UIType.PlayPage))	throw new UnityException ("You should at playPage");
		PlayPage playPage = pages [UIType.PlayPage].GetComponent<PlayPage> ();
		playPage.DirectionChanged (state, direction);
	}

	public void OnCurrentPlayerChange(IMatch match, IOption<IPlayer> player){
		if (!pages.ContainsKey (UIType.PlayPage))	throw new UnityException ("You should at playPage");
		PlayPage playPage = pages [UIType.PlayPage].GetComponent<PlayPage> ();
		playPage.OnCurrentPlayerChange (match, player);    
	}

	public void OpenTargetPage( UIType pn ){
		if (pages.ContainsKey(pn))	return;
		GameObject p = null;
		switch (pn) {
		case UIType.MainPage:
			p = (GameObject)Instantiate( prefab_mainPage, this.transform.position, this.transform.rotation ); 
			break;
		case UIType.PlayPage:
			p = (GameObject)Instantiate( prefab_playPage, this.transform.position, this.transform.rotation );
			break;
		case UIType.ResultPage:
			p = (GameObject)Instantiate( prefab_resultPage, this.transform.position, this.transform.rotation );
			break;
		case UIType.RankPage:
			p = (GameObject)Instantiate( prefab_rankPage, this.transform.position, this.transform.rotation );
			break;
		case UIType.PausePanel:
			p = (GameObject)Instantiate( prefab_pausePanel, this.transform.position, this.transform.rotation );
			break;
		default: break;
		}
		p.transform.parent = this.transform;
		pages.Add (pn, p);
	}

	public void CloseTargetPage( UIType pn ){
		if (pages [pn] == null)	return;
		Destroy ( pages [pn]);
		pages.Remove (pn);
	}

	protected override bool HandleVerifyReceiverDelegate (object receiver){
		bool isTarget = typeof(IViewInject).IsAssignableFrom (receiver.GetType ());
		if (isTarget) {
			((IViewInject)receiver).view = this;
		}
		return false;
	}
}
}