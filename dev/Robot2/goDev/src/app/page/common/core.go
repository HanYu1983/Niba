package common

import (
	v1 "app/model/v1"
	"app/tool/def"
	"app/tool/viewer"
)

var (
	view  viewer.IViwer = def.View
	model IModel        = &v1.DefaultModel
)

var (
	View  = view
	Model = model
)
