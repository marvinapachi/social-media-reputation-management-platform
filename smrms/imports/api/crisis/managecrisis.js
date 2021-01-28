import {Mongo} from "meteor/mongo";
import {Template} from "meteor/templating";

import {Crisis, Profile} from "/client/main";

import "/imports/ui/crisis/managecrisis.html";


Template.manageCrisis.helpers({
    crisis_list: function () {
        return Crisis.find({user: Session.get("ID")});
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

Template.manageCrisis.events({
    'click .add-decision': function (event, templateInstance) {

    },
    'click .fa-remove': function (event, templateInstance) {
        const crisisID = $(event.currentTarget).attr("id");
        Crisis.remove({_id: crisisID});
    }
});

/*
<div class="row">
    <div class="col"><label class="text-dark my-1">Entscheidungsbeschreibung:</label>
        <input type="text" class="form-control my-1 decision" required=""></div>
</div>
<div class="row">
    <div class="col"><label class="col-form-label text-dark my-1">Entscheidungen:</label></div>
</div>
<div class="row">
    <div class="col">
        <div class="row">
            <div class="col"><input type="text" class="form-control my-1 option" required=""></div>
        </div>
        <div class="row">
            <div class="col"><button class="btn btn-secondary add-decision" type="button">Entscheidung anknüpfen</button>
                <button class="btn btn-secondary mx-1 add-strategy" type="button">Krisen-Strategie hinzufügen</button></div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="row">
            <div class="col"><input type="text" class="form-control my-1 option" required=""></div>
        </div>
        <div class="row">
            <div class="col"><button class="btn btn-secondary add-option" type="button">Entscheidung anknüpfen</button>
                <button class="btn btn-secondary mx-1 add-strategy" type="button">Krisen-Strategie hinzufügen</button></div>
        </div>
    </div>
</div>
 */