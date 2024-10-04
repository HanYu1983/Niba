using System;
using System.Threading.Tasks;
using Unity.VisualScripting;
using UnityEngine;

public class CardController : MonoBehaviour
{
    public Controller Controller;
    public MeshRenderer Mesh;

    CardModel CardModel;

    public async Task<Boolean> SetModel(CardModel model)
    {
        CardModel = model;

        Texture2D texture = await Controller.GetCardTexture(model);
        Mesh.material.SetTexture("_AlbedoTex", texture);

        return true;
    }

    public CardModel GetModel()
    {
        return CardModel;
    }

    // Start is called before the first frame update
    async void Start()
    {
        //SetModel(new CardModel());
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
