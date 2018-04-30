using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

namespace Test
{
    public class TestPointGround : MonoBehaviour
    {
        public LayerMask RaycastLayerMask;
        public Transform pointer;
        public Transform cameraTrans;
        public Vector2 firstMouse;
        public Vector2 secondMouse;
        public RectTransform selectionRect;
        public List<GameObject> units;
        public List<GameObject> selectedUnit;

        private void Update()
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

            if (Input.GetMouseButtonUp(2))
            {
                var unit = Instantiate(pointer.gameObject, null, false);
                units.Add(unit);
            }

            if (Input.GetMouseButtonUp(1))
            {
                foreach(var u in selectedUnit)
                {
                    var agent = u.GetComponent<NavMeshAgent>();
                    agent.SetDestination(pointer.localPosition);
                }
            }

            if (Input.GetMouseButtonUp(0))
            {
                selectionRect.gameObject.SetActive(false);
                selectedUnit.Clear();

                foreach (var u in units)
                {
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
                        selectedUnit.Add(u);
                    }
                }

                if (Physics.Raycast(RayCheck, out Hit, 100000))
                {
                    var hitObj = Hit.collider.gameObject;
                    if (units.Contains(hitObj))
                    {
                        selectedUnit.Add(hitObj);
                    }
                }

                //Vector3 ScreenPos = Camera.main.WorldToScreenPoint(UnitsInRange[i].transform.position);
            }

            var mp = Input.mousePosition;
            if(mp.x < 50)
            {
                cameraTrans.transform.Translate(Vector3.left, Space.World);
            }
            if(mp.x > Screen.width - 50)
            {
                cameraTrans.transform.Translate(Vector3.right, Space.World);
            }
            if(mp.y < 50)
            {
                cameraTrans.transform.Translate(Vector3.back, Space.World);
            }
            if (mp.y > Screen.height - 50)
            {
                cameraTrans.transform.Translate(Vector3.forward, Space.World);
            }

            if (Input.GetAxis("Mouse ScrollWheel") > 0)
            {
                cameraTrans.transform.Translate(Vector3.forward*10, Space.Self);
            }
            if (Input.GetAxis("Mouse ScrollWheel") < 0)
            {
                cameraTrans.transform.Translate(Vector3.back*10, Space.Self);
            }
        }
    }
}