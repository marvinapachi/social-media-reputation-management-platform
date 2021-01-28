import {Template} from "meteor/templating";
import {Followers} from "/client/main";
import Chart from "chart.js";

let lineChartData = new ReactiveVar([]);
let firstSnapshotDate = new ReactiveVar("2021-01-01T00:00:00Z");
let lastSnapshotDate = new ReactiveVar("2021-12-31T00:00:00Z");

let charts = [];

Template.followerlinechart.onRendered(function () {
    generateChartData();

    this.autorun(() => {
        const followerLineChart = new Chart('followerLineChart', {
            type: 'line',
            data: {
                labels: [firstSnapshotDate.get(), lastSnapshotDate.get()],
                datasets: [
                    {
                        data: lineChartData.get(),
                        backgroundColor: 'rgba(255, 255, 255, 0.0)',
                        borderColor: [
                            'rgba(78, 115, 223, 1)'
                        ]
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        distribution: 'linear',
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        }
                    }]
                },
                maintainAspectRatio: false
            }
        });
        charts.forEach(chart => chart.destroy());
        charts.push(followerLineChart);
    });
});

function generateChartData() {
    const followers = Followers.find({instagram_at: String(Session.get("IG"))}, {sort: {captured_at: -1}});
    lineChartData.set([]);
    let tmpFirstSnapshotDate;
    let tmpLastSnapshotDate;
    let firstIteration = true;
    followers.forEach(followerSnapshot => {
        let data = lineChartData.get();
        let snapshotDate = followerSnapshot.captured_at;
        if (firstIteration) {
            tmpFirstSnapshotDate = snapshotDate;
            tmpLastSnapshotDate = snapshotDate;
            firstIteration = false;
        } else {
            if (tmpLastSnapshotDate < snapshotDate) {
                tmpLastSnapshotDate = snapshotDate;
            }
            if (tmpFirstSnapshotDate > snapshotDate) {
                tmpFirstSnapshotDate = snapshotDate;
            }
        }
        data.push({
            t: snapshotDate,
            y: followerSnapshot.follower
        });
    });
    firstSnapshotDate.set(tmpFirstSnapshotDate);
    lastSnapshotDate.set(tmpLastSnapshotDate);
}