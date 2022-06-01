package main

import (
	"bufio"
	"fmt"
	"os"
)

/*
cocgbaeyjcokufvnoqolhgufjlehdjjyfzhsonkfiunhzhzdyclrxctiuymryibfbodvqmsgzsydauhagvfmwbjilxmklxubsdxl
cgbaeyujcdkbvuoqolehgufjglehjjyfzhsookfiunxzhwzzwclxctiuymrribfbyodjmngzwyduhagxvfmtwqbjimklxubsdl

*/
func main() {

	reader := bufio.NewReader(os.Stdin)

	s1, _ := reader.ReadString('\n')

	s2, _ := reader.ReadString('\n')

	m := make([][]int, len(s1)+1)

	for i := range m {

		m[i] = make([]int, len(s2)+1)

	}

	res := Livenstein(m, s1, s2)

	fmt.Println(res)

}

func Livenstein(matr [][]int, s1 string, s2 string) int {

	matr[0][0] = 0

	N := len(s2) + 1

	M := len(s1) + 1

	for j := 1; j < N; j++ {

		matr[0][j] = matr[0][j-1] + 1

	}

	for i := 1; i < M; i++ {

		matr[i][0] = matr[i-1][0] + 1

		for j := 1; j < N; j++ {

			if s1[i-1] != s2[j-1] {

				matr[i][j] = min(matr[i-1][j]+1,

					matr[i][j-1]+1,

					matr[i-1][j-1]+1)

			} else {

				matr[i][j] = matr[i-1][j-1]

			}

		}

	}

	return matr[M-1][N-1]

}

func min(a, b, c int) int {

	var t int

	if b < c {

		t = b

	} else {

		t = c

	}

	if t < a {

		return t

	} else {

		return a

	}

}
