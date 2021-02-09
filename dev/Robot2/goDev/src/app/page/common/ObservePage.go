package common

import (
	"app/tool/uidata"
)

func ObservePage(origin uidata.UI, pageID string) (uidata.UI, error) {
	ret, err := origin.Model.ObservePage(origin, pageID)
	return ret.(uidata.UI), err
}
