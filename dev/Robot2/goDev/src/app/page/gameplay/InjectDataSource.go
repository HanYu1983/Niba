package gameplay

import "app/tool/uidata"

func InjectDataSource(ctx uidata.UI, forWhat interface{}) (uidata.UI, error) {
	for ID, page := range ctx.GameplayPages {
		page.Robots = model.QueryRobots()
		// init map
		ctx.GameplayPages = uidata.AssocIntGameplayPage(ctx.GameplayPages, ID, page)
	}
	return ctx, nil
}
