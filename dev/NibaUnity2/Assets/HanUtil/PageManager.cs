using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace HanUtil
{
    public class PageManager : MonoBehaviour
    {
        public List<string> names;
        public string[] paths;
        public Transform root;
        public string startPage;

        public GameObject currPage;

        private void Start()
        {
            if (string.IsNullOrEmpty(startPage) == false)
            {
                ChangePage(startPage);
            }
        }

        public IEnumerator UnloadPageAsync()
        {
            if(currPage != null)
            {
                Destroy(currPage);
                currPage = null;
            }
            yield return 0;
        }

        public IEnumerator ChangePageAsync(string name)
        {
            var idx = names.IndexOf(name);
            if(idx == -1)
            {
                throw new System.Exception("no page:"+name);
            }
            yield return UnloadPageAsync();
            var req = Resources.LoadAsync(paths[idx]);
            yield return req;
            var prefab = req.asset;
            var page = Instantiate(prefab, root, false) as GameObject;
            page.SetActive(true);
            currPage = page;
        }
        
        public void ChangePage(string name)
        {
            StartCoroutine(ChangePageAsync(name));
        }
    }
}