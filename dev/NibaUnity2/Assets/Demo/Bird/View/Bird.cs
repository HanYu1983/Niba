using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;

namespace Bird
{
    public class Bird : MonoBehaviour
    {
        // 碰到任何物體
        public static Action<Bird, Collider> OnCollide = delegate { };

        void OnTriggerEnter(Collider other)
        {
            OnCollide(this, other);
        }

        // 移動鳥, 每次更新呼叫
        public void MoveX(float moveSpeed)
        {
            var pos = transform.localPosition;
            pos.x += Time.deltaTime * moveSpeed;
            transform.localPosition = pos;
        }

        // 重設位置. 重新遊戲時呼叫
        public void ResetPosition()
        {
            transform.localPosition = Vector3.zero - new Vector3(10, 0,0);
            var rigid = GetComponent<Rigidbody>();
            rigid.velocity = Vector3.zero;
        }

        // 當成位置, 用來計算得分和障礙自動生成
        public float X { get { return transform.localPosition.x; } }

        // 跳躍
        [ContextMenu("Jump")]
        public void Jump(float f)
        {
            var rigid = GetComponent<Rigidbody>();
            rigid.AddForce(new Vector3(0, f));
        }
    }
}