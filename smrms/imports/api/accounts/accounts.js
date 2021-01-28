import {Mongo} from "meteor/mongo";
import {Template} from "meteor/templating";
import {Profile} from "/client/main";

import "/imports/ui/accounts/accounts.html";

const PROFILE_TYPES = {
    "COMPANY": "Unternehmen",
    "MANAGER": "Manager"
}

Template.accounts.helpers({
    profilesList: function () {
        const profiles = Profile.find();
        let profilesList = []
        profiles.forEach(profile => {
            let use = "(Nicht in Benutzung)";
            if (String(Session.get("ID")) === String(profile._id)) {
                use = "(in Benutzung)";
            }
            profilesList.push({
                "name": profile.name,
                "type": PROFILE_TYPES[profile.type],
                "id": profile._id,
                "ig": profile.instagram_at,
                "use": use
            });
        });
        return profilesList;
    },
    inactive: function (IG) {
        return !(String(IG) == String(Session.get("IG")));
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
        return ""
    }
});

Template.accounts.events({
    'click .switch': function (event, templateInstance) {
        const clickedIG = $(event.currentTarget).attr("name");
        if (!(String(Session.get("IG")) === String(clickedIG))) {
            Session.set("ID", Profile.findOne({instagram_at: clickedIG})._id);
            Session.set("NM", Profile.findOne({instagram_at: clickedIG}).name);
            Session.set("IG", Profile.findOne({instagram_at: clickedIG}).instagram_at);
            Session.set("TP", Profile.findOne({instagram_at: clickedIG}).type);
        }
    }
});