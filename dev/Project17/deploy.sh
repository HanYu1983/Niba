# ~/.aws/credentials
export AWS_PROFILE=smartcanvas
aws sts get-caller-identity
aws s3 cp ./public s3://test-han-tmp-2/backup/Project17 --recursive