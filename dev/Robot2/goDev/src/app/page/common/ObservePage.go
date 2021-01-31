package common

import (
	"app/tool/def"
	"app/tool/uidata"
)

func ObservePage(origin uidata.UI, pageID int) (uidata.UI, error) {
	ret, err := def.Model.ObservePage(origin, pageID)
	return ret.(uidata.UI), err
}
