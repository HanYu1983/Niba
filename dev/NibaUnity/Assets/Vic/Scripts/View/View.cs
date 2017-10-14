using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace GameView{
	public class View : MonoBehaviour {

		public GameObject MainLayer;
		public Action<String,View> OnChangePage;

		Dictionary<string,GameObject> pagePool = new Dictionary<string, GameObject> ();
		GameObject currentPage;

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
                if (obj.GetComponent<AbstractView>() != null)
                {
                    obj.GetComponent<AbstractView>().View = this;
                }
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

        void CreatePageAndCloseOld( string pageName, GameObject page ){
			if (currentPage != null) {
				DestroyObject (currentPage);
			}
			currentPage = page;
			if (OnChangePage != null) {
				OnChangePage.Invoke (pageName, this);
			}
		}

		IEnumerator LoadPrefab( string path, Action<GameObject> callback ) {
			ResourceRequest request = Resources.LoadAsync(path);
			yield return request;
			pagePool.Add (path, request.asset as GameObject);
			callback (request.asset as GameObject);
		}
	}
}
