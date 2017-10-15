using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Model;

public class Tile : MonoBehaviour {

    public Text txt_type;

    public void SetType(ResourceType resourceType)
    {
        var typeName = "";
        switch (resourceType)
        {
            case ResourceType.Grass:
                typeName = "草";
                break;
            case ResourceType.Rock:
                typeName = "石";
                break;
            case ResourceType.Sky:
                typeName = "天";
                break;
            case ResourceType.Tree:
                typeName = "樹";
                break;
            case ResourceType.Unknown:
                typeName = "";
                break;
        }
        txt_type.text = typeName;
    }

    private void Awake()
    {
        SetType(ResourceType.Unknown);
    }

    // Use this for initialization
    void Start () {
        
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
