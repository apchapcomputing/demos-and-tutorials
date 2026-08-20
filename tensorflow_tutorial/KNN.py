import sklearn
from sklearn.utils import shuffle
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import numpy as np
from sklearn import linear_model, preprocessing

data = pd.read_csv('car/car.data')
# print(data.head())

# transform nonnumerical data using LabelEncoder.fit_transform
le = preprocessing.LabelEncoder()
# create list for each column
buying = le.fit_transform(list(data['buying']))
maint = le.fit_transform(list(data['maint']))
door = le.fit_transform(list(data['door']))
persons = le.fit_transform(list(data['persons']))
lug_boot = le.fit_transform(list(data['lug_boot']))
safety = le.fit_transform(list(data['safety']))
cls = le.fit_transform(list(data['class']))

predict = 'class'

X = list(zip(buying, maint, door, persons, lug_boot, safety))
y = list(cls)

x_train, x_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, test_size=0.1)

model = KNeighborsClassifier(n_neighbors=9)
model.fit(x_train, y_train)
acc = model.score(x_test, y_test)
print(acc)

predictions = model.predict(x_test)

names = ['unacc', 'acc', 'good', 'vgood']
for x in range(len(predictions)):
    print(f'Predicted Data: {names[predictions[x]]}, Data: {x_test[x]}, Actual: {names[y_test[x]]}')
    n = model.kneighbors([x_test[x]], 9, True)  # nearest neighbors to prediction
    print(f'N: {n}')

