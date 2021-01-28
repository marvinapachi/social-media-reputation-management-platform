import {Template} from "meteor/templating";
import {Mongo} from "meteor/mongo";
import {Profile, Targets} from "/client/main";

import "/imports/ui/targets/targets.html";


const RANGES_DICTIONARY = {
    "daily": "Täglich",
    "weekly": "Wöchentlich",
    "monthly": "Monatlich",
    "yearly": "Jährlich"
}

Template.targets.helpers({
    productRange: function () {
        return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.products?.time_range];
    },
    productTarget: function () {
        return Targets.findOne({user: Session.get("ID")})?.targets?.products?.target;
    },
    workRange: function () {
        return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.work?.time_range];
    },
    workTarget: function () {
        return Targets.findOne({user: Session.get("ID")})?.targets?.work?.target;
    },
    financeRange: function () {
        return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.finance?.time_range];
    },
    financeTarget: function () {
        return Targets.findOne({user: Session.get("ID")})?.targets?.finance?.target;
    },
    socialRange: function () {
        return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.social?.time_range];
    },
    socialTarget: function () {
        return Targets.findOne({user: Session.get("ID")})?.targets?.social?.target;
    },
    emotionRange: function () {
        return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.emotion?.time_range];
    },
    emotionTarget: function () {
        return Targets.findOne({user: Session.get("ID")})?.targets?.emotion?.target;
    },
    visionRange: function () {
        return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.vision?.time_range];
    },
    visionTarget: function () {
        return Targets.findOne({user: Session.get("ID")})?.targets?.vision?.target;
    },
    loggingTarget: function () {
        if (String(Session.get("TP") === "MANAGER")) {
            return Targets.findOne({user: Session.get("ID")})?.targets?.logging?.target;
        }
        return "";
    },
    loggingRange: function () {
        if (String(Session.get("TP") === "MANAGER")) {
            return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.logging?.time_range];
        }
        return "";
    },
    interestTarget: function () {
        if (String(Session.get("TP") === "MANAGER")) {
            return Targets.findOne({user: Session.get("ID")})?.targets?.interest?.target;
        }
        return "";
    },
    interestRange: function () {
        if (String(Session.get("TP") === "MANAGER")) {
            return RANGES_DICTIONARY[Targets.findOne({user: Session.get("ID")})?.targets?.interest?.time_range];
        }
        return "";
    },
    isManager: function () {
        return String(Session.get("TP")) === "MANAGER";
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

Template.targets.events({
    'submit form': function (event) {
        event.preventDefault();
        let newProductRange = event.target.productRange.value;
        let newProductTarget = event.target.productTarget.value;
        let newWorkRange = event.target.workRange.value;
        let newWorkTarget = event.target.workTarget.value;
        let newFinanceRange = event.target.financeRange.value;
        let newFinanceTarget = event.target.financeTarget.value;
        let newSocialRange = event.target.socialRange.value;
        let newSocialTarget = event.target.socialTarget.value;
        let newEmotionRange = event.target.emotionRange.value;
        let newEmotionTarget = event.target.emotionTarget.value;
        let newVisionRange = event.target.visionRange.value;
        let newVisionTarget = event.target.visionTarget.value;
        let targetsCollectionID = Targets.findOne({user: Session.get("ID")})._id;
        if (String(Session.get("TP")) === "MANAGER") {
            let newLoggingRange = event.target.loggingRange.value;
            let newLoggingTarget = event.target.loggingTarget.value;
            let newInterestRange = event.target.interestRange.value;
            let newInterestTarget = event.target.interestTarget.value;
            Targets.update({_id: targetsCollectionID}, {$set: {"targets.logging.target": newLoggingTarget}});
            Targets.update({_id: targetsCollectionID}, {$set: {"targets.logging.time_range": newLoggingRange}});
            Targets.update({_id: targetsCollectionID}, {$set: {"targets.interest.target": newInterestTarget}});
            Targets.update({_id: targetsCollectionID}, {$set: {"targets.interest.time_range": newInterestRange}});
        }
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.products.target": newProductTarget}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.products.time_range": newProductRange}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.work.target": newWorkTarget}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.work.time_range": newWorkRange}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.products.target": newProductTarget}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.finance.time_range": newFinanceRange}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.finance.target": newFinanceTarget}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.social.time_range": newSocialRange}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.social.target": newSocialTarget}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.emotion.time_range": newEmotionRange}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.emotion.target": newEmotionTarget}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.vision.time_range": newVisionRange}});
        Targets.update({_id: targetsCollectionID}, {$set: {"targets.vision.target": newVisionTarget}});
    }
});
