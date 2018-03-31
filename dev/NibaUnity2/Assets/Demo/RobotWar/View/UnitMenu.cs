using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using UnityEngine.UI;
using UnityEngine.Events;

namespace RobotWar
{
    public enum UnitMenuItem
    {
        Pending, Move, Attack, Status, Pass, Cancel, CancelMove
    }

    public class UnitMenu : Menu<UnitMenuItem>
    {
        public GameObject rowPrefab;
        public Transform rowRoot;

        public override void Select(int idx)
        {
            base.Select(idx);
        }

        List<GameObject> rows = new List<GameObject>();
        public void CreateMenu(Model model, List<UnitMenuItem> menu)
        {
            this.menu = menu;
            foreach (var r in rows)
            {
                Destroy(r);
            }
            rows.Clear();

            for (var i = 0; i < menu.Count; ++i)
            {
                var w = menu[i];
                var row = Instantiate(rowPrefab, rowRoot, false);
                var title = w.ToString();
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