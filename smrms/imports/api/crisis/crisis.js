import {Template} from "meteor/templating";
import {ReactiveVar} from "meteor/reactive-var";
import {Crisis, Profile} from "/client/main";

import "/imports/ui/crisis/crisis.html";
import {Mongo} from "meteor/mongo";


let selected_crisis = new ReactiveVar();

Template.crisis.helpers({
    crisis_list: function () {
        return Crisis.find({user: Session.get("ID")});
    },
    selected_crisis: function () {
        return Crisis.findOne({_id: selected_crisis.get()});
    },
    crisisModel: function () {
        return Spacebars.SafeString(generateHTML(Crisis.findOne({_id: selected_crisis.get()}).decision));
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

function generateHTML(data) {
    return moveAndAppend(data, "decision");
}

function moveAndAppend(data, type) {
    if (type === "decision") {
        let result = "";
        result += "<b><u>" + data["name"] + "</u></b>" + "<br>";
        data = data["options"];
        result += moveAndAppend(data, "options");
        return result;
    } else if (type === "options") {
        let result = "";
        data.forEach(option => {
            result += "<b>" + option["option"] + "</b>" + "<br>";
            for (let key in option) {
                if (key === "decision") {
                    data = option["decision"];
                    result += moveAndAppend(data, "decision");
                } else if (key === "strategies") {
                    data = option["strategies"];
                    result += moveAndAppend(data, "strategies");
                }
            }
        });
        return result;
    } else if (type === "strategies") {
        let result = ""
        data.forEach(strategy => {
            result += "<i>" + strategy["strategy"] + ":</i> " + strategy["description"] + "<br>";
        });
        return result;
    }
}

Template.crisis.events({
    'change select': function (event, templateInstance) {
        event.preventDefault();
        const selectCrisis = templateInstance.$('.crisis-selection').children(":selected");
        selected_crisis.set(selectCrisis.attr("id"));
    }
});