const KNN = require("ml-knn")
var train_dataset = [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
    [2, 2, 2],
    [1, 2, 2],
    [2, 1, 2]
];
var train_labels = [0, 0, 0, 1, 1, 1];
var knn = new KNN(train_dataset, train_labels, { k: 2 });

var test_dataset = [
    [0.9, 0.9, 0.9],
    [1.1, 1.1, 1.1],
    [1.1, 1.1, 1.2],
    [1.2, 1.2, 1.2],
]

var ans = knn.predict(test_dataset)
console.log(ans)

globalThis._KNN = KNN