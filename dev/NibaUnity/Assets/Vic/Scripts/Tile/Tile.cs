using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Model;
using Common;
using System;
using HanRPGAPI;

namespace GameView {
    public class Tile : Item
    {
        public Text txt_type;

        public override void SetType()
        {
            ResourceInfo info = View.Instance.Model.ResourceInfos[Model.infoKey];
			var config = ConfigResource.Get (info.type);
			var typeName = config.Name;
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
