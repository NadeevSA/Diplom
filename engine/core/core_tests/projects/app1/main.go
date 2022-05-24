package main

import (
	"bufio"
	"fmt"
	uuid2 "github.com/google/uuid"
	"log"
	"os"
)

func main() {
	file, err := os.Open("file.txt")
	if err != nil {
		log.Fatal("Can not open file")
	}
	uuid, _ := uuid2.NewUUID()
	fmt.Println(uuid)
	var i int
	fmt.Scan(&i)
	fmt.Println("read number", i, "from stdin")

	var j int
	fmt.Scan(&j)
	fmt.Println("read number", j, "from stdin")
	fmt.Println(i + j)

	reader := bufio.NewReader(file)
	cString, err := reader.ReadString('\n')
	log.Println(cString)
}
