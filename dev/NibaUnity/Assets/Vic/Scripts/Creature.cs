using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Common;
using System;

namespace GameView
{
    public class Creature : Item
    {
        public GameObject CreatureFace;
        public Text Txt_type;

        public override void SetType(MapObject mapObject, IModelGetter model)
        {
            MonsterInfo info = model.MonsterInfos[mapObject.infoKey];
            string creatureName = "";
            bool showCreature = false;
            switch (info.type)
            {
                case 1:
                    creatureName = "蝶";
                    showCreature = true;
                    break;
                case 2:
                    creatureName = "狗";
                    showCreature = true;
                    break;
                default:
                    throw new Exception("沒有處理到的怪物類型，請加上, type: " + info.type);
                    break;

            }
            Txt_type.text = creatureName;
            CreatureFace.SetActive(showCreature);
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
    }
}