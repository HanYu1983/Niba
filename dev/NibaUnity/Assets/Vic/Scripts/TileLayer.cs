using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;

namespace GameView{
	public class TileLayer : AbstractView {

        public GameObject TilePrefab;
        List<Tile> AryTile = new List<Tile>();

		public void PutResource(Position position, ResourceInfo info)
        {
            Tile tile = GetTileByXY(position.x, position.y);
            if (tile != null)
            {
                tile.SetType(info.type);
            }
        }

        Tile GetTileByXY(int x, int y)
        {
            int index = View.GetIndexByXY(x, y);
            return AryTile[index];
        }

        void CreateEmptyTile()
        {
            for (int i = 0; i < 100; ++i)
            {
                GameObject tile = Instantiate(TilePrefab);
                tile.SetActive(true);
                tile.transform.SetParent(this.transform);
                tile.GetComponent<RectTransform>().localPosition = new Vector3();
                tile.GetComponent<RectTransform>().localScale = new Vector3(1,1,1);

                AryTile.Add(tile.GetComponent<Tile>());
            }
        }

        private void Awake()
        {
            CreateEmptyTile();
        }
        // Use this for initialization
        void Start () {
            
        }
		
		// Update is called once per frame
		void Update () {
			
		}
	}
}
