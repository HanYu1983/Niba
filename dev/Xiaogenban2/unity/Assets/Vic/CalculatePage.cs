﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CalculatePage : Page
{
    public void InputComplete()
    {
        Debug.Log("結帳");
    }

    public void Cancel()
    {
        Debug.Log("取消");
    }
}
