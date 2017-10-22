using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
namespace GameView{
	public class GamePage : AbstractView {

		public ItemLayer TileLayer;
        public ItemLayer CreatureLayer;

		public void OnBtnBackClick(){
			
			
		}

        public void OnBtnMoveClick( int dir)
        {
            string eventName = "";
            switch (dir)
            {
                case 0:
                    eventName = "GamePage_btnMove_left";
                    break;
                case 1:
                    eventName = "GamePage_btnMove_up";
                    break;
                case 2:
                    eventName = "GamePage_btnMove_right";
                    break;
                case 3:
                    eventName = "GamePage_btnMove_down";
                    break;
            }
            Common.Common.Notify(eventName, null);
        }

        public void SetTile(IModelGetter model)
        {
            List<MapObject> mapObjects = model.MapObjects;
            for( int i = 0; i < mapObjects.Count; ++i)
            {
                var mapObj = mapObjects[i];
                TileLayer.PutItem(mapObj, model);
                CreatureLayer.PutItem(mapObj, model);
            }
        }

		// Use this for initialization
		void Start () {
			TileLayer.View = View;
            CreatureLayer.View = View;
        }
		
		// Update is called once per frame
		void Update () {
			
		}

	}
}
