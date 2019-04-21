using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ControlGun : MonoBehaviour {

    public GameObject gunPrefab;
    public GameObject enemy;

    MachineGun guns = new MachineGun();
    int gunSeq;
    float rotZ;

    void Start()
    {
    }

	void Update () {
        foreach (var line in guns.Lines)
        {
            var collide = MachineGun.Collide(line);
            for (var i = 0; i < enemy.transform.childCount; ++i)
            {
                var e = enemy.transform.GetChild(i);
                var isCollide = collide(e.transform.localPosition, 1);
                if (isCollide > 0)
                {
                    MachineGunLine replace = MachineGunLine.Null;
                    MachineGunLine newLine = MachineGunLine.Null;
                    MachineGun.CutLine(line, isCollide, 1, ref replace, ref newLine);
                    guns.ReplaceCutLines(replace);
                    if (newLine.Equals(MachineGunLine.Null) == false)
                    {
                        newLine.customKey = gunSeq++;
                        newLine.key = MachineGun.Key(newLine);
                        guns.ReplaceCutLines(newLine);
                        onCreateGun(newLine);
                    }
                }
            }
        }


        var removeList = guns.Update(Time.deltaTime, new List<string>());
        foreach (var k in removeList)
        {
            onRemoveGun(k);
        }


        if (Input.GetMouseButtonDown(0))
        {
            gunSeq++;
        }

        if (Input.GetMouseButton(1))
        {
            rotZ += 0.5f;
        }

        if (true)//Input.GetMouseButton(0))
        {
            var dir = Matrix4x4.Rotate(Quaternion.Euler(0, rotZ, 0)).MultiplyVector(Vector3.forward*200);
            MachineGunLine line = guns.Shoot(transform.localPosition, dir, 1, 10, gunSeq, Time.deltaTime);
            if(line.Equals(MachineGunLine.Null) == false)
            {
                onCreateGun(line);
            }
        }

        foreach (var line in guns.Lines)
        {
            onSync(line);
        }
    }
    Dictionary<string, GameObject> lines = new Dictionary<string, GameObject>();

    void onCreateGun(MachineGunLine line)
    {
        Debug.Log("onCreateGun:"+line.key);
        /*if (lines.ContainsKey(line.key))
        {
            return;
        }*/
        var go = Instantiate(gunPrefab, line.head, Quaternion.Euler(line.velocity));
        lines.Add(line.key, go);
    }

    void onRemoveGun(string key)
    {
        Debug.Log("onRemoveGun:"+key);
        /*if(lines.ContainsKey(key) == false)
        {
            return;
        }*/
        var go = lines[key];
        Destroy(go);
        lines.Remove(key);
    }

    void onSync(MachineGunLine line)
    {
        //Debug.Log("onSync:" + line.key+":"+line.head);
        /*if (lines.ContainsKey(line.key) == false)
        {
            return;
        }*/
        var go = lines[line.key];
        go.transform.localPosition = line.head;
        var s = go.transform.localScale;
        s.z = line.length.magnitude;
        go.transform.localScale = s;
        go.transform.localRotation = Quaternion.LookRotation(line.velocity);
        go.name = line.key;
    }
}
