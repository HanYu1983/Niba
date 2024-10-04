using System;
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Rendering;
using static UnityEngine.GraphicsBuffer;

public class Orbit : ANavigator
{
    public float yaw = 0;
    public float pitch = 0;
    public float distance = 1;

    public GameObject lookAt = null;

    private Matrix4x4 lookAtMat = Matrix4x4.identity;
    private Matrix4x4 yawMat = Matrix4x4.identity;
    private Matrix4x4 pitchMat = Matrix4x4.identity;
    private Matrix4x4 offsetMat = Matrix4x4.identity;

    private Matrix4x4 currentMat = Matrix4x4.identity;

    private Vector3 yawDir = Vector3.right;
    private Vector3 pitchDir = Vector3.forward;

    // Start is called before the first frame update
    void Start()
    {
        if(lookAt != null)
        {
            lookAtMat.SetTRS(lookAt.transform.position, Quaternion.identity, Vector3.one);
        }
    }

    // Update is called once per frame
    void Update()
    {
        base.Update();

        distance += Input.mouseScrollDelta.y * 0.5f;

        Matrix4x4 finalMat = calculateMatrix();

        // touch
        //Vector3 currentPosition = Input.mousePosition;
        //if (Input.touchCount>0)
        //{
        //    currentPosition = Input.touches[0].position;
        //}
        if (isMouseLeftDown)
        {
            yaw += deltePosition.x * Time.deltaTime * rotateSpeed;
            pitch += deltePosition.y * Time.deltaTime * -rotateSpeed;
        }

        if(isMouseRightDown)
        {
            Vector3 up = finalMat.GetColumn(1);
            up *= deltePosition.y * Time.deltaTime * -moveSpeed;

            Vector3 right = finalMat.GetColumn(0);
            right *= deltePosition.x * Time.deltaTime * -moveSpeed;

            // 用lookAtMat.GetColumn(3)代替 lookAtMat.GetT()，否則在Build WebGL時會失敗
            Vector3 lookAtPos = lookAtMat.GetColumn(3);
            lookAtPos += up;
            lookAtPos += right;

            lookAtMat.SetTRS(lookAtPos, Quaternion.identity, Vector3.one);
        }

        currentMat = Lerp(currentMat, finalMat, Time.deltaTime * easingFactor);
        gameObject.transform.SetPositionAndRotation(currentMat.GetPosition(), currentMat.rotation);
    }

    private Matrix4x4 calculateMatrix()
    {
        yawDir.x = Mathf.Cos(-yaw);
        yawDir.z = Mathf.Sin(-yaw); 
        yawMat.SetTRS(Vector3.zero, Quaternion.FromToRotation(Vector3.right, yawDir), Vector3.one);

        pitchDir.z = Mathf.Cos(-pitch);
        pitchDir.y = Mathf.Sin(-pitch);
        pitchMat.SetTRS(Vector3.zero, Quaternion.FromToRotation(Vector3.forward, pitchDir), Vector3.one);

        offsetMat.SetTRS(new Vector3(0,0,-distance), Quaternion.identity, Vector3.one);

        return lookAtMat * yawMat * pitchMat * offsetMat;
    }

    private Matrix4x4 Lerp(Matrix4x4 a, Matrix4x4 b, float t)
    {
        Matrix4x4 result = new Matrix4x4();
        for (int i = 0; i < 16; i++)
        {
            result[i] = Mathf.Lerp(a[i], b[i], t);
        }
        return result;
    }

    public override void SetTarget(Vector3 target, float distance)
    {
        this.distance = distance;
        lookAtMat.SetTRS(target, Quaternion.identity, Vector3.one);
    }
}
