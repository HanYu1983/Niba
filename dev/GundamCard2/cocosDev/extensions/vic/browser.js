"use strict";
exports.methods={
    
    widgetFull: async function(){
        const type = Editor.Selection.getLastSelectedType();
        const uuid = Editor.Selection.getLastSelected(type);

        // 刪除所有的widget component
        let node = await Editor.Message.request('scene', 'query-node', uuid);
        let comps = node.__comps__;
        for(let i = 0; i < comps.length; ++i){
            const comp = comps[i];
            const compType = comp.type;
            if(compType === 'cc.Widget'){
                Editor.Message.request('scene', 'remove-component', {uuid:comp.value.uuid.value});
            }
        }

        // 創建新的widget component
        await Editor.Message.request('scene', 'create-component', {uuid:uuid, component:'cc.Widget'});

        // 重新query一次node, 不然無法正確運作
        node = await Editor.Message.request('scene', 'query-node', uuid);

        // 設置widget的參數
        comps = node.__comps__;
        for(let i = 0; i < comps.length; ++i){
            const comp = comps[i];
            const compType = comp.type;
            if(compType === 'cc.Widget'){
                const props = ['isAlignLeft', 'isAlignRight', 'isAlignTop', 'isAlignBottom'];
                for(const key in props){
                    Editor.Message.request('scene', 'set-property', {
                        dump:{
                            type: 'CCBoolean',
                            value: true
                        },
                        path:'__comps__.' + i + '.' + props[key],
                        uuid:uuid
                    });
                }
                const propsValue = {left:0, right:0, top:0, bottom:0};
                for(const key in propsValue){
                    Editor.Message.request('scene', 'set-property', {
                        dump:{
                            type: 'CCNumber',
                            value: propsValue[key]
                        },
                        path:'__comps__.' + i + '.' + key,
                        uuid:uuid
                    });
                }
                break;
            }
        }
    }
};
exports.load= async function(){};
exports.unload=function(){};