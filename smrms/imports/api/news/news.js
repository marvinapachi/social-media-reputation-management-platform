import {Template} from "meteor/templating";
import {Mongo} from "meteor/mongo";
import {News, Profile} from "/client/main";
import {NewsConfig} from "/client/main";

import "/imports/ui/news/news.html";

let companyHashtags;
let companyMentions;
let competitorsHashtags;
let competitorsMentions;
let companyNewsAll;
let competitorsNewsAll;

Template.news.helpers({
    companyHashtags: function () {
        companyHashtags = NewsConfig.findOne({user: Session.get("ID")}).companyHashtags;
        return companyHashtags;
    },
    companyMentions: function () {
        companyMentions = NewsConfig.findOne({user: Session.get("ID")}).companyMentions;
        return companyMentions;
    },
    competitorsHashtags: function () {
        competitorsHashtags = NewsConfig.findOne({user: Session.get("ID")}).competitorsHashtags;
        return competitorsHashtags;
    },
    competitorsMentions: function () {
        competitorsMentions = NewsConfig.findOne({user: Session.get("ID")}).competitorsMentions;
        return competitorsMentions;
    },
    companyNews: function () {
        companyNewsAll = News.find();
        let companyNewsSelected = [];
        companyNewsAll.forEach(function cb(news) {
            if (news.hashtags.some(h => NewsConfig.findOne({user: Session.get("ID")}).companyHashtags.includes(h))) {
                companyNewsSelected.push(news);
                return;
            }
            if (news.mentions.some(m => NewsConfig.findOne({user: Session.get("ID")}).companyMentions.includes(m))) {
                companyNewsSelected.push(news);
            }
        });
        return companyNewsSelected;
    },
    competitorsNews: function () {
        competitorsNewsAll = News.find();
        let competitorsNewsSelected = [];
        competitorsNewsAll.forEach(function cb(news) {
            if (news.hashtags.some(h => NewsConfig.findOne({user: Session.get("ID")}).competitorsHashtags.includes(h))) {
                competitorsNewsSelected.push(news);
                return;
            }
            if (news.mentions.some(m => NewsConfig.findOne({user: Session.get("ID")}).competitorsMentions.includes(m))) {
                competitorsNewsSelected.push(news);
            }
        });
        return competitorsNewsSelected;
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

Template.news.events({
    'click .company-add': function (event, templateInstance) {
        event.preventDefault();
        let value = templateInstance.$('.company-input').val();
        let newsConfigID = NewsConfig.findOne({user: Session.get("ID")})._id;
        if (value.includes("#")) {
            NewsConfig.update({_id: newsConfigID}, {$addToSet: {"companyHashtags": value}});
        }
        if (value.includes("@")) {
            NewsConfig.update({_id: newsConfigID}, {$addToSet: {"companyMentions": value}});
        }

    },
    'click .competitors-add': function (event, templateInstance) {
        event.preventDefault();
        let value = templateInstance.$('.competitors-input').val();
        let newsConfigID = NewsConfig.findOne({user: Session.get("ID")})._id;
        if (value.includes("#")) {
            NewsConfig.update({_id: newsConfigID}, {$addToSet: {"competitorsHashtags": value}});
        }
        if (value.includes("@")) {
            NewsConfig.update({_id: newsConfigID}, {$addToSet: {"competitorsMentions": value}});
        }
    },
    'click .competitors-update': function (event, templateInstance) {
        event.preventDefault();
        let newsConfigID = NewsConfig.findOne({user: Session.get("ID")})._id;

        let removeCompetitorMentions = templateInstance.$('.remove-competitor-mention').map(function () {
            return this.childNodes[0].nodeValue;
        }).get();
        removeCompetitorMentions.forEach(mention => {
            NewsConfig.update({_id: newsConfigID}, {$pull: {"competitorsMentions": mention}});
        });

        let removeCompetitorHashtags = templateInstance.$('.remove-competitor-hashtag').map(function () {
            return this.childNodes[0].nodeValue;
        }).get();
        removeCompetitorHashtags.forEach(hashtag => {
            NewsConfig.update({_id: newsConfigID}, {$pull: {"competitorsHashtags": hashtag}});
        });
    },
    'click .company-update': function (event, templateInstance) {
        event.preventDefault();
        let newsConfigID = NewsConfig.findOne({user: Session.get("ID")})._id;

        let removeCompanyMentions = templateInstance.$('.remove-company-mention').map(function () {
            return this.childNodes[0].nodeValue;
        }).get();
        removeCompanyMentions.forEach(mention => {
            NewsConfig.update({_id: newsConfigID}, {$pull: {"companyMentions": mention}});
        });

        let removeCompanyHashtags = templateInstance.$('.remove-company-hashtag').map(function () {
            return this.childNodes[0].nodeValue;
        }).get();
        removeCompanyHashtags.forEach(hashtag => {
            NewsConfig.update({_id: newsConfigID}, {$pull: {"companyHashtags": hashtag}});
        });
    }
});