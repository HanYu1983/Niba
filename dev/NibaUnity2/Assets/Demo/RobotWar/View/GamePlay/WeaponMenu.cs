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
        public const string MENU_CANCEL = "MENU_CANCEL";

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
                var row = Instantiate(rowPrefab, rowRoot, false);
                if (w == MENU_CANCEL)
                {
                    row.GetComponentInChildren<Text>().text = "Cancel";
                }
                else
                {
                    var weaponObj = model.mapCtx.weapons[w];
                    var cfg = ConfigWeapon.Get(weaponObj.prototype);
                    var title = string.Format("{0} {1}~{2} {3}", cfg.name, cfg.minRange, cfg.maxRange, cfg.shape);
                    row.GetComponentInChildren<Text>().text = title;
                }
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