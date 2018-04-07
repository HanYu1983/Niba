using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace HanUtil
{
    public class ShowPageList<T, Ref> : MonoBehaviour where Ref : ObjectRef<T>
    {
        public Transform root;
        public int offset;
        public int selected;

        public bool autoUpdate;

        private void Start()
        {
            if (autoUpdate)
            {
                UpdateView();
            }
        }



        public int DataCountPerPage
        {
            get
            {
                return root.childCount;
            }
        }

        public void Select(Ref r)
        {
            selected = r.idx;
        }

        public void Left()
        {
            offset -= DataCountPerPage;
            UpdateView();
        }

        public void Right()
        {
            offset += DataCountPerPage;
            UpdateView();
        }

        public virtual List<T> GetList()
        {
            return new List<T>();
        }

        public void UpdateView(GameObject go, List<T> list, int idx)
        {
            var r = go.GetComponent<Ref>();
            if (idx < list.Count)
            {
                r.refType = ObjectRefType.Array;
                r.idx = idx;
                r.array = list;
                r.OnValueChange();
            }
            else
            {
                r.refType = ObjectRefType.Static;
                r.value = default(T);
                r.OnValueChange();
            }
        }

        public void UpdateView()
        {
            var list = GetList();
            for(var i=0; i< DataCountPerPage; ++i)
            {
                var idx = offset + i;
                UpdateView(root.GetChild(i).gameObject, list, idx);
            }
        }
    }
}