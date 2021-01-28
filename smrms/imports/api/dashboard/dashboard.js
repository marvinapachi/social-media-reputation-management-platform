import {Template} from "meteor/templating";
import {Profile} from "/client/main";
import {Mongo} from "meteor/mongo";
import {Posts} from "/client/main";
import {Followers} from "/client/main";

import "/imports/ui/dashboard/dashboard.html";
import "/imports/ui/statistics/rqradar.html";
import "/imports/api/statistics/rqradar";

let random = require('lodash.random');

const dummyComments = [
    "Das sieht aber lecker aus!",
    "Das Essen war super, Wiederholbedarf! #Steakhousehamburg",
    "Steakhousehamburg finde ich hervorragend!",
    "Ich fand das essen okay aber die Bedienung unter aller Sau!",
    "Mein Lieblings-Steakhaus in Hamburg. Einfach nur klasse!",
    "Das Essen war schlecht und ich musste danach kotzen!",
    "Grausig ist das Essen. Schlimm die Bedienung. Und hässlich das Ambiente!",
    "Schlechtestes Steak was ich je hatte! Scheußliche Bude!"
]

const dummyAuthors = [
    "Max Falke",
    "Annika Smidt",
    "Pablo Martinez",
    "Mohammed Hosseini",
    "Klaus Günther"
]

const CATEGORY_MAPPINGS = {
    "Emotionaler Anklang": "emotion",
    "Produkte & Dienste": "products",
    "Arbeitsplatzumgebung": "work",
    "Finanzleistung": "finance",
    "Vision und Führung": "vision",
    "Soziale Verantwortung": "social",
    "Logging": "logging",
    "Interesse": "interest"
}

Template.dashboard.events({
    'click .post-button': function (event, templateInstance) {
        event.preventDefault();
        const user = Session.get("ID");
        const instagram_at = String(Session.get("IG"));
        const caption = templateInstance.$('.post-description').val();
        const category = templateInstance.$('.post-category').children(":selected").text();
        const stats = generateStats();
        const comments = generateComments();

        Posts.insert({
            "user": user,
            "instagram_at": instagram_at,
            "caption": caption,
            "category": CATEGORY_MAPPINGS[category],
            "shared_at": new Date(),
            "stats": stats,
            "comments": comments
        });
        templateInstance.$('.post-description').val("");
    }
});

function generateStats() {
    return {
        likes: _.random(25, 125),
        shares: _.random(5, 25),
        reach: _.random(500, 2000),
        impressions: _.random(500, 2500)
    };
}

function generateComments() {
    let comments = [];
    const commentCount = _.random(1, 5);
    for (let i = 0; i < commentCount; i++) {
        comments.push({
            "comment": dummyComments[_.random(0, 7)],
            "author": dummyAuthors[_.random(0, 7)]
        });
    }
    return comments;
}

Template.dashboard.helpers({
    isManager: function () {
        return String(Session.get("TP")) === "MANAGER";
    },
    engagementScores: function () {
        const posts = Posts.find({"user": Session.get("ID")});
        const followerCount = Followers.findOne({"instagram_at": String(Session.get("IG"))}, {
            sort: {
                "captured_at": -1,
                limit: 1
            }
        }).follower;
        let impressionsSUM = 0;
        let likesSUM = 0;
        let commentsSUM = 0;
        posts.forEach(post => {
            likesSUM += post["stats"]["likes"];
            impressionsSUM += post["stats"]["impressions"];
            commentsSUM += post["comments"].length;
        });

        const engagement = likesSUM + commentsSUM;
        const engagementAVG = engagement / posts.count();

        let followerEngagement = Math.round(engagementAVG / followerCount * 100);
        let reachEngagement = Math.round(engagementAVG / impressionsSUM * 100);
        return {
            "followerEngagement": followerEngagement,
            "reachEngagement": reachEngagement
        };
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
})