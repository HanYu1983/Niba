# Nginx配置文件，使用FFmpeg处理视频

http {
    server {
        listen 80;
        server_name example.com;

        location / {
            root /var/www/html;
            index index.html index.htm;
        }

        location /videos/ {
            # 设置视频文件的实际存储路径
            # 当请求匹配 /videos/ 位置时，Nginx 将在此路径下查找视频文件
            alias /path/to/videos/;

            # 使用FFmpeg处理视频
            if ($args ~ "format=(\w+)") {
                set $format $1;
                # 重写URL，将请求重定向到 /convert_video 位置
                # ^(.*)$ 匹配整个URL路径
                # $1 捕获的路径将被追加到 /convert_video 后
                # last 表示这是最后一次重写，之后将立即搜索新的位置块
                rewrite ^(.*)$ /convert_video$1 last;
            }
        }

        location ~ ^/convert_video(.*)$ {
            # 将此位置块标记为内部位置
            # 这意味着该位置块只能由内部重定向访问，不能直接从外部访问
            # 这是一个安全措施，防止用户直接访问转换功能
            internal;
            
            set $video_path $1;
            set $output_format $format;

            # 设置FFmpeg命令
            set $ffmpeg_cmd "ffmpeg -i $video_path -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k";

            # 根据输出格式设置不同的FFmpeg参数
            if ($output_format = "mp4") {
                set $ffmpeg_cmd "${ffmpeg_cmd} -f mp4";
            }
            if ($output_format = "webm") {
                set $ffmpeg_cmd "${ffmpeg_cmd} -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -f webm";
            }
            if ($output_format = "ogg") {
                set $ffmpeg_cmd "${ffmpeg_cmd} -c:v libtheora -q:v 7 -c:a libvorbis -q:a 4 -f ogg";
            }

            # 执行FFmpeg命令
            set $ffmpeg_cmd "${ffmpeg_cmd} pipe:1";
            
            # 将请求转发到后端服务
            proxy_pass http://127.0.0.1:8080$video_path?cmd=$ffmpeg_cmd;
            
            # 设置代理头部信息
            # 传递原始主机名
            proxy_set_header Host $host;
            # 传递客户端真实IP地址
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}

# 注意：这个配置需要一个后端服务来实际执行FFmpeg命令
# 你需要实现一个监听在127.0.0.1:8080的服务，接收视频路径和FFmpeg命令，然后执行转换并返回结果
# 如何使用此Nginx配置进行视频转换:

# 1. 确保已安装必要的软件:
#    - Nginx (带有必要的模块)
#    - FFmpeg

# 2. 将此配置文件放置在Nginx的配置目录中，通常是 /etc/nginx/sites-available/

# 3. 创建一个符号链接到 /etc/nginx/sites-enabled/ 目录:
#    sudo ln -s /etc/nginx/sites-available/your_config_file /etc/nginx/sites-enabled/

# 4. 修改配置文件中的以下部分:
#    - server_name: 设置为你的域名
#    - /path/to/videos/: 设置为你存储视频文件的实际路径

# 5. 实现一个后端服务，监听在127.0.0.1:8080，用于执行FFmpeg命令
#    这个服务需要接收视频路径和FFmpeg命令，执行转换并返回结果

# 6. 重启Nginx服务:
#    sudo systemctl restart nginx

# 7. 使用方法:
#    通过在视频URL后添加查询参数来请求不同格式的视频
#    例如:
#    - 原始视频: http://your-domain.com/videos/example.mp4
#    - 转换为WebM: http://your-domain.com/videos/example.mp4?format=webm
#    - 转换为OGG: http://your-domain.com/videos/example.mp4?format=ogg

# 注意: 确保你有足够的服务器资源来处理视频转换，因为这是一个计算密集型操作
