package main

import (
	"bufio"
	"fmt"
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
	fmt.Println(line)
	var N, _ = strconv.Atoi(strings.Fields(line)[0])
	var humans = make([]Human, N)
	for i := 0; i < N; i++ {
		var line, _ = reader.ReadString('\n')
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

	quicksort(humans, 0, len(humans))
	for i := len(humans) - 1; i >= 0; i-- {
		io.WriteString(writer, humans[i].Name+"\n")
	}
	writer.Flush()
}

func median(h1, h2, h3 Human) Human {
	if Compare(h2, h1) {
		h1, h2 = h2, h1
	}

	if Compare(h1, h3) {
		h3, h1 = h1, h3

		if Compare(h2, h1) {
			h1, h2 = h2, h1
		}
	}
	return h1
}

func quicksort(arr []Human, left, right int) []Human {
	if left >= right-1 {
		return arr
	} else {

		var pivot = median(arr[left], arr[(right+left)/2], arr[right-1])
		var newLef, newR = partition(arr, left, right, pivot)

		quicksort(arr, left, newLef)
		quicksort(arr, newR, right)
		return arr
	}
}

func partition(arr []Human, left, right int, pivot Human) (int, int) {
	for {
		if left >= right-1 {
			break
		}

		for Compare(pivot, arr[left]) {
			left++
		}

		for Compare(arr[right-1], pivot) {
			right--
		}

		if Compare(arr[left], arr[right-1]) {
			arr[left], arr[right-1] = arr[right-1], arr[left]
		}
	}
	return left, right - 1
}
