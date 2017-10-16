using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Common;

namespace GameView
{
    public class CreatureLayer : MonoBehaviour
    {

        public GameObject CreaturePrefab;
        List<Creature> AryCreature = new List<Creature>();

		public void PutCreature(Position position, MonsterInfo info)
        {
			print("PutCreature, type: " + info.type + ",pos.x:" + position.x + ",y:" + position.y);
            Creature creature = GetCreatureByXY(position.x, position.y);
            if (creature != null)
            {
                creature.SetType(info.type);
            }
        }

        Creature GetCreatureByXY(int x, int y)
        {
            int index = View.GetIndexByXY(x, y);
            return AryCreature[index];
        }

        void CreateEmptyCreature()
        {
            for (int i = 0; i < 100; ++i)
            {
                GameObject creature = Instantiate(CreaturePrefab);
                creature.SetActive(true);
                creature.transform.SetParent(this.transform);
                creature.GetComponent<RectTransform>().localPosition = new Vector3();
                creature.GetComponent<RectTransform>().localScale = new Vector3(1, 1, 1);

                AryCreature.Add(creature.GetComponent<Creature>());
            }
        }

        private void Awake()
        {
            CreateEmptyCreature();
        }
        // Use this for initialization
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {

        }
    }

}
