package core

import (
	"fmt"
	"strconv"
	"strings"
)

func IntsToString(ints []int) string {
	return strings.Trim(strings.Replace(fmt.Sprint(ints), " ", ",", -1), "[]")
}

func IntsToStrings(ints []int) []string {
	strs := make([]string, len(ints))
	for i := range ints {
		strs[i] = strconv.Itoa(ints[i])
	}
	return strs
}
