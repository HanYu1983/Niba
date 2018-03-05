using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace NightmarketAssistant
{
    public class CreateBoothRow : MonoBehaviour
    {
        public BoothListHolder holder;
        public GameObject boothRow;
        public List<GameObject> rows;

        private void Start()
        {
            if (boothRow != null)
            {
                foreach(var r in rows)
                {
                    Destroy(r);
                }
                rows.Clear();

                for (var i = 0; i < holder.list.Count; ++i)
                {
                    var data = holder.list[i];
                    var row = Instantiate(boothRow, transform, false);
                    row.GetComponent<BoothHolder>().booth = data;
                    row.SetActive(true);

                    rows.Add(row);
                }
            }
        }

        private void OnEnable()
        {
            Start();
        }
    }
}