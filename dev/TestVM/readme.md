# doc
https://docs.cloud.google.com/compute/docs/connect/standard-ssh?hl=zh-tw#gcloud

# ssh
        # 建立金鑰
        ssh-keygen -t rsa -f C:\Users\johny\.ssh\gcp_key_tmp -C hanyu
        # 將gcp_key_tmp.pub的內容貼到VM的SSH金鑰中, 輸入下方指令進入VM, 注意VM每次重啟時IP都會變
        # 如果無上連上, 就是HOST("C:\Users\johny\.ssh\known_hosts")被記錄到舊的資料, 打開檔案將舊資料刪除就能重新連上並加入fingerprint
        ssh -i C:\Users\johny\.ssh\gcp_key_tmp2 -L 8080:localhost:8188 hanyu@35.192.145.44
        ssh -i C:\Users\johny\.ssh\gcp_key_tmp2 hanyu@136.116.217.32
        # 打開8000的http server後就能用本機的8080連上
        python3 -m http.server 8000
        # 看PORT/pid
        sudo ss -tunlp
        sudo kill [pid]


        # 新電腦建立金鑰
        ssh-keygen -t rsa -C hanyu
        cd C:\Users\johny\.ssh
        cat id_rsa
        ssh -i C:\Users\johny\.ssh\id_rsa -L 8080:localhost:8188 -L 8081:localhost:8080 hanyu@34.63.152.101
        ssh -i C:\Users\johny\.ssh\id_rsa hanyu@34.63.152.101
        scp -i C:\Users\johny\.ssh\id_rsa C:\Users\johny\Downloads\face_yolov8n.pt hanyu@34.63.152.101:~/

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
        scp -i C:\Users\johny\.ssh\gcp_key_tmp2 "C:\Users\johny\Documents\bin\webui_forge_cu121_torch231\webui\models\Stable-diffusion\ponyRealism_V22.safetensors" hanyu@34.135.21.10:~/div/ComfyUI/models/checkpoints/

        scp -i C:\Users\johny\.ssh\gcp_key_tmp2 "C:\Users\johny\Documents\bin\webui_forge_cu121_torch231\webui\models\Lora\*.safetensors" hanyu@34.135.21.10:~/div/ComfyUI/models/loras

        # copy output
        scp -i C:\Users\johny\.ssh\gcp_key_tmp2 hanyu@34.135.21.10:~/div/ComfyUI/output/*.png ./
        # copy workflows
        scp -i C:\Users\johny\.ssh\gcp_key_tmp2 hanyu@34.135.21.10:~/div/ComfyUI/user/default/workflows/*.json ./workflows
        
        wget -c --content-disposition https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors?download=true

        wget -O ./models/checkpoints/my_model.safetensors "連結"
        # 取得header中的檔名
        wget --content-disposition "https://example.com/download?id=999"
        # 階小技巧：斷點續傳 -c
        wget -c -O big_model.safetensors "連結"
        # 磁碟空間
        df -h

# comfyUI and jupyter 
        ssh -i C:\Users\johny\.ssh\id_rsa -L 8080:localhost:8188 -L 8081:localhost:8080 hanyu@136.114.214.122
        pwd
        cd /home/jupyter

# comfyUI and jupyter and code-server
        ssh -i C:\Users\johny\.ssh\id_rsa -L 8080:localhost:8188 -L 8081:localhost:8080 -L 8082:localhost:9000 hanyu@34.61.251.179
        curl -fsSL https://code-server.dev/install.sh | sh
        # enable code-server
        sudo systemctl enable --now code-server@$USER
        nano ~/.config/code-server/config.yaml # 8080 -> 9000, Ctrl + O -> Enter (存檔), Ctrl + X (離開)
        sudo systemctl restart code-server@$USER
        # password -> /home/hanyu/.config/code-server/config.yaml



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

        wget -c --content-disposition https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors?download=true
        wget -c --content-disposition https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt/resolve/main/svd_xt.safetensors?download=true

        # GPU用量
        nvidia-smi
        watch -n 1 nvidia-smi

        # CPU
        sudo apt-get install htop
        htop

        # CPU
        top

        watch -n 1 "free -h && nvidia-smi"

        wget -c --content-disposition https://huggingface.co/Comfy-Org/ACE-Step_ComfyUI_repackaged/resolve/main/all_in_one/ace_step_v1_3.5b.safetensors?download=true

# manager 
        cd ~/ComfyUI/custom_nodes
        git clone https://github.com/ltdrdata/ComfyUI-Manager.git
        # restart ui
        # install Impact Pack, Impact Subpack, IPAdapter Plus


# ab
        # set host
        $_host_="35.184.90.69"
        # connect
        ssh -i C:\Users\johny\.ssh\id_rsa -L 8080:localhost:8188 -L 8081:localhost:8080 -L 8082:localhost:9000 "hanyu@$_host_"
        # goto remote vscode
        http://localhost:8082/?folder=/home/hanyu