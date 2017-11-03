using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Model;
using Common;
using System;

namespace GameView {
    public class Tile : Item
    {
        public Text txt_type;

        public override void SetType(MapObject mapObject, IModelGetter model)
        {
            ResourceInfo info = model.ResourceInfos[mapObject.infoKey];
			var config = ConfigResource.Get (info.type);
			var typeName = config.Name;
			/*
            var typeName = "";
            switch (info.type)
            {
                case "1":
                    typeName = "草";
                    break;
                case "2":
                    typeName = "石";
                    break;
                case "3":
                    typeName = "天";
                    break;
                case "4":
                    typeName = "樹";
                    break;
                case "0":
                    typeName = "";
                    break;
                default:
                    throw new Exception("沒有處理到的怪物類型，請加上, type: " + info.type);
                    break;
            }
            */
            txt_type.text = typeName;
        }

        public override void Clear()
        {
            txt_type.text = "";
        }

        private void Awake()
        {
            Clear();
        }
    }

}
