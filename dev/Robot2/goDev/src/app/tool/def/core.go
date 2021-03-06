// Package def 預定義資料。很多檔案都有引用
package def

import (
	"app/tool/viewer"
)

var (
	// View 使用Cocos實作
	View viewer.IView = viewer.Cocos{}
)
