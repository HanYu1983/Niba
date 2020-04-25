using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;

namespace ChartUtil
{
    public class ChartBase : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
    {
        [HideInInspector] public Vector2 chartSize;
        [HideInInspector] public RectTransform chartRect;
        [HideInInspector] public ChartOptions chartOptions;
        [HideInInspector] public ChartData chartData;
        [HideInInspector] public Tooltip tooltip;
        [HideInInspector] public List<int> skipSeries = new List<int>();
        [HideInInspector] public Vector3 mousePosition;

        bool mouseOver = false;
        protected int currItem = -1;
        Canvas rootCanvas;

        public virtual void UpdateChart() { }

        protected virtual int FindCurrentItem() { return -1; }

        protected virtual void HighlightCurrentItem() { }

        protected virtual void UnhighlightCurrentItem() { }

        protected virtual void ShowTooltip() { }

        protected virtual void HideTooltip()
        {
            if (tooltip == null) return;
            tooltip.gameObject.SetActive(false);
        }

        private void Awake()
        {
            rootCanvas = GetComponentInParent<Canvas>();
        }

        private void Update()
        {
            if (mouseOver) CheckTooltip();
            if (tooltip != null && tooltip.gameObject.activeSelf)
                tooltip.transform.position = mousePosition;
        }

        void CheckTooltip()
        {
            mousePosition = Helper.GetMousePosition(rootCanvas);
            int temp = FindCurrentItem();
            if (temp == currItem) return;

            if (currItem >= 0) UnhighlightCurrentItem();
            currItem = temp;
            if (currItem >= 0)
            {
                HighlightCurrentItem();
                ShowTooltip();
            }
            else
            {
                HideTooltip();
            }
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            if (!chartOptions.plotOptions.enableMouseTracking) return;
            mouseOver = true;
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            if (!chartOptions.plotOptions.enableMouseTracking) return;
            mouseOver = false;
            if (currItem >= 0)
            {
                UnhighlightCurrentItem();
                currItem = -1;
                HideTooltip();
            }
        }
    }
}