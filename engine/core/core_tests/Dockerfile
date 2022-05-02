FROM golang:1.17 AS build_base

COPY go.mod /go/app/
WORKDIR /go/app/
RUN go mod download
COPY projects/app1/. /go/app/

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o build/app

FROM alpine:3.9
RUN apk add ca-certificates
COPY --from=build_base /go/app/build/app /site/app

CMD ["/site/app"]