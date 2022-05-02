package filters

type IdsFilter struct {
	Ids []int
}

type FilterBy struct {
	Field string
	Args  []string
}
