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

        public void PutItem(MapObject mapObject, IModelGetter info)
        {
            if(mapObject.type == GetValidType())
            {
                Item item = GetItemByXY(mapObject.position.x, mapObject.position.y);
                item.SetType(mapObject, info);
            }
        }

		public void PutItemWithXY(MapObject mapObject, int x, int y, IModelGetter info)
		{
            if (mapObject.type == GetValidType())
			{
				Item item = GetItemByXY(x, y);
				item.SetType(mapObject, info);
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

        Item GetItemByXY(int x, int y)
        {
            int index = View.GetIndexByXY(x, y);
            return AryItem[index];
        }

        void CreateEmptyItem(int  count = 100 )
        {
            for (int i = 0; i < count; ++i)
            {
                GameObject item = Instantiate(ItemPrefab);
                item.SetActive(true);
                item.transform.SetParent(this.transform);
                item.GetComponent<RectTransform>().localPosition = new Vector3();
                item.GetComponent<RectTransform>().localScale = new Vector3(1, 1, 1);
                AryItem.Add(item.GetComponent<Item>());
            }
        }

        private void Awake()
        {
            CreateEmptyItem(100);
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

