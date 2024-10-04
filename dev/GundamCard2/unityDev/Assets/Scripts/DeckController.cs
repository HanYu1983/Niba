using DG.Tweening;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class DeckController : MonoBehaviour
{
    Dictionary<string, CardController> Cards = new Dictionary<string, CardController>();

    public void AddCard(CardController card)
    {
        if (Cards.ContainsKey(card.GetModel().uid)) return;
        Cards.Add(card.GetModel().uid, card);
    }

    public void Stack()
    {

        float i = 0.0f;
        foreach (var item in Cards)
        {
            item.Value.gameObject.transform.DOLocalMove(new Vector3(0, i * .02f, 0), .5f);
            i++;
        }
    }

    public void List()
    {
        float i = 0.0f;
        foreach (var item in Cards)
        {
            item.Value.gameObject.transform.DOLocalMove(new Vector3(i, 0, 0), .5f);
            i++;
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
