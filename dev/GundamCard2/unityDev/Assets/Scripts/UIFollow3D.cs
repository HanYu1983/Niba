using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UIFollow3D : MonoBehaviour
{

    public Transform target;

    private RectTransform rectTransform;

    // Start is called before the first frame update
    void Start()
    {
        rectTransform = gameObject.GetComponent<RectTransform>();
    }

    // Update is called once per frame
    void Update()
    {
        Vector3 screenPos = Camera.main.WorldToScreenPoint(target.position);
        
        rectTransform.SetPositionAndRotation(screenPos, Quaternion.identity);
    }
}
