package tool

func Inc(l int, r int, min int, max int) (int, bool) {
	ret := l + r
	if ret < min {
		return min, true
	}
	if ret >= max {
		return max - 1, true
	}
	return ret, false
}
