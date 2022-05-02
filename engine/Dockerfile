FROM golang:1.18 AS build_base

COPY go.mod go.sum /app/
WORKDIR /app/
RUN go mod download
COPY . /app/

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o build/res

FROM alpine:3.9
RUN apk add ca-certificates
COPY --from=build_base /app/build/res /core/app

EXPOSE 8084
CMD ["/core/app"]