using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace View{
	public class MissionPopup : MonoBehaviour {
		public ListView listView;
		public MissionDataProvider missionDataProvider;

		void Awake(){
			listView.DataProvider = missionDataProvider;
		}
	}
}