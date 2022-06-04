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

func IfStringLenIsValid(str string) bool {
	if len(str) == 0 || len(str) > 255 {
		return false
	}
	return true
}

func TransformStringsToFormat(str string) string {
	return strings.Replace(str, "\r\n", "\n", -1)
}
