# doc
https://docs.cloud.google.com/compute/docs/connect/standard-ssh?hl=zh-tw#gcloud

# ssh
        # 建立金鑰
        ssh-keygen -t rsa -f C:\Users\johny\.ssh\gcp_key_tmp -C hanyu
        # 將gcp_key_tmp.pub的內容貼到VM的SSH金鑰中, 輸入下方指令進入VM, 注意VM每次重啟時IP都會變
        # 如果無上連上, 就是HOST("C:\Users\johny\.ssh\known_hosts")被記錄到舊的資料, 打開檔案將舊資料刪除並重新加入fingerprint
        ssh -i C:\Users\johny\.ssh\gcp_key_tmp2 -L 8080:localhost:8188 hanyu@136.119.70.203
        ssh -i C:\Users\johny\.ssh\gcp_key_tmp2 hanyu@136.119.70.203
        # 打開8000的http server後就能用本機的8080連上
        python3 -m http.server 8000
        # 看PORT/pid
        sudo ss -tunlp
        sudo kill [pid]

# gcloud
        # create .ssh folder and connect
        # path "C:\Users\johny\.ssh\"
        gcloud compute ssh test-vm2

# apache2 http-server
        sudo apt-get update
        sudo apt-get install apache2 -y
        sudo systemctl stop apache2
        # 禁止開機自動啟動
        sudo systemctl disable apache2

# comfyUI
        git clone https://github.com/comfyanonymous/ComfyUI.git
        cd ComfyUI

        python3 -m venv venv

        # 3. 啟動虛擬環境 (啟動後你的指令列開頭會出現 (venv) 字樣)
        source venv/bin/activate

        # 4. 升級 pip
        pip install --upgrade pip

        # 5. 一次性安裝 ComfyUI 官方要求的所有套件
        # 官方目錄裡通常有一個 requirements.txt
        pip install -r requirements.txt

        python3 main.py --listen 0.0.0.0

# download model
        # 本地COPY
        scp -i C:\Users\johny\.ssh\gcp_key_tmp2 "C:\Users\johny\Documents\bin\webui_forge_cu121_torch231\webui\models\Stable-diffusion\nostrarealisticmix_v20SDXLVAE.safetensors" hanyu@136.119.70.203:~/div/ComfyUI/models/checkpoints/
        
        wget -c --content-disposition https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors?download=true

        wget -O ./models/checkpoints/my_model.safetensors "連結"
        # 取得header中的檔名
        wget --content-disposition "https://example.com/download?id=999"
        # 階小技巧：斷點續傳 -c
        wget -c -O big_model.safetensors "連結"
        # 磁碟空間
        df -h

        

# history
        ssh -i C:\Users\johny\.ssh\gcp_key_tmp2 -L 8080:localhost:8188 hanyu@34.173.106.164
        # 查看空間佔用
        sudo du -h --max-depth=1 /home/hanyu | sort -rh
        sudo rm -r /home/johny/div
        df -h
        # 刪檔好用工具
        sudo apt-get install -y ncdu
        ncdu /
        # 新增硬碟空間
        # 尋找硬碟名稱(此例為nvme0n1)
        lsblk
        # 安裝插件
        sudo apt-get install -y cloud-guest-utils fdisk
        # 推開空間
        sudo growpart /dev/nvme0n1 1
        sudo resize2fs /dev/nvme0n1p1


