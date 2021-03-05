package types

import (
	"app/tool/uidata"
	"fmt"
)

var (
	DefaultNormalLevels = map[string]NormalLevel{}
)

func init() {
	// 注意： 以下的key是不能更動的，因為會拿來當存檔的資料，
	// 通常中文化是不會寫在這裡的，但因為這個遊戲不給人玩，所以沒差
	for i := 0; i < 10; i++ {
		key := fmt.Sprintf("陸L%v", i+1)
		DefaultNormalLevels[key] = NormalLevel{
			Cursor: i,
			MenuID: uidata.Menu1DGroundLevelMenu,
		}
	}

	for i := 0; i < 10; i++ {
		key := fmt.Sprintf("海L%v", i+1)
		DefaultNormalLevels[key] = NormalLevel{
			Cursor: i,
			MenuID: uidata.Menu1DSeaLevelMenu,
		}
	}

	for i := 0; i < 10; i++ {
		key := fmt.Sprintf("隨機L%v", i+1)
		DefaultNormalLevels[key] = NormalLevel{
			Cursor: i,
			MenuID: uidata.Menu1DRandomLevelMenu,
		}
	}
}
