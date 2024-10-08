using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.Networking;

public class Controller : MonoBehaviour
{
    public GameObject PreCard = null;
    public GameObject PreCommand = null;
    public GameObject CommandContainer = null;

    public Model Models = null;

    Dictionary<string, Texture2D> cardTextures = new Dictionary<string, Texture2D>();
    Dictionary<string, CardController> Cards = new Dictionary<string, CardController>();
    
    // Start is called before the first frame update
    void Start()
    {
        // 從後端sync所有資料過來到前端的model
        SyncModel();
        CreateCards();

        
    }

    void SyncModel()
    {
        for (int i = 0; i < 120; ++i)
        {
            CardModel cardModel = new CardModel();

            // 這裏目前都是假資料
            cardModel.uid = i.ToString();
            cardModel.prototype.uid = "R01";
            cardModel.prototype.url = "https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/179030_11E_U_BL209R_blue.jpg";

            // 已經新增過的就會變成修改
            Models.AddCard(cardModel);
        }
    }

    public void TestSync()
    {
        Models.GetModelByUID("5").pos = new Vector3(0.5f, 0, 0);
        Models.GetModelByUID("10").pos = new Vector3(1.5f, 0, 0);
        Models.GetModelByUID("12").pos = new Vector3(1.5f, 0, 2f);
    }

    public void TestSync2()
    {
        Models.GetModelByUID("5").pos = new Vector3(0.1f, 1f, .3f);
        Models.GetModelByUID("10").rotY = 90;
        Models.GetModelByUID("12").rotZ = 180;
    }

    async Task<CardController> AddCard(CardModel model)
    {
        if (Cards.ContainsKey(model.uid)) return null;
        GameObject card = Instantiate(PreCard, transform);
        card.name = model.uid;
        card.SetActive(true);

        CardController cardController = card.GetComponent<CardController>();
        await cardController.SetModel(model);
        Cards.Add(model.uid, cardController);
        return cardController;
    }

    async void CreateCards()
    {
        foreach (var model in Models.GetModels())
        {
            await AddCard(model);
        }

        // 測試用代碼
        GameObject tempCommand = Instantiate(PreCommand, CommandContainer.transform);
        tempCommand.GetComponent<UIFollow3D>().target = Cards["10"].gameObject.transform;
        tempCommand.SetActive(true);
    }

    public async Task<Texture2D> GetCardTexture(CardModel model)
    {
        if (!cardTextures.ContainsKey(model.prototype.uid))
        {
            Texture2D texture = await GetRemoteTexture(model.prototype.url);
            cardTextures.Add(model.prototype.uid, texture);
        }
        return cardTextures[model.prototype.uid];
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
