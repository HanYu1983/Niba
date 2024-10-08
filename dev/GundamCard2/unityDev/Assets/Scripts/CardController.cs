using DG.Tweening;
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

        //Texture2D texture = await Controller.GetCardTexture(model);
        //Mesh.material.SetTexture("_AlbedoTex", texture);

        return true;
    }

    public CardModel GetModel()
    {
        return CardModel;
    }


    // Update is called once per frame
    void Update()
    {
        if((CardModel.pos - transform.position).magnitude > 0.001f)
        {
            transform.position = Vector3.Lerp(transform.position, CardModel.pos, Time.deltaTime * 10.0f);
        }

        Quaternion quat = transform.localRotation;
        Vector3 euler = quat.eulerAngles;
        if (CardModel.rotY - quat.eulerAngles.y > 0.001f)
        {
            euler.y += (CardModel.rotY - euler.y) * Time.deltaTime * 10.0f;
        }

        if (CardModel.rotZ - quat.eulerAngles.z > 0.001f)
        {
            euler.z += (CardModel.rotZ - euler.z) * Time.deltaTime * 10.0f;
        }
        transform.localRotation = Quaternion.Euler(euler);
    }
}
