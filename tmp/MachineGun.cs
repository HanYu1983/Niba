using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using System;

public struct MachineGunLine
{
    public string key;
    public int customKey;
    public Vector3 head, origin;
    public Vector3 velocity;
    public float width;
    public float holdDuration;
    public float maxLength;
    public Vector3 length
    {
        get
        {
            return velocity * holdDuration;
        }
    }
    public static MachineGunLine Null;
}

public class MachineGun{
    Dictionary<string, MachineGunLine> lines = new Dictionary<string, MachineGunLine>();

    public static string Key2(Vector3 head, Vector3 velocity, float width, float maxLength, int customKey)
    {
        var fs = new List<float>() {
            head.x, head.y, head.z, velocity.x, velocity.y, velocity.z, width, maxLength, customKey
        }.Select(v =>
        {
            return v.ToString("00");
        });
        return string.Join(",", fs.ToArray());
    }

    public static string Key(MachineGunLine line)
    {
        return Key2(line.head, line.velocity, line.width, line.maxLength, line.customKey);
    }

    public MachineGunLine Shoot(Vector3 head, Vector3 velocity, float width, float maxLength, int customKey, float delta)
    {
        var key = Key2(head, velocity, width, maxLength, customKey);
        if (lines.ContainsKey(key))
        {
            var origin = lines[key];
            origin.holdDuration += delta;
            lines[key] = origin;
            return MachineGunLine.Null;
        }
        MachineGunLine line;
        line.key = key;
        line.customKey = customKey;
        line.head = head + velocity * delta;
        line.origin = head;
        line.velocity = velocity;
        line.width = width;
        line.holdDuration = delta;
        line.maxLength = maxLength;
        lines[key] = line;
        return line;
    }

    public List<MachineGunLine> Lines
    {
        get
        {
            return lines.Values.ToList();
        }
    }

    private List<string> tmp = new List<string>();
    public List<string> Update(float delta, List<string> removeList)
    {
        tmp.Clear();
        tmp.AddRange(lines.Keys);
        foreach (var key in tmp)
        {
            var origin = lines[key];
            //Debug.Log(origin.head);
            //Debug.Log(origin.length.magnitude);

            origin.head += origin.velocity * delta;
            /*
            if (origin.length.sqrMagnitude < origin.maxLength)
            {
                origin.head += origin.velocity * delta;
            } else
            {
                origin.holdDuration -= delta;
            }
            */
            lines[key] = origin;
            if (origin.holdDuration <= 0)
            {
                lines.Remove(key);
                removeList.Add(key);
            }
        }
        return removeList;
    }

    public static Func<Vector3, float, float> Collide(MachineGunLine line)
    {
        var normal = Vector3.right;
        if (line.velocity != Vector3.up)
        {
            normal = Vector3.Cross(Vector3.up, line.velocity.normalized);
        }
        return (Vector3 pos, float radius) =>
        {
            var lineToPos = pos - line.head;
            var distToLine = Mathf.Abs(Vector3.Dot(normal, lineToPos));
            var isOverlayLine = distToLine < radius;
            if (isOverlayLine == false)
            {
                return -1;
            }
            var distToHead = Vector3.Dot(-line.velocity.normalized, lineToPos);
            if (distToHead < 0)
            {
                return -1;
            }
            var isInLineSeqment = distToHead < line.length.magnitude;
            if (isInLineSeqment == false)
            {
                var isInLineVelocity = distToHead < line.velocity.magnitude;
                if (isInLineVelocity)
                {
                    return 1;
                }
                return -1;
            }
            
            return distToHead / line.velocity.magnitude;
        };
    }

    public static void CutLine(MachineGunLine line, float collideTime, float length, ref MachineGunLine replace, ref MachineGunLine newLine)
    {
        float time1 = Mathf.Max(0, collideTime - length);
        float time2 = collideTime;
        replace = line;
        replace.holdDuration = time1;
        if (time2 > line.holdDuration)
        {
            return;
        }
        MachineGunLine line2 = line;
        line2.head = line.head + (-line.velocity) * time2;
        line2.holdDuration = line.holdDuration - time2;
        newLine = line2;
    }

    public void ReplaceCutLines(MachineGunLine line)
    {
        lines[line.key] = line;
    }
}


public struct BeamLine
{
    public string key;
    public Vector3 origin;
    public Vector3 dir;
    public float length;
    public float width;
    public float energy;
    public static BeamLine Null;
}

public class Beam
{
    Dictionary<string, BeamLine> lines = new Dictionary<string, BeamLine>();

    public string Key2(Vector3 origin, Vector3 dir, float width)
    {
        var fs = new List<float>() {
            origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, width
        }.Select(v =>
        {
            return v.ToString("00.00");
        });
        return string.Join(",", fs.ToArray());
    }

    public string Key(BeamLine line)
    {
        return Key2(line.origin, line.dir, line.width);
    }

    public BeamLine Shoot(Vector3 origin, Vector3 dir, float width, float delta)
    {
        var key = Key2(origin, dir, width);
        if (lines.ContainsKey(key))
        {
            var originLine = lines[key];
            originLine.energy += delta;
            lines[key] = originLine;
            return BeamLine.Null;
        }
        BeamLine line;
        line.key = key;
        line.origin = origin;
        line.dir = dir;
        line.width = width;
        line.energy = delta;
        line.length = 0;
        lines[key] = line;
        return line;
    }

    public List<BeamLine> Lines
    {
        get
        {
            return lines.Values.ToList();
        }
    }

    public List<string> Update(float delta, List<string> removeList)
    {
        foreach (var key in lines.Keys)
        {
            var origin = lines[key];
            origin.energy -= delta;
            if (origin.energy <= 0)
            {
                lines.Remove(key);
                removeList.Add(key);
            }
            else
            {
                lines[key] = origin;
            }
        }
        return removeList;
    }

    public static Action<Vector3, float, float[]> Collide(BeamLine line)
    {
        var normal = Vector3.right;
        if (line.dir != Vector3.up)
        {
            normal = Vector3.Cross(Vector3.up, line.dir);
        }
        return (Vector3 pos, float radius, float[] answer) =>
        {
            var lineToPos = pos - line.origin;
            var distToLine = Vector3.Dot(lineToPos, normal);
            var isOverlayLine = distToLine < radius;
            if (isOverlayLine == false)
            {
                return;
            }
            var per =  distToLine / (radius + radius);
            var distToOrigin = Vector3.Dot(lineToPos, line.dir);
            answer[0] = per;
            answer[1] = distToOrigin;
        };
    }

    public static BeamLine CutLine(BeamLine line, float[] answer)
    {
        var distToOrigin = answer[1];
        BeamLine line2 = line;
        line2.length = distToOrigin;
        return line2;
    }

    public void ReplaceCutLines(BeamLine line)
    {
        lines[Key(line)] = line;
    }
}