using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

public class View : MonoBehaviour {

	public GameObject MainLayer;
	public Action<String,View> OnChangePage;

	Dictionary<string,GameObject> pagePool = new Dictionary<string, GameObject> ();
	GameObject currentPage;

	public void ChangeToPage( string pageName ){
		print (pageName);

		if (pagePool.ContainsKey (pageName)) {
			CreatePageAndCloseOld (pageName);
		} else {
			StartCoroutine (LoadPrefab (pageName, ( GameObject asset ) => {
				CreatePageAndCloseOld (pageName);
			}));
		}
	}

	void Start(){
		ChangeToPage ("Prefabs/TitlePage");
	}

	void CreatePageAndCloseOld( String pageName ){
		GameObject pagePrefab = pagePool [pageName];
		if (currentPage != null) {
			DestroyObject (currentPage);
		}
		GameObject page = Instantiate (pagePrefab);
		page.SetActive (true);
		page.transform.SetParent (MainLayer.transform);
		page.GetComponent<AbstractView> ().View = this;
		page.GetComponent<RectTransform> ().localPosition = new Vector3 ();
		page.GetComponent<RectTransform> ().localScale = new Vector3 (1,1,1);

		currentPage = page;

		if (OnChangePage != null)
			OnChangePage.Invoke (pageName, this);
	}

	IEnumerator LoadPrefab(  string path, Action<GameObject> callback ) {
		ResourceRequest request = Resources.LoadAsync(path);
		yield return request;
		pagePool.Add (path, request.asset as GameObject);
		callback (request.asset as GameObject);
	}
}
