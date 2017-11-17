using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using Common;
namespace GameView
{
    public class View : MonoBehaviour
    {

        public static View Instance;

        public ZUIManager ZUIMgr;

        public GameObject MainLayer;
        public IModelGetter Model
        {
            get;set;
        }

        Dictionary<string, GameObject> pagePool = new Dictionary<string, GameObject>();
        GameObject currentPage;

        private void Awake()
        {
            Instance = this;
        }

        //========================= 游戲頁面的方法 ==============================

        public void SetGamePageTile()
        {
            GamePage page = CheckPage<GamePage>();
            page.SetTileWithPlayerPositionCenterExpend (Model);
        }

        public void OnTouchItem( TouchItem touchItem )
        {
            //GamePage page = CheckPage<GamePage>();
            //Position clickPos = touchItem.Position;
            //MapObject tile = page.TileLayer.GetItemByXY(clickPos.x, clickPos.y).Model;
            //IEnumerable<MapObject> objs = Model.MapObjectsAt(tile.position);
            //foreach(MapObject obj in objs)
            //{
            //    print(obj.type);
            //}
            //ZUIMgr.OpenSideMenu(ZUIMgr.AllSideMenus[0]);
        }

        public void OnWorkItemClickDo(Description workModel)
        {
            Common.Common.Notify(UIEventName.GamePage_WorkItem_BtnDo_Click, workModel);
            print("OnWorkItemClickDo");
        }
        
        //========================= 游戲頁面的方法 ==============================

        public void OpenTitlePage()
        {
            ChangeToPage(ZUIMgr.AllMenus[0]);
        }

        public void OpenGamePlayPage()
        {
            ChangeToPage(ZUIMgr.AllMenus[1]);
        }

        public void ProcessWork(Action<Exception> callback)
        {
            OpenWorkSideMenu();
            callback(null);
        }

        public void ProcessEvent(Action<Exception> callback)
        {
            var result = Model.MoveResult;
            var events = result.events;
            string showstr = "";
            foreach (var e in events)
            {
                Debug.Log(e.description);
                if (e.description == Description.EventLucklyFind)
                {
                    var itemPrototype = e.values.Get("itemPrototype");
                    var count = int.Parse(e.values.Get("count"));
					var config = ConfigItem.Get (itemPrototype);
					showstr += "獲得item:" + config.Name + " 數量:" + count + ".\n";
                }
            }
            OpenMessagePopup(showstr);
            callback(null);
        }

        public void ShowBackpack()
        {
            ZUIMgr.OpenSideMenu(ZUIMgr.AllSideMenus[0]);
            ZUIMgr.CurActiveSideMenu.GetComponent<BasicPanel>().UpdateContent();
        }

		public void HidePackpack()
		{
			ZUIMgr.CloseSideMenu ();
		}

        public void OpenMessagePopup(string msg)
        {
            ZUIMgr.OpenPopup(ZUIMgr.AllPopups[0]);
            ZUIMgr.CurActivePopup.GetComponent<MessagePopup>().SetText(msg);
        }

		public void CloseMessagePopup()
		{
			ZUIMgr.ClosePopup (ZUIMgr.AllPopups [0]);
		}

        public void OpenWorkSideMenu()
        {
            ZUIMgr.OpenSideMenu(ZUIMgr.AllSideMenus[1]);
            ZUIMgr.CurActiveSideMenu.GetComponent<BasicPanel>().UpdateContent();
        }

		public void CloseWorkSideMenu()
		{
			ZUIMgr.CloseSideMenu ();
		}

        void ChangeToPage( Menu page )
        {
            if (CheckNeedChangePage(page.gameObject))
            {
                ZUIMgr.OpenMenu(page);
                currentPage = page.gameObject;
            }
        }

        bool CheckNeedChangePage(GameObject page)
        {
            return currentPage != page;
        }

        void CreatePageAndCloseOld(string pageName, GameObject page)
        {
            if (currentPage != null)
            {
                DestroyObject(currentPage);
            }
            currentPage = page;
        }

        /// <summary>
        /// 取出實例物件，會異步加載
        /// </summary>
        /// <param name="path">Prefab路徑，可以從PrefabPath.cs找到</param>
        /// <param name="parent">要取出物件的父親</param>
        /// <param name="callback">加載完成的事件</param>
        public IEnumerator GetInstanceByPath(string path, GameObject parent, Action<GameObject> callback)
        {
            yield return GetPrefabByPath(path, (GameObject prefab) => {
                GameObject obj = Instantiate(prefab);
                obj.SetActive(true);
                obj.transform.SetParent(parent.transform);
                obj.GetComponent<RectTransform>().localPosition = new Vector3();
                obj.GetComponent<RectTransform>().localScale = new Vector3(1, 1, 1);
                callback(obj);
            });
        }

        /// <summary>
        /// 取出prefab，會異步加載
        /// </summary>
        /// <param name="path">Prefab路徑，可以從PrefabPath.cs找到</param>
        /// <param name="callback">加載完成的事件</param>
        public IEnumerator GetPrefabByPath(string path, Action<GameObject> callback)
        {
            if (pagePool.ContainsKey(path))
            {
                callback(pagePool[path]);
                yield return null;
            }
            else
            {
                yield return LoadPrefab(path, (GameObject asset) => {
                    callback(pagePool[path]);
                });
            }
        }


        /// <summary>
        /// 切換頁面，這些頁面會共用同一個Layer
        /// </summary>
        /// <param name="pageName">Prefab路徑，可以從PrefabPath.cs找到</param>
        public IEnumerator ChangeToPage(string pageName, Action<GameObject> callback)
        {
            yield return GetInstanceByPath(pageName, MainLayer, (obj) => {
                CreatePageAndCloseOld(pageName, obj);
                callback(obj);
            });
        }

        IEnumerator LoadPrefab(string path, Action<GameObject> callback)
        {
            ResourceRequest request = Resources.LoadAsync(path);
            yield return request;
            pagePool.Add(path, request.asset as GameObject);
            callback(request.asset as GameObject);
        }

        T CheckPage<T>()
        {
            T page = currentPage.GetComponent<T>();
            if (page == null)
            {
                throw new Exception("不合法的頁面，應該要在正確的頁面才能呼叫");
            }
            return page;
        }

        /// <summary>
        /// 從一維轉二維
        /// </summary>
        public static int GetIndexByXY( int x, int y )
        {
            return y * 10 + x;
        }

        /// <summary>
        /// 從二維轉一維
        /// </summary>
        public static Position GetXYByIndex( int index )
        {
            Position pos = new Position();
            pos.x = index % 10;
            pos.y = (int)(index / 10);
            return pos;
        }

        
    }
}
