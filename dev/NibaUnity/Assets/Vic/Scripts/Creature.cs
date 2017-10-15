using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Model;

public class Creature : MonoBehaviour {

    public GameObject CreatureFace;
    public Text Txt_type;

    public void SetType(MonsterType monsterInfo )
    {
        string creatureName = "";
        bool showCreature = false;
        switch (monsterInfo)
        {
            case MonsterType.Bufferfly:
                creatureName = "蝶";
                showCreature = true;
                break;
            case MonsterType.Dog:
                creatureName = "狗";
                showCreature = true;
                break;
            case MonsterType.Unknown:
                creatureName = "";
                showCreature = false;
                break;
        }
        Txt_type.text = creatureName;
        CreatureFace.SetActive(showCreature);
    }

    private void Awake()
    {
        SetType(MonsterType.Unknown);
    }

    // Use this for initialization
    void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
