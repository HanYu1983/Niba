﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using HanUtil;
using System.Linq;

namespace RobotWar
{
    public class View : MonoBehaviour
    {
        #region map
        public GameObject gridPrefab;
        public Transform gridRoot;
        public int gridWidth, gridHeight;
        Dictionary<string, GridView> gridView = new Dictionary<string, GridView>();

        public void Sync(Model model)
        {
            gridView.Clear();
            foreach (var g in model.mapCtx.grids.Values)
            {
                var go = Instantiate(gridPrefab, gridRoot, false);
                var pos = go.transform.localPosition;
                pos.x = g.pos.x * gridWidth;
                pos.z = g.pos.y * gridHeight;
                go.transform.localPosition = pos;

                var gv = go.GetComponent<GridView>();
                gv.coord = g.pos;
                gv.UpdateView(model);
                gridView.Add(gv.Key, gv);

                go.SetActive(true);
            }
            foreach(var uk in model.mapCtx.unit2Grid.Keys)
            {
                var gk = model.mapCtx.unit2Grid[uk];
                var g = model.mapCtx.grids[gk];
                CreateUnit(model, uk, g.pos);
            }
        }

        public void SetGridColor(IEnumerable<Grid> grids, Color color)
        {
            if(grids == null)
            {
                foreach (var gv in gridView.Values)
                {
                    gv.gameObject.GetComponent<Renderer>().material.color = color;
                }
                return;
            }
            foreach(var g in grids)
            {
                var gv = gridView[g.Key];
                gv.gameObject.GetComponent<Renderer>().material.color = color;
            }
        }
        #endregion

        #region unit
        public GameObject unitPrefab;
        public Transform unitRoot;
        Dictionary<string, GameObject> unitView = new Dictionary<string, GameObject>();
        public void CreateUnit(Model model, string unit, Vector2Int pos)
        {
            var go = Instantiate(unitPrefab, unitRoot, false);
            var newPos = go.transform.localPosition;
            newPos.x = pos.x * gridWidth;
            newPos.z = pos.y * gridHeight;
            go.transform.localPosition = newPos;
            unitView.Add(unit, go);

            var u = model.mapCtx.units[unit];
            var owner = model.mapCtx.unit2Player[u.Key];
            var playerObj = model.mapCtx.players[owner];
            if (playerObj.Key == 1)
            {
                go.GetComponent<Renderer>().material.color = Color.red;
            }
            if (playerObj.Key == 2)
            {
                go.GetComponent<Renderer>().material.color = Color.yellow;
            }
            go.SetActive(true);
        }

        public float MovementSpeed;
        public IEnumerator AnimateUnitMove(string key, List<Grid> path)
        {
            SetGridColor(null, Color.white);
            SetGridColor(path, Color.red);

            var unit = unitView[key];
            path.Reverse();
            foreach (var cell in path)
            {
                var pos = cell.pos;
                var x = pos.x * gridWidth;
                var z = pos.y * gridHeight;
                Vector3 destination_pos = new Vector3(x, unit.transform.localPosition.y, z);
                while (unit.transform.localPosition != destination_pos)
                {
                    unit.transform.localPosition = Vector3.MoveTowards(unit.transform.localPosition, destination_pos, Time.deltaTime * MovementSpeed);
                    yield return 0;
                }
            }

            SetGridColor(null, Color.white);
        }
        public void SetUnitPos(string key, Grid cell)
        {
            var unit = unitView[key];
            var pos = cell.pos;
            var x = pos.x * gridWidth;
            var z = pos.y * gridHeight;
            Vector3 destination_pos = new Vector3(x, unit.transform.localPosition.y, z);
            unit.transform.localPosition = destination_pos;
        }
        #endregion

        #region popup
        public UnitMenu unitMenu;
        public UnitMenu GetUnitMenu()
        {
            if(unitMenu == null)
            {
                Debug.LogError("unitMenu == null");
            }
            if (unitMenu.gameObject == null)
            {
                Debug.LogError("unitMenu.gameObject == null");
            }
            unitMenu.gameObject.SetActive(true);
            return unitMenu;
        }

        public WeaponMenu weaponMenu;
        public WeaponMenu GetWeaponMenu()
        {
            weaponMenu.gameObject.SetActive(true);
            return weaponMenu;
        }
        #endregion

        #region predict
        public UnitTargetWeaponListRef utwRef;
        public void SetUTWList(List<UnitTargetWeapon> list)
        {
            if (utwRef.refType != ObjectRefType.Static)
            {
                throw new System.Exception("XXX");
            }
            if (list == null)
            {
                utwRef.value.Clear();
                utwRef.OnValueChange();
                return;
            }
            utwRef.value = list;
            utwRef.OnValueChange();
        }
        #endregion
    }

    public class Menu<T> : MonoBehaviour
    {
        public Action<Menu<T>> OnSelect = delegate { };
        public T selected;
        public List<T> menu;

        public virtual void Select(int idx)
        {
            if (menu.Count <= idx)
            {
                throw new Exception("XXX");
            }
            selected = menu[idx];
            OnSelect(this);
        }

        public T Selected
        {
            get
            {
                return selected;
            }
        }
    }
}