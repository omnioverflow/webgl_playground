import json
import pickle
import numpy as np

def unpickleTestData(fname):
  with open(fname, 'rb') as file:
    X, Y = pickle.load(file)
    return X, Y

X, Y = unpickleTestData('test0.pkl')

Y_ = np.argmax(Y, axis=1).tolist()

print(json.dumps(Y_))

X = X.squeeze()
S = X.shape

for i in range(S[0]):
  Img = X[0,:,:]
  outputFileName = 'img_serialized_' + str(i) + '.txt'
  labelFileName = 'label_serialized_' + str(i) + '.txt'
  
  print(outputFileName)
  with open(outputFileName, 'w') as file_output:
    file_output.write(json.dumps(X[i].tolist()))

  # print(labelFileName)
  # with open(labelFileName, 'w') as file_label:
  #   file_label.write(str(Y_[i]))


print(X.shape)