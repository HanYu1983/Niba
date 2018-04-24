using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Assertions;
using System.IO;

namespace Bird
{
    public enum ControlState
    {
        Pending, Playing, GameOver
    }

    public class GameManager : MonoBehaviour
    {
        // 以下的編輯器UX都還有改進空間
        public int xmin, xmax, ymin, ymax;
        public float moveSpeed, jumpSpeed;
        [Tooltip("關卡最大長度, 用來計算diff. 超過這個值的話diff以0或1來算")]
        public int maxLength;

        public Transform mainCamera;
        public Bird bird;
        public ControlState state;
        public LevelManager levelManager;
        public PageManager pageManger;
        public float createFrameOffset;
        // 以下為除錯顯示用
        public int score;

        private void Awake()
        {
            Bird.OnCollide += OnCollide;
        }

        private void Start()
        {
            // 打開開始頁並顯示最高分數
            var page = pageManger.OpenPage("Start");
            var scoreP = page.GetComponentInChildren<ScorePanel>();
            Assert.IsNotNull(scoreP, "you must set score panel");
            scoreP.maxScore = MaxScore();
            scoreP.UpdateView();
        }

        private void OnCollide(Bird hit, Collider collider)
        {
            // 碰撞後就輸了
            if(state == ControlState.Playing)
            {
                state = ControlState.GameOver;
                OnGameOver();
                return;
            }
        }

        private void Update()
        {
            if(state != ControlState.Playing)
            {
                return;
            }
            // 左鍵跳躍
            if (Input.GetMouseButtonDown(0))
            {
                bird.Jump(jumpSpeed);
            }
            // 以距離自動成生關卡
            if(bird.X > levelManager.CurrX - createFrameOffset)
            {
                // 一次產10個
                for (var i=0; i<10; ++i)
                {
                    // 計算難度diff
                    var diff = levelManager.CurrX / maxLength;
                    diff = Mathf.Max(0, Mathf.Min(1, diff));
                    diff = 1 - diff;

                    var xoffset = xmax - xmin;
                    var xlength = (int)(xmin + xoffset * diff);
                    var yoffset = ymax - ymin;
                    var ylength = (int)(ymin + yoffset * diff);

                    var y1 = Random.Range(1, 5);
                    var y2 = Mathf.Min(10, y1 + ylength);
                    levelManager.Create(xlength, 1, y1, y2);
                }
            }
            // 刪除經過的, 節省記憶體
            levelManager.ClearFrameBelow(bird.X - 5);
            // 顯示分數在右方面版, 單純除錯用
            var score = levelManager.Score(bird.X);
            this.score = score;

            // 移動鳥
            bird.MoveX(moveSpeed);
            // 同步攝像機的位置
            SyncCameraPosX();
        }

        void SyncCameraPosX()
        {
            var cp = mainCamera.transform.localPosition;
            cp.x = bird.X;
            mainCamera.transform.localPosition = cp;
        }

        public void StartGame()
        {
            // 關閉所有頁面
            pageManger.ClosePage();
            // 重設鳥位置
            bird.ResetPosition();
            // 重設關卡
            levelManager.Clear();
            state = ControlState.Playing;
        }

        public void RestartGame()
        {
            StartGame();
        }

        void OnGameOver()
        {
            // 計算最高分
            var score = levelManager.Score(bird.X);
            SetMaxScoreIfExceed(score);
            var maxScore = MaxScore();

            // 顯示結果頁和分數
            var page = pageManger.OpenPage("GameOver");
            var scoreP = page.GetComponentInChildren<ScorePanel>();
            Assert.IsNotNull(scoreP, "you must set score panel");
            scoreP.maxScore = MaxScore();
            scoreP.score = score;
            scoreP.UpdateView();
        }

        // 檔案系統用(如果使用PlayerPrefs就用不到)
        public class Memory
        {
            public int maxScore;
        }

        int MaxScore()
        {
            var maxScore = PlayerPrefs.GetInt("maxScore");
            return maxScore;
            // use file system
            /*
            var path = Application.persistentDataPath + "/save.json";
            var isExist = File.Exists(path);
            Debug.Log(isExist);

            if(isExist == false)
            {
                return 0;
            }
            
            var json = File.ReadAllText(path);
            var memory = JsonUtility.FromJson<Memory>(json);
            return memory.maxScore;
            */
        }

        void SetMaxScoreIfExceed(int score)
        {
            var maxScore = PlayerPrefs.GetInt("maxScore");
            if (score > maxScore)
            {
                PlayerPrefs.SetInt("maxScore", score);
                PlayerPrefs.Save();
            }
            // use file system
            /*
            var maxScore = MaxScore();
            if (score > maxScore)
            {
                Debug.Log("save:" + score);
                var memory = new Memory();
                memory.maxScore = score;
                var json = JsonUtility.ToJson(memory);
                var path = Application.persistentDataPath + "/save.json";
                File.WriteAllText(path, json);
            }*/
        }
    }
}