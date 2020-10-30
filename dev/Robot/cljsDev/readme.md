# Package Rule

1. 每支cljs不能引用自己所在資料夾中的cljs
1. 每支cljs不能引用父層的cljs
1. 每支cljs可以引用子層的cljs
1. 每支cljs可以引用兄弟層的tool資料夾中cljs
1. 在tool資料夾中的cljs只可以引用"其它"層的tool資料夾的cljs.
1. 任何只引用tool的cljs可以當成是獨立的
1. 在tool資料夾中的cljs都只能是獨立的
1. 只有命名為core可以引用兄弟層中非tool資料夾的cljs
1. core只能被父層引用
1. main > core > 子層core > other name > tool