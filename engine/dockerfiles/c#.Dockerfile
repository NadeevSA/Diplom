FROM mcr.microsoft.com/dotnet/sdk:6.0
ADD . /app/
WORKDIR /app
ARG BUILD_COMMAND
RUN $BUILD_COMMAND
ARG RUN_FILE
ENV RUN_FILE_CMD ${RUN_FILE}
WORKDIR /app/bin/Debug/net6.0
CMD dotnet ${RUN_FILE_CMD}