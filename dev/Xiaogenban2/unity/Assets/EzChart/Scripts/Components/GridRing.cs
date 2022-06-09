using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace ChartUtil
{
    public class GridRing : GridLine
    {
        Material m_ringMaterial = null;
        public Material ringMaterial
        {
            get
            {
                if (m_ringMaterial == null)
                {
                    m_ringMaterial = new Material(Resources.Load<Material>("Materials/Chart_Ring"));
                    line.material = m_ringMaterial;
                }
                return m_ringMaterial;
            }
        }

        private void OnDestroy()
        {
            if (m_ringMaterial != null) Helper.Destroy(m_ringMaterial);
        }
    }
}