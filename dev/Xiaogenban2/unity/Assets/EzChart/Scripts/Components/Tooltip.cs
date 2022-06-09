using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
#if CHART_TMPRO
using TMPro;
#endif

namespace ChartUtil
{
    public class Tooltip : MonoBehaviour
    {
#if CHART_TMPRO
        public TextMeshProUGUI tooltipText;
#else
        public Text tooltipText;
#endif
        public Image background;
    }
}
