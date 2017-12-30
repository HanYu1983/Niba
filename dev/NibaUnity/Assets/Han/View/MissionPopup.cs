using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
using System.Linq;
using System;

namespace View{
	public class MissionPopup : MonoBehaviour {
		public ListView listView;
		public MissionDataProvider missionDataProvider;

		void Awake(){
			listView.DataProvider = missionDataProvider;
		}

		public void UpdateMissionList(IModelGetter model){
			missionDataProvider.Data = model.AvailableNpcMissions.ToList ();
			listView.UpdateDataView (model);
			listView.CurrItemLabel (model, listView.offset);
		}

		public IEnumerator HandleCommand(IModelGetter model, string msg, object args, Action<Exception> callback){
			switch (msg) {
			default:
				{
					if (msg.Contains (listView.CommandPrefix)) {
						yield return listView.HandleCommand (model, msg, args, callback);
					}
				}
				break;
			}
			yield return null;
		}
	}
}