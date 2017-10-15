using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
using Common;

namespace GameView{
	public class TileLayer : AbstractView {

		public GameObject TilePrefab;

		public void PutResource(Position position, ResourceInfo info)
        {
            print("PutResource info: " + info.type + ", position:" + position.x + ":"+ position.y);
        }

        public void PutCreature(Position position, MonsterInfo info)
        {
            print("PutCreature， info: " + info.type + ", position:" + position + ":" + position.y);
        }

		// Use this for initialization
		void Start () {
            
		}
		
		// Update is called once per frame
		void Update () {
			
		}
	}
}
