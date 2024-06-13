# run
  docker build -t test-han-arm64 .
  docker tag test-han-arm64:latest public.ecr.aws/g6d0w4u5/test-han-arm64:latest

  vi ~/.aws/credentials
  export AWS_PROFILE=smartcanvas
  aws sts get-caller-identity
  
  aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/g6d0w4u5
  docker push public.ecr.aws/g6d0w4u5/test-han-arm64:latest