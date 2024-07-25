# Nginx图片处理方案与一般应用程序方案的比较：

# Nginx方案优点：
# 1. 性能高：直接在Web服务器层面处理，减少了应用程序的负担
# 2. 配置简单：通过Nginx配置即可实现，无需编写额外的应用代码
# 3. 实时处理：可以根据URL参数动态处理图片，无需预先生成多个尺寸
# 4. 节省存储空间：只需存储原始图片，无需存储多个尺寸的副本

# Nginx方案缺点：
# 1. 功能相对有限：只能进行基本的图片处理操作
# 2. 灵活性较低：难以实现复杂的图片处理逻辑
# 3. 依赖Nginx模块：需要安装额外的Nginx模块，可能增加服务器维护难度

# 一般应用程序方案优点：
# 1. 灵活性高：可以实现更复杂的图片处理逻辑
# 2. 功能丰富：可以使用各种图片处理库，实现更多样化的效果
# 3. 易于集成：可以与应用程序的其他功能无缝集成

# 一般应用程序方案缺点：
# 1. 性能较低：需要应用程序处理请求，可能增加服务器负载
# 2. 开发成本高：需要编写和维护专门的图片处理代码
# 3. 可能需要缓存：为提高性能，可能需要实现缓存机制，增加复杂性

# 需要额外安装的模块：
# 1. ngx_http_image_filter_module：用于图片处理，包括调整大小、裁剪和旋转
#    安装命令：sudo apt-get install nginx-extras
# 2. libgd：图形库，用于支持图片处理功能
#    安装命令：sudo apt-get install libgd-dev
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }

    location /images/ {
        alias /path/to/images/;
        
        # 启用图片处理
        image_filter_buffer 10M;
        image_filter_jpeg_quality 75;
        image_filter_webp_quality 75;
        
        # 使用说明：
        # 1. 调整图片大小：在URL后添加 ?width=宽度&height=高度
        #    例如：/images/example.jpg?width=300&height=200
        # 2. 裁剪图片：在URL后添加 ?crop=宽度x高度
        #    例如：/images/example.jpg?crop=100x100
        # 3. 旋转图片：在URL后添加 ?rotate=角度
        #    例如：/images/example.jpg?rotate=90
        # 4. 可以组合使用多个参数，用&连接
        #    例如：/images/example.jpg?width=300&height=200&rotate=45
        
        # 根据查询参数调整图片大小
        if ($args ~ "width=(\d+)&height=(\d+)") {
            set $width $1;
            set $height $2;
            image_filter resize $width $height;
        }
        
        # 根据查询参数裁剪图片
        if ($args ~ "crop=(\d+)x(\d+)") {
            set $crop_width $1;
            set $crop_height $2;
            image_filter crop $crop_width $crop_height;
        }
        
        # 根据查询参数旋转图片
        if ($args ~ "rotate=(\d+)") {
            set $rotate $1;
            image_filter rotate $rotate;
        }
    }
}
