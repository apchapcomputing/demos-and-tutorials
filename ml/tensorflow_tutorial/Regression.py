import pandas as pd
import numpy as np
import sklearn
from sklearn import linear_model
import matplotlib.pyplot as pyplot
from matplotlib import style
import pickle

data = pd.read_csv('student/student-mat.csv', sep=';')
data = data[['G1', 'G2', 'G3', 'studytime', 'failures', 'absences', 'freetime']]

predict = 'G3'

X = np.array(data.drop([predict], 1))
y = np.array(data[predict])
x_train, x_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, test_size=0.1)

# best = 0
# for _ in range(30):
#     x_train, x_test, y_train, y_test = sklearn.model_selection.train_test_split(X, y, test_size=0.1)
#
#     linear = linear_model.LinearRegression()
#
#     linear.fit(x_train, y_train)  # fit model
#     acc = linear.score(x_test, y_test)  # get accuracy of model
#     print(acc)
#
#     # Only save model, if accuracy is better than current model
#     if acc > best:
#         best = acc
#         # Pickle allows us to save the model, so we do not have to retrain during every run
#         with open("studentmodel.pickle", "wb") as f:
#             pickle.dump(linear, f)

# Load in pickle model
pickle_in = open("studentmodel.pickle", 'rb')
linear = pickle.load(pickle_in)

print(f"Coefficients: {linear.coef_}")
print(f"Intercept: {linear.intercept_}")

predictions = linear.predict(x_test)  # predict outputs for test inputs
# for p in range(len(predictions)):
    # print(predictions[p], x_test[p], y_test[p])

# Begin plotting
p = 'freetime'
style.use('ggplot')
pyplot.scatter(data[p], data[predict])
pyplot.xlabel(p)
pyplot.ylabel('Final Grade')
pyplot.show()
