# On using TensorFlow.js

TensorFlow.js is a JavaScript Library for training and deploying machine learning models in the browser and in Node.js.[1]

[1] https://www.tensorflow.org/js/tutorials

## Setup

**Browser Setup**[2]
There are two main ways to get TensorFlow.js in your browser based projects:

- Using script tags.

- Installation from NPM and using a build tool like Parcel, WebPack, or Rollup.

If you are new to web development, or have never heard of tools like webpack or parcel, we recommend you use the script tag approach. If you are more experienced or want to write larger programs it might be worthwhile to explore using build tools.

[2] https://www.tensorflow.org/js/tutorials/setup

### Usage via Script Tag

Add the following script tag to your main HTML file.

```
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>
```

Code sample for script tag setup
```
// Define a model for linear regression.
const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));

model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Generate some synthetic data for training.
const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// Train the model using the data.
model.fit(xs, ys, {epochs: 10}).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  model.predict(tf.tensor2d([5], [1, 1])).print();
  // Open the browser devtools to see the output
});
```