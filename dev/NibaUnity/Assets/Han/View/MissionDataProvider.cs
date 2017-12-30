using System;
using Common;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Linq;

namespace View
{
	public class MissionDataProvider : MonoBehaviour, ListView.IDataProvider
	{
		public int DataCount{ 
			get{ 
				return data.Count;
			}
		}

		public void ShowData(GameObject ui, int idx){
			var item = data [idx];
			var cfg = ConfigNpcMission.Get (item);

		}

		public void ShowSelect (GameObject ui, int idx){
			if (idx <0 || idx >= DataCount) {
				ui.GetComponent<Text>().text = "你沒有選擇任何道具";
				return;
			}
			var item = data [idx];
			var cfg = ConfigNpcMission.Get (item);
		}

		/// <summary>
		/// 顯示用的資料，在呼叫UpdateUI前要先設定
		/// </summary>
		List<string> data;
		public List<string> Data{
			set{
				data = value;
			}
			get{
				return data;
			}
		}
	}
}

