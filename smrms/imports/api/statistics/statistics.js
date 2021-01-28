import {Template} from "meteor/templating";
import {Mongo} from "meteor/mongo";
import {HTTP} from "meteor/http";

import "/imports/ui/statistics/statistics.html";
import "/imports/ui/statistics/rqradar.html";
import "/imports/api/statistics/rqradar";
import "/imports/ui/statistics/sentimentbar.html";
import "/imports/api/statistics/sentimentbar";
import "/imports/ui/statistics/followerlinechart.html";
import "/imports/api/statistics/followerlinechart";
import "/imports/ui/statistics/engagementbar.html";
import "/imports/api/statistics/engagementbar";

import {Posts} from "/client/main";
import {Targets} from "/client/main";
import {Profile} from "/client/main";
import {Followers} from "/client/main";

Template.statistics.helpers({
    postCount: function () {
        return Posts.find({"user": Session.get("ID")}).count();
    },
    followerStats: function () {
        const followerCount = Followers.findOne({"instagram_at": String(Session.get("IG"))}, {
            sort: {
                "captured_at": -1,
                limit: 1
            }
        }).follower;
        const firstDay = getWeekRange().firstDay;
        let followerCountBOTK = 0;
        const followerBOTK = Followers.find(
            {
                instagram_at: String(Session.get("IG"))
            },
            {
                sort:
                    {shared_at: 1}
            });
        let selected = false;
        followerBOTK.forEach(botk => {
            if ((botk.captured_at <= firstDay) && !selected) {
                followerCountBOTK = botk.follower;
                selected = true;
            }
        });
        const followerDiff = followerCount - followerCountBOTK;
        return {
            "followerCount": followerCount,
            "followerDiff": followerDiff
        }
    },
    engagementStats: function () {

    },
    weeklyGoal: function () {
        let weeklyTarget = 0;
        const firstDay = getWeekRange().firstDay
        const lastDay = getWeekRange().lastDay
        let postCount = Posts.find({"user": Session.get("ID")}, {
            shared_at: {
                $gte: firstDay,
                $lt: lastDay
            }
        }).count();
        const productWeeklyTarget = generateWeeklyTarget(
            Targets.findOne({user: Session.get("ID")})?.targets?.products?.target,
            Targets.findOne({user: Session.get("ID")})?.targets?.products?.time_range
        );
        const workWeeklyTarget = generateWeeklyTarget(
            Targets.findOne({user: Session.get("ID")})?.targets?.work?.target,
            Targets.findOne({user: Session.get("ID")})?.targets?.work?.time_range
        );
        const financeTarget = generateWeeklyTarget(
            Targets.findOne({user: Session.get("ID")})?.targets?.finance?.target,
            Targets.findOne({user: Session.get("ID")})?.targets?.finance?.time_range
        );
        const socialTarget = generateWeeklyTarget(
            Targets.findOne({user: Session.get("ID")})?.targets?.social?.target,
            Targets.findOne({user: Session.get("ID")})?.targets?.social?.time_range
        );
        const emotionTarget = generateWeeklyTarget(
            Targets.findOne({user: Session.get("ID")})?.targets?.emotion?.target,
            Targets.findOne({user: Session.get("ID")})?.targets?.emotion?.time_range
        );
        const visionTarget = generateWeeklyTarget(
            Targets.findOne({user: Session.get("ID")})?.targets?.vision?.target,
            Targets.findOne({user: Session.get("ID")})?.targets?.vision?.time_range
        );

        weeklyTarget = productWeeklyTarget + workWeeklyTarget + financeTarget + socialTarget + emotionTarget + visionTarget;
        let percentage = 0;

        if (weeklyTarget > 0) {
            percentage = postCount / weeklyTarget;
        }
        if (percentage > 1) {
            percentage = 1;
        }
        percentage *= 100;
        const goalDict = {
            "weeklyTarget": weeklyTarget,
            "percentage": percentage
        }
        return goalDict;
    },
    reachMetrics: function () {
        const firstDay = getWeekRange().firstDay
        const lastDay = getWeekRange().lastDay
        let posts = Posts.find({"user": Session.get("ID")}, {
            shared_at: {
                $gte: firstDay,
                $lt: lastDay
            }
        });
        const postAmount = posts.count();
        let impressions = 0;
        let reach = 0;
        let shares = 0;
        posts.forEach(post => {
            const stats = post.stats;
            impressions += stats["impressions"];
            reach += stats["reach"];
            shares += stats["shares"];
        });
        const reachMetrics = {
            "impressions": Math.round(impressions / postAmount),
            "reach": Math.round(reach / postAmount),
            "shares": Math.round(shares / postAmount)
        };
        return reachMetrics;
    },
    initSession: function () {
        if (Session.get("ID") == undefined) {
            Session.set("ID", Profile.findOne({_id: new Mongo.ObjectID("600c59dfd2e015ae2c96f869")})._id);
        }
        if (Session.get("NM") == undefined) {
            Session.set("NM", Profile.findOne({_id: new Mongo.ObjectID("600c59dfd2e015ae2c96f869")}).name);
        }
        if (Session.get("IG") == undefined) {
            Session.set("IG", Profile.findOne({_id: new Mongo.ObjectID("600c59dfd2e015ae2c96f869")}).instagram_at);
        }
        if (Session.get("TP") == undefined) {
            Session.set("TP", Profile.findOne({_id: new Mongo.ObjectID("600c59dfd2e015ae2c96f869")}).type);
        }
        return "";
    }
});

function generateWeeklyTarget(target, range) {
    switch (range) {
        case "daily":
            return Math.round(target * 7);
        case "weekly":
            return Math.round(target);
        case "monthly":
            return Math.round(target / 4);
        case "yearly":
            return Math.round(target / 52);
    }
}

// source: https://stackoverflow.com/a/5210450/2968265
function getWeekRange() {
    const curr = new Date; // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(last));
    return {
        "firstDay": firstDay,
        "lastDay": lastDay
    }
}