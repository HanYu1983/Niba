using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;

public class Test : MonoBehaviour {

	void Start () {
		TestDataStore ();
		TestItem ();
	}

	void TestDataStore(){
		TempDataStore store = new TempDataStore ();
		store.GenMap (MapType.Test, 5, 5);

		var pos = new Position ();
		store.GenItem (ItemType.Grass, ItemLayer.Background, pos, "god");

		Debug.Log (store.GetMemonto ());

		var memonto1 = store.GetMemonto ();
		Debug.Log (memonto1);

		TempDataStore store2 = TempDataStore.FromMemonto (memonto1);
		var memonto2 = store2.GetMemonto ();

		Debug.Log (memonto2);

		if (memonto1 != memonto2) {
			throw new UnityException ("store not match!");
		}
	}

	void TestItem(){
		TempDataStore store = new TempDataStore ();
		store.GenMap (MapType.Test, 5, 5);

		var pos = new Position ();
		store.GenItem (ItemType.Grass, ItemLayer.Background, pos, "god");

		try{
			store.GenItem (ItemType.Grass, ItemLayer.Background, pos, "god");
		}catch(UnityException e){
			if (e.Message.StartsWith ("item already exists") == false) {
				throw e;
			}
		}
		var itemKey = store.GenItem (ItemType.Tree, ItemLayer.Foreground, pos, null);
		Item item;
		if (store.GetItem (itemKey, out item) == false) {
			throw new UnityException ("must have item");
		}
		item.position.x = 5;
		item.position.y = 100;

		var memonto1 = store.GetMemonto ();
		Debug.Log (memonto1);
	}
}
