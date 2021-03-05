package types

import (
	"app/tool/uidata"
	"fmt"
)

var (
	DefaultNormalLevels = map[string]NormalLevel{}
)

func init() {
	for i := 0; i < 10; i++ {
		key := fmt.Sprintf("Ground%v", i)
		DefaultNormalLevels[key] = NormalLevel{
			Cursor: i,
			MenuID: uidata.Menu1DGroundLevelMenu,
		}
	}

	for i := 0; i < 10; i++ {
		key := fmt.Sprintf("Sea%v", i)
		DefaultNormalLevels[key] = NormalLevel{
			Cursor: i,
			MenuID: uidata.Menu1DSeaLevelMenu,
		}
	}

	for i := 0; i < 10; i++ {
		key := fmt.Sprintf("Random%v", i)
		DefaultNormalLevels[key] = NormalLevel{
			Cursor: i,
			MenuID: uidata.Menu1DRandomLevelMenu,
		}
	}
}
