package main

import (
	"bufio"
	"io"
	"os"
	"strconv"
	"strings"
)

/*
5
alla 4 100
gena 6 1000
gosha 2 90
rita 2 90
timofey 4 80
*/
type Human struct {
	ProblemsSolved int
	Fine           int
	Name           string
}

func Compare(a, b Human) bool {
	if a.ProblemsSolved > b.ProblemsSolved {
		return true
	}
	if a.ProblemsSolved == b.ProblemsSolved {
		if a.Fine < b.Fine {
			return true
		}
		if a.Fine == b.Fine {
			if a.Name < b.Name {
				return true
			} else {
				return false
			}
		}
		return false
	}
	return false
}

func main() {
	var writer = bufio.NewWriter(os.Stdout)
	reader := bufio.NewReader(os.Stdin)
	line, _ := reader.ReadString('\n')
	var N, _ = strconv.Atoi(strings.Fields(line)[0])
	var humans = make([]Human, N)
	for i := 0; i < N; i++ {
		line, _ = reader.ReadString('\n')

		var arr = strings.Fields(line)
		var name = arr[0]
		var solved, _ = strconv.Atoi(arr[1])
		var fine, _ = strconv.Atoi(arr[2])

		var human = Human{
			ProblemsSolved: solved,
			Fine:           fine,
			Name:           name,
		}
		humans[i] = human
	}

	basicSort(humans, len(humans))
	for i := len(humans) - 1; i >= 0; i-- {
		io.WriteString(writer, humans[i].Name+"\n")
	}
	writer.Flush()
}

func basicSort(humans []Human, l int) {
	for i := 0; i < l; i++ {
		for j := i + 1; j < l; j++ {
			if Compare(humans[i], humans[j]) {
				t := humans[i]
				humans[i] = humans[j]
				humans[j] = t
			}
		}
	}
}
