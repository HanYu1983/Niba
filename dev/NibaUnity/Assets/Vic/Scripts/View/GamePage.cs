using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
namespace GameView{
	public class GamePage : AbstractView {

		public TileLayer tileLayer;

		public void OnBtnBackClick(){
			
			
		}

        public void SetTile(IModelGetter model)
        {
            List<MapObject> mapObjects = model.MapObjects;
            for( int i = 0; i < mapObjects.Count; ++i)
            {
                var mapObj = mapObjects[i];
                switch(mapObj.type){
                    case MapObjectType.Resource:
                        {
                            ResourceInfo info = model.ResourceInfos[mapObj.infoKey];
                            tileLayer.PutResource(mapObj.position,info);
                	    }
                        break;
                    case MapObjectType.Monster:
                        {
                            MonsterInfo info = model.MonsterInfos[mapObj.infoKey];
                            tileLayer.PutCreature(mapObj.position, info);
                        }
                        break;
                }
                 
            }
        }

		// Use this for initialization
		void Start () {
			tileLayer.View = View;
		}
		
		// Update is called once per frame
		void Update () {
			
		}

	}
}
