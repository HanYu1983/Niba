using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Common;

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
                case 0:
                    creatureName = "";
                    showCreature = false;
                    break;
            }
            Txt_type.text = creatureName;
            CreatureFace.SetActive(showCreature);
        }

        private void Awake()
        {
            Txt_type.text = "";
        }

        // Use this for initialization
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {

        }
    }
}