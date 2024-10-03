{
  "_$ver": 1,
  "_$id": "8hkzvk9j",
  "_$runtime": "res://a13f4f2b-2ddd-4ea6-bb80-01b8f5bc0e91",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "_$comp": [
    {
      "_$type": "06694ce2-d030-493f-8c89-d2fa520e679d",
      "scriptPath": "scripts/SceneUIController.ts",
      "webController": {
        "_$ref": "cx351z4y",
        "_$type": "014c20a0-9c6c-41b9-b5c8-5bb25fafcab1"
      }
    }
  ],
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
              "y": 1,
              "z": 5
            }
          },
          "nearPlane": 0.3,
          "farPlane": 1000,
          "clearFlag": 1,
          "clearColor": {
            "_$type": "Color",
            "r": 0.3921,
            "g": 0.5843,
            "b": 0.9294
          }
        },
        {
          "_$id": "6ni3p096l5",
          "_$type": "Sprite3D",
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
              }
            }
          ]
        },
        {
          "_$id": "cx351z4y",
          "_$type": "Sprite3D",
          "name": "WebController",
          "_$comp": [
            {
              "_$type": "014c20a0-9c6c-41b9-b5c8-5bb25fafcab1",
              "scriptPath": "scripts/WebController.ts"
            }
          ]
        }
      ]
    },
    {
      "_$id": "b7okm1mc",
      "_$var": true,
      "_$type": "Button",
      "name": "BtnCallWeb",
      "x": 514,
      "y": 306,
      "width": 120,
      "height": 40,
      "_mouseState": 2,
      "skin": "res://d4cfd6a8-0d0a-475b-ac93-d85eaa646936",
      "label": "CallWeb",
      "labelSize": 20,
      "labelAlign": "center",
      "labelVAlign": "middle"
    }
  ]
}