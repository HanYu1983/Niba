package alg

import (
	"app2/data"
)

func PlayerTurn(origin data.Gameplay, inputCh <-chan interface{}) (data.Gameplay, error) {
	var err error
	gameplay := origin
	for {
		cmd := <-inputCh
		gameplay, err = HandleCursor(gameplay, cmd)
		if err != nil {
			return origin, err
		}
		gameplay, err = HandleCamera(gameplay, cmd)
		if err != nil {
			return origin, err
		}
		switch detail := cmd.(type) {
		case data.CommandKeyDown:
			switch detail.KeyCode {
			default:
				gameplay, err = UnitMenuPhase(gameplay, "", inputCh)
				if err != nil {
					Alert(err)
					continue
				}
			}
		default:
			var _ = detail
		}
		if gameplay.Done != nil {
			break
		}
	}
	return gameplay, nil
}
