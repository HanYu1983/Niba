package desktop

import "fmt"

func MoveCard(s1 CardStack, s2 CardStack, card Card, index int) (CardStack, CardStack, error) {
	findID := -1
	for _findID, c := range s1 {
		if c == card {
			findID = _findID
			break
		}
	}
	if findID == -1 {
		return s1, s2, fmt.Errorf("card not found")
	}
	s1 = append(s1[0:findID], s1[findID+1:]...)
	s2 = append(append(s2[0:index], card), s2[index:]...)
	return s1, s2, nil
}
