# install lib
        docker exec -it ai_app pip install -t /custom_libs -r requirements.txt

# run
        docker exec -it ai_app python lesson7_pure_python_sd.py