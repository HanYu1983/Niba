using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using UnityEngine.Events;

namespace RobotWar
{
    public class WeaponMenu : Menu<string>
    {
        public GameObject rowPrefab;
        public Transform rowRoot;

        public override void Select(int idx)
        {
            base.Select(idx);
        }

        List<GameObject> rows = new List<GameObject>();
        public void CreateMenu(Model model, List<string> menu)
        {
            this.menu = menu;
            foreach(var r in rows)
            {
                Destroy(r);
            }
            rows.Clear();

            for(var i=0; i<menu.Count; ++i)
            {
                var w = menu[i];
                var cfg = new ConfigWeapon();
                var title = string.Format("{0} {1}~{2} {3}", cfg.name, cfg.minRange, cfg.maxRange, cfg.shape);
                var row = Instantiate(rowPrefab, rowRoot, false);
                row.GetComponentInChildren<Text>().text = title;
                row.GetComponent<Button>().onClick.AddListener(Fn(i));
                rows.Add(row);
                row.SetActive(true);
            }
        }

        UnityAction Fn(int idx)
        {
            return () =>
            {
                Debug.Log(idx);
                Select(idx);
            };
        }
    }
}