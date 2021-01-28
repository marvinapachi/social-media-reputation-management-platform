import {Template} from "meteor/templating";
import {Posts} from "/client/main";
import Chart from "chart.js";
import {ReactiveVar} from "meteor/reactive-var";

let drawnCharts = [];

const RADAR_METRICS = {
    "LIKES": "likes",
    "COMMENTS": "comments",
    "POSTS": "posts",
    "ENGAGEMENT": "engagement",
    "REACH": "reach"
};

const ACTIVE_CLASSES = {
    "likes": "likes-active",
    "comments": "comments-active",
    "posts": "posts-active",
    "engagement": "engagement-active",
    "reach": "reach-active"
}

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

let activeRadarMetrics = {
    first: {
        metric: RADAR_METRICS["POSTS"]
    },
    second: {
        metric: RADAR_METRICS["LIKES"]
    }
};

let radarData = {
    "likes": {
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "rgba(255, 74, 222)",
        backgroundColor: "rgba(255, 74, 222, 0.1)",
        borderWidth: 1,
    },
    "posts": {
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "rgba(88, 237, 69)",
        backgroundColor: "rgba(88, 237, 69, 0.1)",
        borderWidth: 1
    },
    "comments": {
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "rgba(92, 255, 239)",
        backgroundColor: "rgba(92, 255, 239, 0.1)",
        borderWidth: 1
    },
    "engagement": {
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "rgba(3, 3, 3)",
        backgroundColor: "rgba(3, 3, 3, 0.1)",
        borderWidth: 1
    },
    "reach": {
        data: [0, 0, 0, 0, 0, 0],
        borderColor: "rgba(255, 103, 92)",
        backgroundColor: "rgba(255, 103, 92, 0.1)",
        borderWidth: 1
    }
}

let firstRadarDataSet = radarData[activeRadarMetrics["first"]["metric"]];
let secondRadarDataSet = radarData[activeRadarMetrics["second"]["metric"]];
let radarChartData;

Template.rqradar.onRendered(function () {
    if (String(Session.get("TP")) === "COMPANY") {
        radarChartData = new ReactiveVar({
            labels: ['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung'],
            datasets: [firstRadarDataSet, secondRadarDataSet]
        });
    }

    if (String(Session.get("TP")) === "MANAGER") {
        radarChartData = new ReactiveVar({
            labels: ['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung', 'Logging', 'Interesse'],
            datasets: [firstRadarDataSet, secondRadarDataSet]
        });
    }

    generateDataSets();

    this.autorun(() => {
        const rqRadarChart = new Chart('rqRadarChart', {
            type: "radar",
            data: radarChartData.get(),
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: true
            }
        });
        drawnCharts.forEach(chart => chart.destroy());
        drawnCharts.push(rqRadarChart);
    });
});

Template.rqradar.events({
    'click .posts': function (event, templateInstance) {
        event.preventDefault();
        let metric = RADAR_METRICS["POSTS"];
        if (!isInActiveRadarMetrics(metric)) {
            update(metric);
        }
    },
    'click .comments': function (event, templateInstance) {
        event.preventDefault();
        let metric = RADAR_METRICS["COMMENTS"];
        if (!isInActiveRadarMetrics(metric)) {
            update(metric);
        }
    },
    'click .likes': function (event, templateInstance) {
        event.preventDefault();
        let metric = RADAR_METRICS["LIKES"];
        if (!isInActiveRadarMetrics(metric)) {
            update(metric);
        }
    },
    'click .reach': function (event, templateInstance) {
        event.preventDefault();
        let metric = RADAR_METRICS["REACH"];
        if (!isInActiveRadarMetrics(metric)) {
            update(metric);
        }
    },
    'click .engagement': function (event, templateInstance) {
        event.preventDefault();
        let metric = RADAR_METRICS["ENGAGEMENT"];
        if (!isInActiveRadarMetrics(metric)) {
            update(metric);
        }
    }
});

