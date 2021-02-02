package common

import (
	"app/tool/uidata"
)

func ObservePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	ret, err := origin.Model.ObservePage(origin, pageID)
	return ret.(uidata.UI), err
}
