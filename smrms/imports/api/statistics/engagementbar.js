import {Template} from "meteor/templating";
import {ReactiveVar} from "meteor/reactive-var";
import {Posts} from "/client/main";
import Chart from "chart.js";

let commentChartData = new ReactiveVar([]);
let likeChartData = new ReactiveVar([]);
let chartLabels = new ReactiveVar([]);
let postDateMap = {}

let charts = [];

Template.followerlinechart.onRendered(function () {
    generateChartData();

    this.autorun(() => {
        const engagementBarChart = new Chart('engagementBarChart', {
            type: 'bar',
            data: {
                labels: chartLabels.get(),
                datasets: [{
                    label: 'Likes',
                    yAxisID: 'Likes',
                    backgroundColor: "#3e95cd",
                    data: likeChartData.get()
                }, {
                    label: 'Kommentare',
                    yAxisID: 'Comments',
                    backgroundColor: "#8e5ea2",
                    data: commentChartData.get()
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        id: 'Likes',
                        type: 'linear',
                        position: 'left',
                        gridLines: {
                            display: false
                        }
                    }, {
                        id: 'Comments',
                        type: 'linear',
                        position: 'right',
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                },
                maintainAspectRatio: false
            }
        });
        charts.forEach(chart => chart.destroy());
        charts.push(engagementBarChart);
    });
});

function generateChartData() {
    likeChartData.set([]);
    commentChartData.set([]);
    chartLabels.set([]);
    const posts = Posts.find({user: Session.get("ID")}, {sort: {shared_at: 1}});
    posts.forEach(post => {
        const prettyDate = generatePrettyDate(post.shared_at)
        const likes = post.stats.likes;
        const comments = post.comments.length;
        if (chartLabels.get().includes(prettyDate)) {
            const likesIndex = postDateMap[prettyDate].likesIndex;
            const commentIndex = postDateMap[prettyDate].commentIndex;
            likeChartData.get()[likesIndex] += likes;
            commentChartData.get()[commentIndex] += comments;
        } else {
            const likesIndex = likeChartData.get().push(likes) - 1;
            const commentIndex = commentChartData.get().push(comments) - 1;
            chartLabels.get().push(prettyDate);
            postDateMap[prettyDate] = {
                "likesIndex": likesIndex,
                "commentIndex": commentIndex
            }
        }
    });
}

function generatePrettyDate(ISODate) {
    const day = ISODate.getDate();
    const month = ISODate.getMonth() + 1;
    const year = ISODate.getFullYear();
    const prettyDate = day + "." + month + "." + year;
    return prettyDate
}