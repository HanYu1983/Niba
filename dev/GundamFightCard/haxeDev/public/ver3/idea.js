(function(module){

    function create(){
        return {
            cards: [],
            cardStacks: [],
        }
    }

    function moveCard(table){

    }

    function getCardStacks(table){

    }

    module.create = create
    module.moveCard = moveCard
    module.getCardStacks = getCardStacks
})();

function initGetter(module, fields){
    for(f of fields){
        module[`get${f}`] = function(ctx){
            return ctx[f]
        }
    }
}

(function(module){
    function create(){
        return {
            tap: false,
            faceUp: false,
            protoId: null,
            id: 0,
        }
    }
    function tapPath(){
        return ["tap"]
    }
    function getTap(ctx){
        return ctx.tap
    }
    function getFaceUp(ctx){
        return ctx.faceUp
    }
    function setFaceUp(ctx, value){
        ctx.faceUP = value;
    }
    initGetter(module, create())
    initSetter(module, create())
    module.create = create
})();




