package def

import (
	v1 "app/model/v1"
	"app/tool/protocol"
	"app/tool/viewer"
)

var (
	View  viewer.IViwer   = viewer.Cocos{}
	Model protocol.IModel = &v1.DefaultModel
)
