using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace RedAlert
{
    public class SelectionManager : MonoBehaviour
    {
        public LayerMask RaycastLayerMask;
        public Transform pointer;
        public RectTransform selectionRect;
        public static Action<SelectionManager> OnSelect = delegate { };

        public Vector2 firstMouse;
        public Vector2 secondMouse;
        public GameObject lastClickObj;
        
        private void Update()
        {
            Step();
        }

        public bool IsSelecting
        {
            get
            {
                return selectionRect.gameObject.activeSelf;
            }
        }

        public List<GameObject> GetSelection(List<GameObject> objs)
        {
            var ret = new List<GameObject>();
            foreach (var u in objs)
            {
                if(lastClickObj != null)
                {
                    if(u == lastClickObj)
                    {
                        ret.Add(u);
                        continue;
                    }
                }
                var unitPos = Camera.main.WorldToScreenPoint(u.transform.localPosition);
                var minx = Mathf.Min(firstMouse.x, secondMouse.x);
                var maxx = Mathf.Max(firstMouse.x, secondMouse.x);
                var miny = Mathf.Min(firstMouse.y, secondMouse.y);
                var maxy = Mathf.Max(firstMouse.y, secondMouse.y);

                if (unitPos.x > minx &&
                    unitPos.x <= maxx &&
                    unitPos.y >= miny &&
                    unitPos.y <= maxy)
                {
                    ret.Add(u);
                }
            }
            return ret;
        }

        void Step()
        {
            RaycastHit Hit;
            var RayCheck = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(RayCheck, out Hit, 100000, RaycastLayerMask.value))
            {
                pointer.localPosition = Hit.point;
            }

            if (Input.GetMouseButtonDown(0))
            {
                firstMouse = Input.mousePosition;
                selectionRect.gameObject.SetActive(true);
            }

            if (Input.GetMouseButton(0))
            {
                secondMouse = Input.mousePosition;
                var center = (secondMouse + firstMouse) / 2 - new Vector2(512, 384);
                selectionRect.localPosition = center;

                var box = secondMouse - firstMouse;
                selectionRect.sizeDelta = new Vector2(Mathf.Abs(box.x), Mathf.Abs(box.y));
            }

            if (Input.GetMouseButtonUp(0))
            {
                selectionRect.gameObject.SetActive(false);

                if (Physics.Raycast(RayCheck, out Hit, 100000))
                {
                    var hitObj = Hit.collider.gameObject;
                    lastClickObj = hitObj;
                }

                OnSelect(this);
            }
        }
    }
}