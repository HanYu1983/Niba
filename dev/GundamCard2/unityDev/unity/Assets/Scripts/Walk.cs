using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Walk : ANavigator
{
    private Quaternion targetRot = Quaternion.identity;
    private Vector3 targetPos = Vector3.zero;

    private void Start()
    {
        targetRot = transform.rotation;
        targetPos = transform.position;
    }

    void Update()
    {
        base.Update();

        float speed = Time.deltaTime;

        if (isMouseRightDown) {

            float yaw = deltePosition.x * -speed * rotateSpeed;
            float pitch = deltePosition.y * speed * rotateSpeed;

            //Quaternion rot = gameObject.transform.rotation;
            targetRot *= Quaternion.FromToRotation(Vector3.right, new Vector3(Mathf.Cos(yaw), 0, Mathf.Sin(yaw)));
            targetRot *= Quaternion.FromToRotation(Vector3.forward, new Vector3(0, Mathf.Sin(pitch), Mathf.Cos(pitch)));

            // 把roll排除掉
            targetRot = Quaternion.Euler(targetRot.eulerAngles.x, targetRot.eulerAngles.y, 0);

            //也可以用下面的做法
            //gameObject.transform.Rotate(Vector3.up, yaw);
            //gameObject.transform.Rotate(Vector3.right, pitch);
            //Quaternion rot = gameObject.transform.rotation;
            //gameObject.transform.rotation = Quaternion.Euler(rot.eulerAngles.x, rot.eulerAngles.y, 0);

            
            //Vector3 pos = gameObject.transform.position;
            if (isKeyQdown)
            {
                targetPos += gameObject.transform.up * -speed * moveSpeed;
            }
            if (isKeyEdown)
            {
                targetPos += gameObject.transform.up * speed * moveSpeed;
            }
            if (isKeyDdown)
            {
                targetPos += gameObject.transform.right * speed * moveSpeed;
            }
            if (isKeyAdown)
            {
                targetPos += gameObject.transform.right * -speed * moveSpeed;
            }
            if (isKeySdown)
            {
                targetPos += gameObject.transform.forward * -speed * moveSpeed;
            }
            if (isKeyWdown)
            {
                targetPos += gameObject.transform.forward * speed * moveSpeed;
            }
        }

        Quaternion rotateTo = Quaternion.Lerp(gameObject.transform.rotation, targetRot, speed * easingFactor);
        Vector3 moveTo = Vector3.Lerp(gameObject.transform.position, targetPos, speed * easingFactor);

        gameObject.transform.SetPositionAndRotation(moveTo, rotateTo);
    }

    public override void SetTarget(Vector3 target, float distance)
    {
        targetPos = (targetPos - target).normalized * distance + target;
    }
}
