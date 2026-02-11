import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt

def plot_accuracy(results):
    names = list(results.keys())
    scores = list(results.values())

    plt.figure()
    plt.bar(names, scores)
    plt.title("Model Accuracy Comparison")
    plt.xlabel("Algorithm")
    plt.ylabel("Score")

    plt.savefig("static/accuracy_plot.png")
    plt.close()
