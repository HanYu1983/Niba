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

		public void SetTileWithPlayerPositionCenterExpend(IModelGetter model)
		{
			MapObject[,] mapObjs;
			var leftTop = model.MapPlayer.position.Add (-5, -5).Max (0, 0);
			var rightBottom = leftTop.Add(10, 10).Min(model.MapWidth, model.MapHeight);
			Common.Common.FlattenMapObjects(model, MapObjectType.Resource, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var mapObj = mapObjs[x,y];
					if(mapObj.type == MapObjectType.Unknown){
						// 不可視的tile
						continue;
					}
					TileLayer.PutItemWithXY (mapObj, x, y, model);
				}
			}

			Common.Common.FlattenMapObjects(model, MapObjectType.Monster, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var mapObj = mapObjs[x,y];
					/*if(mapObj.type == MapObjectType.Unknown){
						// 不可視的tile
						continue;
					}*/
					CreatureLayer.PutItemWithXY (mapObj, x, y, model);
				}
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
