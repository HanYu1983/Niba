using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Model;

public class Tile : MonoBehaviour {

    public Text txt_type;

    public void SetType(int resourceType)
    {
        var typeName = "";
        switch (resourceType)
        {
            case 1:
                typeName = "草";
                break;
            case 2:
                typeName = "石";
                break;
            case 3:
                typeName = "天";
                break;
            case 4:
                typeName = "樹";
                break;
			case 0:
                typeName = "";
                break;
        }
        txt_type.text = typeName;
    }

    private void Awake()
    {
        SetType(0);
    }

    // Use this for initialization
    void Start () {
        
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