function generateDataSets() {
    const posts = Posts.find({"user": Session.get("ID")});

    resetData();

    posts.forEach(post => {
        let postStats = post.stats;
        let likes = postStats["likes"];
        let shares = postStats["shares"];
        let reach = postStats["reach"];
        let impressions = postStats["impressions"];
        let commentCount = post.comments.length;
        let engagement = generateEngagement(likes, commentCount, shares);

        radarData["likes"].data[CATEGORY_INDEX[post.category]] += likes;
        radarData["posts"].data[CATEGORY_INDEX[post.category]] += 1;
        radarData["comments"].data[CATEGORY_INDEX[post.category]] += commentCount;
        radarData["engagement"].data[CATEGORY_INDEX[post.category]] += engagement;
        radarData["reach"].data[CATEGORY_INDEX[post.category]] += reach;
    });
}

Template.rqradar.helpers({
    isManager: function () {
        return String(Session.get("TP") === "MANAGER");
    }
});

function update(metric) {
    replaceMetric(metric);
    updateMetrics();
    updateClasses();
}

function isInActiveRadarMetrics(metric) {
    const isInFirst = metric === activeRadarMetrics["first"]["metric"];
    const isInSecond = metric === activeRadarMetrics["second"]["metric"];
    return isInFirst || isInSecond;
}

function replaceMetric(metric) {
    activeRadarMetrics["first"]["metric"] = activeRadarMetrics["second"]["metric"]
    activeRadarMetrics["second"]["metric"] = metric;

}

function updateMetrics() {
    firstRadarDataSet = radarData[activeRadarMetrics["first"]["metric"]];
    secondRadarDataSet = radarData[activeRadarMetrics["second"]["metric"]];

    if (String(Session.get("TP")) === "COMPANY") {
        radarChartData.set({
            labels: ['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung'],
            datasets: [firstRadarDataSet, secondRadarDataSet]
        });
    }

    if (String(Session.get("TP")) === "MANAGER") {
        radarChartData.set({
            labels: ['Emotionaler Anklang', 'Produkte und Dienste', 'Arbeitsplatzumgebung', 'Finanzleistung', 'Vision und Führung', 'Soziale Leistung', 'Logging', 'Interesse'],
            datasets: [firstRadarDataSet, secondRadarDataSet]
        });
    }
}

function updateClasses() {
    const metricList = [
        RADAR_METRICS["LIKES"],
        RADAR_METRICS["COMMENTS"],
        RADAR_METRICS["POSTS"],
        RADAR_METRICS["REACH"],
        RADAR_METRICS["ENGAGEMENT"]
    ];
    let activeMetrics = [activeRadarMetrics["first"]["metric"], activeRadarMetrics["second"]["metric"]];

    metricList.forEach(m => {
        if (activeMetrics.includes(m)) {
            addActiveClass(m);
        } else {
            removeActiveClass(m);
        }
    });
}

function addActiveClass(metric) {
    let className = "." + metric;
    $(className).addClass(ACTIVE_CLASSES[metric]);
}

function removeActiveClass(metric) {
    let className = "." + metric;
    $(className).removeClass(ACTIVE_CLASSES[metric]);
}

function generateEngagement(likes, comments, shares) {
    return likes + comments + shares;
}

function resetData() {
    if (String(Session.get("TP")) === "COMPANY") {
        radarData["likes"].data = [0, 0, 0, 0, 0, 0];
        radarData["posts"].data = [0, 0, 0, 0, 0, 0];
        radarData["comments"].data = [0, 0, 0, 0, 0, 0];
        radarData["engagement"].data = [0, 0, 0, 0, 0, 0];
        radarData["reach"].data = [0, 0, 0, 0, 0, 0];
    }
    if (String(Session.get("TP")) === "MANAGER") {
        radarData["likes"].data = [0, 0, 0, 0, 0, 0, 0, 0];
        radarData["posts"].data = [0, 0, 0, 0, 0, 0, 0, 0];
        radarData["comments"].data = [0, 0, 0, 0, 0, 0, 0, 0];
        radarData["engagement"].data = [0, 0, 0, 0, 0, 0, 0, 0];
        radarData["reach"].data = [0, 0, 0, 0, 0, 0, 0, 0];
    }
}