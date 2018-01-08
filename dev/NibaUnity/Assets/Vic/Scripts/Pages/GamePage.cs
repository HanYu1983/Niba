using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;
namespace GameView{
	public class GamePage : MonoBehaviour {

		public ItemLayer TileLayer;
        public ItemLayer CreatureLayer;
        public ItemLayer TouchLayer;

        public void SetTile(IModelGetter model)
        {
            List<MapObject> mapObjects = model.MapObjects;
            for( int i = 0; i < mapObjects.Count; ++i)
            {
                var mapObj = mapObjects[i];
                TileLayer.PutItem(mapObj);
                CreatureLayer.PutItem(mapObj);
            }
        }

		public void SetTileWithPlayerPositionCenterExpend(IModelGetter model)
		{
			/*
            TileLayer.ClearAllItem();
            CreatureLayer.ClearAllItem();

			MapObject[,] mapObjs;
			//var leftTop = model.MapPlayer.position.Add (-5, -5).Max (0, 0);
			//var rightBottom = leftTop.Add(10, 10).Min(model.MapWidth, model.MapHeight);
			var leftTop = model.MapPlayer.position.Add (-5, -5);//.Max (0, 0);
			var rightBottom = leftTop.Add(10, 10);//.Min(model.MapWidth, model.MapHeight);
			Common.Common.FlattenMapObjects(model, MapObjectType.Resource, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var mapObj = mapObjs[x,y];
					if(mapObj.type == MapObjectType.Unknown){
						continue;
					}
					TileLayer.PutItemWithXY (mapObj, x, y);
				}
			}

			Common.Common.FlattenMapObjects(model, MapObjectType.Monster, leftTop, rightBottom, out mapObjs);
			for (var x = 0; x < mapObjs.GetLength (0); ++x) {
				for (var y = 0; y < mapObjs.GetLength (1); ++y) {
					var mapObj = mapObjs[x,y];
					if(mapObj.type == MapObjectType.Unknown){
						continue;
					}
					CreatureLayer.PutItemWithXY (mapObj, x, y);
				}
			}
			*/
		}
        
	}
}
