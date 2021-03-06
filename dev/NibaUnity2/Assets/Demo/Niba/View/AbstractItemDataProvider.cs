﻿using System;
using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;

namespace Niba
{
	public class AbstractItemDataProvider : MonoBehaviour, ListView.IDataProvider
	{
		public int DataCount{ 
			get{ 
				return data.Count;
			}
		}

		public void ShowData(Model model, GameObject ui, int idx){
			var modelItem = data [idx];
			var msg = string.Format ("{0}{1}個", modelItem.prototype, modelItem.count);
			ui.GetComponentInChildren<Text> ().text = msg;
			ui.SetActive (true);
		}

		public void ShowSelect (Model model, GameObject ui, int idx){
			
		}

		/// <summary>
		/// 顯示用的資料，在呼叫UpdateUI前要先設定
		/// </summary>
		List<AbstractItem> data;
		public List<AbstractItem> Data{
			set{
				data = value;
			}
			get{
				return data;
			}
		}
	}
}

