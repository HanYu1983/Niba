using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Model;
using Common;

namespace GameView {
    public class Tile : Item
    {
        public Text txt_type;

        public override void SetType(MapObject mapObject, IModelGetter model)
        {
            ResourceInfo info = model.ResourceInfos[mapObject.infoKey];
            print(info.type);
            var typeName = "";
            switch (info.type)
            {
                case 1:
                    typeName = "草";
                    break;
                case 2:
                    typeName = "石";
                    break;
                case 3:
                    typeName = "天";
                    break;
                case 4:
                    typeName = "樹";
                    break;
                case 0:
                    typeName = "";
                    break;
            }
            txt_type.text = typeName;
        }
        
        private void Awake()
        {
            txt_type.text = "";
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
