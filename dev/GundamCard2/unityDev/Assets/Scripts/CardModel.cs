using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public struct Prototype
{
    public string uid;
    public string url;
}

public class CardModel
{

    public string uid = "";

    //public Action<Vector3> OnPositionChange;

    string areaUID = "";

    public Prototype prototype = new Prototype();

    public Vector3 pos = Vector3.zero;

    public float rotZ = 0.0f;
    public float rotY = 0.0f;


    //public CardModel Duplicate()
    //{
    //    CardModel model = new CardModel();
    //    model.prototype = prototype;
    //    model.uid = uid;
    //    return this;
    //}

    //public void SetPosition(Vector3 newPos)
    //{
    //    if (currentPos != newPos)
    //    {
    //        //OnPositionChange.Invoke(currentPos);
    //        currentPos = newPos;
    //    }
    //}

}
