using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace ChartUtil
{
    public class LineChartShade : MaskableGraphic
    {
        [SerializeField] Texture m_Texture;
        public Vector2[] points = new Vector2[4];

        public override Texture mainTexture
        {
            get { return m_Texture == null ? s_WhiteTexture : m_Texture; }
        }

        public Texture texture
        {
            get
            {
                return m_Texture;
            }
            set
            {
                if (m_Texture == value) return;
                m_Texture = value;
                SetVerticesDirty();
                SetMaterialDirty();
            }
        }

        protected override void OnPopulateMesh(VertexHelper vh)
        {
            vh.Clear();

            if (points[1].y * points[2].y < 0)
            {
                float delta = (points[2].y - points[1].y) / (points[2].x - points[1].x);
                float n = points[1].y - (delta * points[1].x);
                float x = -n / delta;
                Vector2 p = new Vector2(x, 0.0f);
                vh.AddVert(points[0], color, Vector2.zero);
                vh.AddVert(points[1], color, Vector2.zero);
                vh.AddVert(points[2], color, Vector2.zero);
                vh.AddVert(points[3], color, Vector2.zero);
                vh.AddVert(p, color, Vector2.zero);
                vh.AddTriangle(0, 1, 4);
                vh.AddTriangle(4, 3, 2);
            }
            else if (points[1].x * points[2].x < 0)
            {
                float delta = (points[2].y - points[1].y) / (points[2].x - points[1].x);
                float n = points[1].y - (delta * points[1].x);
                Vector2 p = new Vector2(0.0f, n);
                vh.AddVert(points[0], color, Vector2.zero);
                vh.AddVert(points[1], color, Vector2.zero);
                vh.AddVert(points[2], color, Vector2.zero);
                vh.AddVert(points[3], color, Vector2.zero);
                vh.AddVert(p, color, Vector2.zero);
                vh.AddTriangle(0, 1, 4);
                vh.AddTriangle(4, 3, 2);
            }
            else
            {
                vh.AddVert(points[0], color, Vector2.zero);
                vh.AddVert(points[1], color, Vector2.zero);
                vh.AddVert(points[2], color, Vector2.zero);
                vh.AddVert(points[3], color, Vector2.zero);
                vh.AddTriangle(0, 1, 2);
                vh.AddTriangle(2, 3, 0);
            }
        }
    }
}