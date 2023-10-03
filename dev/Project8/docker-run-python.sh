docker run -ti --name dev-project8-pythonDev \
-v "$PWD":/tmp/project \
-w /tmp/project/ \
arm64v8/python:3.10 bash