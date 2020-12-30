package tool

func Min(x, y int) int {
	if x < y {
		return x
	}
	return y
}

func Max(x, y int) int {
	if x > y {
		return x
	}
	return y
}

func Clamp(v int, min int, max int) (int, bool) {
	if v < min {
		return min, true
	}
	if v >= max {
		return max - 1, true
	}
	return v, false
}
