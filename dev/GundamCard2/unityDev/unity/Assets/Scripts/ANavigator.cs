using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class ANavigator : MonoBehaviour
{
    public float rotateSpeed = 1.0f;
    public float moveSpeed = 3.0f;
    public float easingFactor = 10.0f;

    protected Vector3 lastMousePosition = new Vector3();
    protected Vector3 deltePosition = new Vector3();

    protected bool isMouseLeftDown = false;
    protected bool isMouseRightDown = false;
    protected bool isKeyWdown = false;
    protected bool isKeyAdown = false;
    protected bool isKeySdown = false;
    protected bool isKeyDdown = false;
    protected bool isKeyQdown = false;
    protected bool isKeyEdown = false;

    public void Update()
    {
        if (Input.GetKeyDown(KeyCode.Q))
        {
            isKeyQdown = true;
        }

        if (Input.GetKeyDown(KeyCode.E))
        {
            isKeyEdown = true;
        }

        if (Input.GetKeyDown(KeyCode.W))
        {
            isKeyWdown = true;
        }

        if (Input.GetKeyDown(KeyCode.A))
        {
            isKeyAdown = true;
        }

        if (Input.GetKeyDown(KeyCode.S))
        {
            isKeySdown = true;
        }

        if (Input.GetKeyDown(KeyCode.D))
        {
            isKeyDdown = true;
        }

        if (Input.GetKeyUp(KeyCode.Q))
        {
            isKeyQdown = false;
        }

        if (Input.GetKeyUp(KeyCode.E))
        {
            isKeyEdown = false;
        }

        if (Input.GetKeyUp(KeyCode.W))
        {
            isKeyWdown = false;
        }

        if (Input.GetKeyUp(KeyCode.A))
        {
            isKeyAdown = false;
        }

        if (Input.GetKeyUp(KeyCode.S))
        {
            isKeySdown = false;
        }

        if (Input.GetKeyUp(KeyCode.D))
        {
            isKeyDdown = false;
        }
        if (Input.GetMouseButtonDown(0))
        {
            isMouseLeftDown = true;
        }

        if (Input.GetMouseButtonUp(0))
        {
            isMouseLeftDown = false;
        }

        if (Input.GetMouseButtonDown(1))
        {
            isMouseRightDown = true;
        }

        if (Input.GetMouseButtonUp(1))
        {
            isMouseRightDown = false;
        }

        deltePosition = Input.mousePosition - lastMousePosition;
    }

    private void LateUpdate()
    {
        lastMousePosition = Input.mousePosition;
    }

    public abstract void SetTarget(Vector3 target, float distance);
}
