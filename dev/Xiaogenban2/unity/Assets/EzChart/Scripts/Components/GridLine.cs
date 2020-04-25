using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    [ExecuteInEditMode]
    public class GridLine : MonoBehaviour
    {
        public Image line;
#if CHART_TMPRO
        public TextMeshProUGUI label;
#else
        public Text label;
#endif
    }
}