using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Model;
using Common;
namespace GameView
{
    public class ItemLayer : AbstractView
    {
        public GameObject ItemPrefab;
        List<Item> AryItem = new List<Item>();

        public void PutItem(MapObject mapObject)
        {
            if(mapObject.type == GetValidType())
            {
                Item item = GetItemByXY(mapObject.position.x, mapObject.position.y);
                item.Model = mapObject;
            }
        }

		public void PutItemWithXY(MapObject mapObject, int x, int y)
		{
            if (mapObject.type == GetValidType())
			{
				Item item = GetItemByXY(x, y);
                item.Model = mapObject;
			}
		}

        internal virtual MapObjectType GetValidType()
        {
            return MapObjectType.Unknown;
        }

        public void ClearAllItem()
        {
            foreach (Item item in AryItem) item.Clear();
        }

        public Item GetItemByXY(int x, int y)
        {
            int index = View.GetIndexByXY(x, y);
            return AryItem[index];
        }

        void CreateEmptyItem(int  count = 100 )
        {
            for (int i = 0; i < count; ++i)
            {
                GameObject itemObj = Instantiate(ItemPrefab);
                itemObj.SetActive(true);
                itemObj.transform.SetParent(this.transform);
                itemObj.GetComponent<RectTransform>().localPosition = new Vector3();
                itemObj.GetComponent<RectTransform>().localScale = new Vector3(1, 1, 1);

                Item item = itemObj.GetComponent<Item>();
                item.Index = i;
                AryItem.Add(item);
            }
        }
        
        private void Awake()
        {
            CreateEmptyItem(100);
        }

        private void Start()
        {

        }
    }
}

