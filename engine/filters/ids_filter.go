package filters

type IdsIntent struct {
	Ids []int
}

type FilterBy struct {
	Field string
	Args  []string
}
