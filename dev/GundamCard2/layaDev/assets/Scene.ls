{
  "_$ver": 1,
  "_$id": "g2jsdowg",
  "_$type": "Scene",
  "left": 0,
  "right": 0,
  "top": 0,
  "bottom": 0,
  "name": "Scene2D",
  "width": 1334,
  "height": 750,
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
      "_$comp": [
        {
          "_$type": "a0959050-2bb8-4996-b3f8-6e91067f81f5",
          "scriptPath": "scripts/HandController.ts",
          "container": null,
          "instancePool": null
        }
      ],
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
          },
          "_$comp": [
            {
              "_$type": "526ab67f-197c-4e78-88e0-270a04cc8c21",
              "scriptPath": "scripts/OrbitCamera.ts",
              "camera": {
                "_$ref": "6jx8h8bvc6"
              },
              "rotateSpeed": 0.5,
              "minPolarAngle": 0,
              "maxPolarAngle": 3.141592653589793,
              "zoomSpeed": 1,
              "minDistance": 2,
              "maxDistance": 20,
              "panSpeed": 1,
              "enableDamping": true,
              "dampingFactor": 0.1
            }
          ]
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
          "_$id": "urefs04a",
          "_$type": "Sprite3D",
          "name": "Cards",
          "_$comp": [
            {
              "_$type": "7a23ab24-bb4b-4509-a7d0-e801df6f8fae",
              "scriptPath": "scripts/CardsController.ts",
              "container": {
                "_$ref": "urefs04a"
              },
              "cardPrefab": {
                "_$ref": "ixgrcu3v"
              }
            }
          ]
        },
        {
          "_$id": "uw2zeye4",
          "_$type": "Sprite3D",
          "name": "HandController",
          "_$comp": [
            {
              "_$type": "a0959050-2bb8-4996-b3f8-6e91067f81f5",
              "scriptPath": "scripts/HandController.ts",
              "container": {
                "_$ref": "p7ckk9dy"
              },
              "instancePool": {
                "_$ref": "uw2zeye4",
                "_$type": "e1faad6c-49ee-44d0-8bbf-a9221ac85301"
              }
            },
            {
              "_$type": "e1faad6c-49ee-44d0-8bbf-a9221ac85301",
              "scriptPath": "scripts/InstancePool.ts",
              "prefab": {
                "_$ref": "ixgrcu3v"
              }
            }
          ]
        },
        {
          "_$id": "p7ckk9dy",
          "_$type": "Sprite3D",
          "name": "Table",
          "_$child": [
            {
              "_$id": "ixgrcu3v",
              "_$prefab": "a5004242-878c-4b8f-9ac3-2b3c4f63823d",
              "name": "Card",
              "active": true,
              "layer": 0,
              "transform": {
                "localPosition": {
                  "_$type": "Vector3"
                },
                "localRotation": {
                  "_$type": "Quaternion"
                }
              }
            }
          ]
        },
        {
          "_$id": "8bydeont",
          "_$type": "Sprite3D",
          "name": "GameController",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": -4.145580398815281,
              "y": 3.8996763939174808,
              "z": 2.6299169795852726
            }
          },
          "_$comp": [
            {
              "_$type": "da761c73-29c7-4301-ac71-3d577d8d2181",
              "scriptPath": "scripts/GameController.ts",
              "handController": {
                "_$ref": "uw2zeye4",
                "_$type": "a0959050-2bb8-4996-b3f8-6e91067f81f5"
              },
              "camera": {
                "_$ref": "6jx8h8bvc6",
                "_$type": "526ab67f-197c-4e78-88e0-270a04cc8c21"
              }
            }
          ]
        },
        {
          "_$id": "l7aap4k9",
          "_$type": "Sprite3D",
          "name": "Cube",
          "transform": {
            "localPosition": {
              "_$type": "Vector3",
              "x": 1.3979099203174852,
              "y": -0.1996273931578866,
              "z": -3.089165424341032
            }
          },
          "_$comp": [
            {
              "_$type": "MeshFilter",
              "sharedMesh": {
                "_$uuid": "6e013e32-fec7-4397-80d1-f918a07607be",
                "_$type": "Mesh"
              }
            },
            {
              "_$type": "MeshRenderer",
              "lightmapScaleOffset": {
                "_$type": "Vector4"
              },
              "sharedMaterials": [
                {
                  "_$uuid": "6f90bbb0-bcb2-4311-8a9d-3d8277522098",
                  "_$type": "Material"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "_$id": "wffv1ydt",
      "_$prefab": "e510499f-63fe-48fc-b0a5-5216491d4d34",
      "name": "CardUI",
      "active": true,
      "x": 634,
      "y": 334,
      "visible": true,
      "width": 100,
      "height": 100,
      "_$child": [
        {
          "_$override": "mxr5am7x",
          "width": 187
        },
        {
          "_$override": "5bvhduec",
          "italic": false,
          "align": "center",
          "valign": "middle",
          "relations": [
            {
              "_$type": "Relation",
              "target": {
                "_$ref": "g2jsdowg"
              },
              "data": []
            }
          ]
        }
      ]
    }
  ]
}