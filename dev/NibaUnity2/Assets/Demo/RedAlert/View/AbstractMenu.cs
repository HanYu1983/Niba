using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RedAlert
{
    public interface IDataProvider
    {
        void Prepared();
        int Count { get; }
        void UpdateView(int i, GameObject row);
    }

    public class AbstractMenu : MonoBehaviour
    {
        public GameObject rowPrefab;
        public GameObject root;
        public List<GameObject> rows;

        private void Start()
        {
            UpdateView();
        }

        public void UpdateView()
        {
            foreach(var r in rows)
            {
                Destroy(r);
            }
            rows.Clear();

            var provider = GetComponent<IDataProvider>();
            provider.Prepared();
            for(var i=0; i<provider.Count; ++i)
            {
                var row = Instantiate(rowPrefab, root.transform, false);
                provider.UpdateView(i, row);
                rows.Add(row);
            }
        }
    }
}