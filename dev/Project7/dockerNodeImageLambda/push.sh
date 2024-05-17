aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 097514914760.dkr.ecr.us-east-1.amazonaws.com
docker tag dockerplaywrightlambda:latest 097514914760.dkr.ecr.us-east-1.amazonaws.com/test_han_arm64:latest
docker push 097514914760.dkr.ecr.us-east-1.amazonaws.com/test_han_arm64:latest