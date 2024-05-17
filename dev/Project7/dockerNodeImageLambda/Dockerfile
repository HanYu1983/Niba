FROM public.ecr.aws/lambda/nodejs:20-arm64
WORKDIR /han
COPY ./package.json /han/package.json
RUN npm i
# RUN npx -y playwright@1.44.0 install --with-deps

# Copy function code
COPY index.js ${LAMBDA_TASK_ROOT}
  
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]