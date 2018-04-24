using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;

namespace Bird
{
    public class PageManager : MonoBehaviour
    {
        public List<GameObject> pages;

        public GameObject OpenPage(string name)
        {
            var find = pages.Where(o => o.name == name).FirstOrDefault();
            if(find == null)
            {
                throw new System.Exception("page not found:" + name);
            }
            ClosePage();
            find.SetActive(true);
            return find;
        }

        public void ClosePage()
        {
            foreach (var o in pages)
            {
                o.SetActive(false);
            }
        }
    }
}