using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UILayer : MonoBehaviour {
    public void OnBtnMoveClick(int dir)
    {
        string eventName = "";
        switch (dir)
        {
            case 0:
                eventName = "GamePage_btnMove_left";
                break;
            case 1:
                eventName = "GamePage_btnMove_up";
                break;
            case 2:
                eventName = "GamePage_btnMove_right";
                break;
            case 3:
                eventName = "GamePage_btnMove_down";
                break;
        }
        Common.Common.Notify(eventName, null);
    }
    void Update()
    {
        if (Input.GetKeyUp(KeyCode.A))
        {
            OnBtnMoveClick(0);
        }
        if (Input.GetKeyUp(KeyCode.W))
        {
            OnBtnMoveClick(1);
        }
        if (Input.GetKeyUp(KeyCode.D))
        {
            OnBtnMoveClick(2);
        }
        if (Input.GetKeyUp(KeyCode.S))
        {
            OnBtnMoveClick(3);
        }
    }
}
