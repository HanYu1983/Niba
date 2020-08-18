View = {
    AskOneHandCard: function (player, cardStack, cb) {
        console.log(cardStack)
        cb(null)
    },
    AskCommand: function (player, answer) {
        console.log(player, answer)
        answer.CmdUseCard("abc")
    },
    Render: function (gameplay) {
        console.log(gameplay)
    }
}