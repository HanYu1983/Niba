using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Common;

public class Creature : MonoBehaviour {

    public GameObject CreatureFace;
    public Text Txt_type;

    public void SetType(int monsterInfo )
    {
        string creatureName = "";
        bool showCreature = false;
        switch (monsterInfo)
        {
            case 1:
                creatureName = "蝶";
                showCreature = true;
                break;
            case 2:
                creatureName = "狗";
                showCreature = true;
                break;
            case 0:
                creatureName = "";
                showCreature = false;
                break;
        }
        Txt_type.text = creatureName;
        CreatureFace.SetActive(showCreature);
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
