import {Template} from "meteor/templating";
import {Posts} from "/client/main";
import Chart from "chart.js";
import {HTTP} from "meteor/http";
import {Session} from "meteor/session";

const CATEGORY_INDEX = {
    "emotion": 0,
    "products": 1,
    "work": 2,
    "finance": 3,
    "vision": 4,
    "social": 5,
    "logging": 6,
    "interest": 7
}

let sentimentABSManager = {
    "emotion": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "products": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "work": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "finance": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "vision": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "social": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "logging": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "interest": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    }
}

let sentimentABSCompany = {
    "emotion": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "products": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "work": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "finance": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "vision": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    },
    "social": {
        "negative": 0,
        "neutral": 0,
        "positive": 0
    }
}

let drawnCharts = [];

const barChartData = {
    labels: ['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung'],
    datasets: [
        {
            label: "negativ",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "#e74a3b"
        },
        {
            label: "neutral",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "#858796"
        },
        {
            label: "positiv",
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: "#1cc88a"
        }
    ],
};

let rvBarChartData = new ReactiveVar(barChartData);

Template.sentimentbar.onRendered(function () {
    generateDataSets();

    this.autorun(() => {
        if (String(Session.get("TP")) === "MANAGER") {
            barChartData.labels = (['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung', "Logging", "Interesse"]);
        } else if (String(Session.get("TP")) === "COMPANY") {
            barChartData.labels = (['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung']);
        }
        const sentimentBarChart = new Chart('sentimentBarChart', {
            type: 'horizontalBar',
            data: rvBarChartData.get(),
            options: {
                maintainAspectRatio: true,
                scales: {
                    xAxes: [{
                        display: false,
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                },
            },
        });
        drawnCharts.forEach(chart => chart.destroy());
        drawnCharts.push(sentimentBarChart);
    });
});

function generateDataSets() {
    let posts = Posts.find({user: Session.get("ID")});
    posts.forEach(post => {
        post.comments.forEach(comment => {
            getSentiment(comment.comment, function (sentiment) {
                if (sentiment < 0) {
                    if (String(Session.get("TP")) === "MANAGER") {
                        sentimentABSManager[post.category]["negative"] += 1;
                    } else {
                        sentimentABSCompany[post.category]["negative"] += 1;
                    }
                } else if (sentiment == 0) {
                    if (String(Session.get("TP")) === "MANAGER") {
                        sentimentABSManager[post.category]["neutral"] += 1;
                    } else {
                        sentimentABSCompany[post.category]["neutral"] += 1;
                    }
                } else if (sentiment > 0) {
                    if (String(Session.get("TP")) === "MANAGER") {
                        sentimentABSManager[post.category]["positive"] += 1;
                    } else {
                        sentimentABSCompany[post.category]["positive"] += 1;
                    }
                }
            });

        });
    });

    let index = 0;

    if (String(Session.get("TP")) === "MANAGER") {
        Object.keys(sentimentABSManager).forEach(function (key) {
            let d = sentimentABSManager[key];
            let sentimentSum = d["negative"] + d["neutral"] + d["positive"];
            let negativeFraction = d["negative"] / sentimentSum;
            let neutralFraction = d["neutral"] / sentimentSum;
            let positiveFraction = d["positive"] / sentimentSum;

            barChartData.datasets[0].data[index] = negativeFraction;
            barChartData.datasets[1].data[index] = neutralFraction;
            barChartData.datasets[2].data[index] = positiveFraction;
            index++;
        });
    } else {
        Object.keys(sentimentABSCompany).forEach(function (key) {
            let d = sentimentABSCompany[key];
            let sentimentSum = d["negative"] + d["neutral"] + d["positive"];
            let negativeFraction = d["negative"] / sentimentSum;
            let neutralFraction = d["neutral"] / sentimentSum;
            let positiveFraction = d["positive"] / sentimentSum;

            barChartData.datasets[0].data[index] = negativeFraction;
            barChartData.datasets[1].data[index] = neutralFraction;
            barChartData.datasets[2].data[index] = positiveFraction;
            index++;
        });
    }
}


function getSentiment(sentence, callback) {
    let postData = {
        data: {
            "sentence": sentence,
        }
    }

    HTTP.post("http://127.0.0.1:4000/sentiment", postData,
        function (error, response) {

            if (error) {
                console.log(error);
            } else {
                let sentiment = response["data"][0];
                if (sentiment == undefined) {
                    callback(0);
                } else {
                    callback(sentiment);
                }

            }
        }
    );
}