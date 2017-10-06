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
		MapDataStore store = new MapDataStore ();
		store.GenMap (MapType.Unknown, 5, 5);
		var godKey = store.GenObject (MapObjectType.Resource, "god");
		var godObject = store.items [godKey];
		var godInfo = store.resourceInfo [godObject.infoKey];
		godInfo.type = ResourceType.Grass;
		store.resourceInfo [godObject.infoKey] = godInfo;

		store.GenMonster (godKey, true, MonsterType.Bufferfly);

		var memonto1 = store.GetMemonto ();
		Debug.Log (memonto1);

		MapDataStore store2 = MapDataStore.FromMemonto (memonto1);
		var memonto2 = store2.GetMemonto ();
		Debug.Log (memonto2);

		if (memonto1 != memonto2) {
			throw new UnityException ("store not match!");
		}
	}

	void TestItem(){
		MapDataStore store = new MapDataStore ();
		store.GenMap (MapType.Unknown, 5, 5);
		store.GenObject (MapObjectType.Resource, "god");
		try{
			store.GenObject (MapObjectType.Resource, "god");
		}catch(UnityException e){
			if (e.Message.StartsWith ("item already exists") == false) {
				throw e;
			}
		}
		var itemKey = store.GenObject (MapObjectType.Monster, null);
		MapObject item = store.items [itemKey];
		item.position.x = 5;
		item.position.y = 100;
		store.items [itemKey] = item;

		var memonto1 = store.GetMemonto ();
		MapDataStore store2 = MapDataStore.FromMemonto (memonto1);
		item = store.items [itemKey];
		if (item.position.x != 5 || item.position.y != 100) {
			throw new UnityException ("position not right!");
		}
	}
}
