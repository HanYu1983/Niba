package helper

import "app/tool/uidata"

type UIReducer func(origin uidata.UI, evt interface{}) (uidata.UI, error)

func UIReduce(reducers ...UIReducer) UIReducer {
	return func(origin uidata.UI, evt interface{}) (uidata.UI, error) {
		var err error
		ctx := origin
		for _, reducer := range reducers {
			ctx, err = reducer(ctx, evt)
			if err != nil {
				return origin, err
			}
		}
		return ctx, nil
	}
}
