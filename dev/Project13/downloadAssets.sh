# ~/.aws/credentials
export AWS_PROFILE=smartcanvas
aws sts get-caller-identity
aws s3 cp s3://test-han-tmp-2/kotodaman/assets5/ html/assets5 --recursive