{
  "_$ver": 1,
  "_$id": "u3q5tnw6",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "_$child": [
    {
      "_$id": "n9gjxcltvl",
      "_$type": "Scene3D",
      "name": "Scene3D",
      "skyRenderer": {
        "meshType": "dome",
        "material": {
          "_$uuid": "793cffc6-730a-4756-a658-efe98c230292",
          "_$type": "Material"
        }
      },
      "ambientColor": {
        "_$type": "Color",
        "r": 0.424308,
        "g": 0.4578516,
        "b": 0.5294118
      },
      "_reflectionsIblSamples": 1024,
      "fogStart": 0,
      "fogEnd": 300,
      "fogColor": {
        "_$type": "Color",
        "r": 0.5,
        "g": 0.5,
        "b": 0.5
      },
      "_$child": [
        {
          "_$id": "6jx8h8bvc6",
          "_$type": "Camera",
          "name": "Main Camera",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "y": 1.8996694341014093,
              "z": 6.099469010680402
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.13177272353963138,
              "w": 0.9912799550737158
            }
          },
          "nearPlane": 0.3,
          "farPlane": 1000,
          "clearColor": {
            "_$type": "Color",
            "r": 0,
            "g": 0,
            "b": 0
          },
          "depthTextureFormat": 35
        },
        {
          "_$id": "6ni3p096l5",
          "_$type": "LightSprite",
          "name": "Direction Light",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 5,
              "y": 5,
              "z": 5
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": -0.40821789367673483,
              "y": 0.23456971600980447,
              "z": 0.109381654946615,
              "w": 0.875426098065593
            }
          },
          "_$comp": [
            {
              "_$type": "DirectionLightCom",
              "color": {
                "_$type": "Color",
                "r": 0.6,
                "g": 0.6,
                "b": 0.6
              },
              "strength": 1,
              "angle": 0.526,
              "maxBounces": 1024
            }
          ]
        },
        {
          "_$id": "004cjurt",
          "_$type": "Sprite3D",
          "name": "Controller",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "y": 1.5032808780670166,
              "z": -0.1763104796409607
            }
          },
          "_$comp": [
            {
              "_$type": "727a3608-ff83-4494-b44c-1ffc3a128eb7",
              "scriptPath": "scripts/Controller.ts",
              "myHand": {
                "_$ref": "geruuu8b",
                "_$type": "34f240bb-4fd0-4d63-97df-8527d7e36f2a"
              }
            }
          ]
        },
        {
          "_$id": "ztkyr8ja",
          "_$type": "Sprite3D",
          "name": "Decks",
          "_$child": [
            {
              "_$id": "geruuu8b",
              "_$prefab": "6aca4728-5dd3-4842-a24e-241473bcd80f",
              "name": "MyHand",
              "active": true,
              "layer": 0,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": -2.625145505383035,
                  "y": 0,
                  "z": 3.305729238787639
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": 0,
                  "y": 0,
                  "z": 0,
                  "w": 1
                }
              },
              "_$comp": [
                {
                  "_$override": "34f240bb-4fd0-4d63-97df-8527d7e36f2a",
                  "preCard": {
                    "_$ref": "dh0rq3ig"
                  }
                }
              ]
            },
            {
              "_$id": "ygc8xx14",
              "_$prefab": "6aca4728-5dd3-4842-a24e-241473bcd80f",
              "name": "MyDeck",
              "active": true,
              "layer": 0,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3",
                  "x": 3.05955585048891,
                  "y": 0,
                  "z": 0
                },
                "localRotation": {
                  "_$type": "Quaternion",
                  "x": 0,
                  "y": 0,
                  "z": 0,
                  "w": 1
                }
              },
              "_$comp": [
                {
                  "_$override": "34f240bb-4fd0-4d63-97df-8527d7e36f2a",
                  "preCard": {
                    "_$ref": "dh0rq3ig"
                  }
                }
              ]
            }
          ]
        },
        {
          "_$id": "dh0rq3ig",
          "_$prefab": "aa7f706f-679e-4141-bb26-5f46aba2822a",
          "name": "Card",
          "active": false,
          "layer": 0,
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 0,
              "y": 0,
              "z": 0
            },
            "localRotation": {
              "_$type": "Quaternion",
              "x": 0.5841168263399799,
              "y": 0,
              "z": 0,
              "w": 0.8116695960712769
            }
          }
        }
      ]
    }
  ]
}