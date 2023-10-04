# from sklearn.decomposition import PCA
# import numpy as np
# origin = [0]*4096
# print(origin)
# pca = PCA(n_components=2048)
# X_reduced = pca.fit_transform(np.array([origin]))
# print(len(X_reduced))

# import numpy as np
# from sklearn.decomposition import PCA
# X = np.array([[-1, -1], [1, 0], [0, 1]])
# pca = PCA(n_components=2)
# print(pca.fit_transform(X))
# # PCA(copy=True, n_components=2, whiten=False)
# print(pca.explained_variance_ratio_) 


# import numpy as np
# a = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
# # 使用reshape方法，將a轉換為一個2048行2列的矩陣
# a = a.reshape(5, 2)
# print(a)
# # 使用mean方法，沿著第二個維度（列）計算每行的平均值，得到一個長度為2048的列陣
# a = a.mean(axis=1)
# print(a)


def downsample(array):
    # 創建一個空的列表，用來儲存下採樣後的結果
    result = []
    # 遍歷原陣列的索引，每隔兩個取一個
    for i in range(0, len(array), 2):
        # 將原陣列中對應索引的元素加入結果列表
        result.append(array[i])
    # 返回結果列表
    return result

origin = [0]*4096
print(len(downsample(origin)))
