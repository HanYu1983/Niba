using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Common;
using System;
using HanRPGAPI;

namespace GameView
{
    public class Creature : Item
    {
        public GameObject CreatureFace;
        public Text Txt_type;

        public override void SetType()
        {
            MonsterInfo info = View.Instance.Model.MonsterInfos[Model.infoKey];
			try{
				var config = ConfigMonster.Get (info.type);
				string creatureName = config.Name;
				Txt_type.text = creatureName;
				CreatureFace.SetActive(true);
			}catch(Exception){
				CreatureFace.SetActive(false);
				throw new Exception("沒有處理到的怪物類型，請加上, type: " + info.type);
			}
        }

        public override void Clear()
        {
            Txt_type.text = "";
            CreatureFace.SetActive(false);
        }

        private void Awake()
        {
            Clear();
        }

        void OnMouseUp()
        {
            Debug.Log("Drag ended!");
        }
    }
}