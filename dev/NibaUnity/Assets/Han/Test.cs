using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
using Common;
using System.Linq;
using System;

public class Test : MonoBehaviour {
	void Start () {
		TestDataStore ();
		TestItem ();
		TestWork ();
	}

	void TestDataStore(){
		MapDataStore store = new MapDataStore ();
		store.GenMap (MapType.Unknown, 5, 5);
		var godKey = store.GenObject (MapObjectType.Resource, "god");
		var godObject = store.mapObjects [godKey];
		var godInfo = store.resourceInfo [godObject.infoKey];
		godInfo.type = 2;
		store.resourceInfo [godObject.infoKey] = godInfo;

		store.GenMonster (godKey, true, 1);

		store.VisitPosition (Position.Zero, 3);

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
		MapObject item = store.mapObjects [itemKey];
		item.position.x = 5;
		item.position.y = 100;
		store.mapObjects [itemKey] = item;

		item = store.mapObjects [itemKey];
		if (item.position.x != 5 || item.position.y != 100) {
			throw new UnityException ("position not right!");
		}
	}

	void TestWork(){
		var store = new MapDataStore ();
		var player = new PlayerDataStore ();
		store.GenMap (MapType.Unknown, 5, 5);
		var works = store.GetWorks (player);
		/*
		if (works.Count () != 0) {
			throw new UnityException ("一開始必須沒有工作");
		}
		// 新增一個資源
		var res1key = store.GenObject (MapObjectType.Resource, null);
		var res1 = store.mapObjects [res1key];
		var res1Info = store.resourceInfo [res1.infoKey];
		// 修改內容
		res1.position = Position.Zero;
		res1Info.type = 1;
		// 重設回去
		store.resourceInfo [res1.infoKey] = res1Info;
		store.mapObjects [res1.key] = res1;
		*/
		works = store.GetWorks (player);
		if (works.Count () != 1) {
			throw new UnityException ("必須有1個工作");
		}

		var firstWork = works.First ();
		if (firstWork.description != Description.WorkCollectResource) {
			throw new UnityException ("必須是收集資源工作");
		}

		store.StartWork (player, firstWork);
		if (player.playerInMap.IsWorking == false) {
			throw new UnityException ("必須是工作狀態");
		}
		try{
			store.StartWork(player, firstWork);
		}catch(Exception e){
			if (e is MessageException == false) {
				throw new UnityException ("同時開始2份工作時必須丟出MessageException例外");
			}
		}
		store.CancelWork (player);
		if (player.playerInMap.IsWorking) {
			throw new UnityException ("取消工作後必須沒有工作狀態");
		}
		try{
			store.ApplyWork(player);
		}catch(Exception e){
			if (e is MessageException == false) {
				throw new UnityException ("沒工作時就應用工作必須丟出MessageException例外");
			}
		}

		store.StartWork(player, firstWork);
		store.ApplyWork(player);

		var res1 = store.mapObjects [0];
		if (res1.died == false) {
			throw new UnityException ("資源必須被消費");
		}
	}
}
