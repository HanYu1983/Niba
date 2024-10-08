using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;
using static System.Net.WebRequestMethods;




public class Model : MonoBehaviour
{
    private Dictionary<string,CardModel> Models = new Dictionary<string,CardModel>();

    public void AddCard(CardModel cardModel)
    {
        if (Models.ContainsKey(cardModel.uid))
        {
            EditModel(cardModel);
        }
        else
        {
            Models[cardModel.uid] = cardModel;
        }
    }

    public List<CardModel> GetModels()
    {
        return Models.Values.ToList();
    }

    public CardModel GetModelByUID(string uid)
    {
        return Models[uid];
    }

    public CardModel EditModel(CardModel editCard)
    {
        if(!Models.ContainsKey(editCard.uid)) return null;
        CardModel model = Models[editCard.uid];
        return model;
    }
}
