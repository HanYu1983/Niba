﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Niba;
using System.Linq;
using System;

namespace Niba
{
	public class MissionPopup : MonoBehaviour {
		public ListView listView;
		public MissionDataProvider missionDataProvider;

		void Awake(){
			listView.DataProvider = missionDataProvider;
		}

		public int CurrMissionIndex(string cmd) {
			return listView.CurrIndex (cmd);
		}

		public List<string> CurrMissionData{
			get{
				return missionDataProvider.Data;
			}
		}

		public void UpdateMissionList(Model model){
			missionDataProvider.Data = model.AvailableNpcMissions.ToList ();
			listView.UpdateDataView (model);
			listView.CurrItemLabel (model, listView.LastSelectIndex);
		}

		public IEnumerator HandleCommand(Model model, string msg, object args, Action<Exception> callback){
			switch (msg) {
			case "click_missionPopup_complete":
				{
					var selectIdx = listView.LastSelectIndex;
					var missionId = missionDataProvider.Data [selectIdx];
                    Niba.Common.Notify ("missionPopup_completeMission", missionId);
				}
				break;
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