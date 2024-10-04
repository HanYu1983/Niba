using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

public class Controller : MonoBehaviour
{
    public GameObject PreCard = null;

    public DeckController MyHand = null;

    Dictionary<string,Texture2D> cardTextures = new Dictionary<string, Texture2D>();

    // Start is called before the first frame update
    void Start()
    {
        TestAddCard();
    }

    async void TestAddCard()
    {
        for (int i = 0; i < 5; i++)
        {
            GameObject card = Instantiate(PreCard, MyHand.transform);
            CardController cardController = card.GetComponent<CardController>();
            CardModel cardModel = new CardModel();
            cardModel.uid = i.ToString();
            await cardController.SetModel(cardModel);
            card.SetActive(true);
            MyHand.AddCard(cardController);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public async Task<Texture2D> GetCardTexture(CardModel model)
    {
        if (!cardTextures.ContainsKey(model.uid))
        {
            Texture2D texture = await GetRemoteTexture(model.url);
            cardTextures.Add(model.uid, texture);
        }
        return cardTextures[model.uid];
    }

    async Task<Texture2D> GetRemoteTexture(string url)
    {
        using (UnityWebRequest www = UnityWebRequestTexture.GetTexture(url))
        {
            var asyncOp = www.SendWebRequest();
            while (asyncOp.isDone == false)
            {
                await Task.Delay(1000 / 30);
            }
            if (www.result == UnityWebRequest.Result.ConnectionError || www.result == UnityWebRequest.Result.ProtocolError)
            {
                return null;
            }
            else
            {
                return DownloadHandlerTexture.GetContent(www);
            }
        }
    }
}
