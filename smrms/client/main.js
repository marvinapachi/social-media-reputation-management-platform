import {Mongo} from "meteor/mongo";

import '../imports/api/targets/targets.js';
import '../imports/api/news/news.js';
import '../imports/api/statistics/statistics.js';
import '../imports/api/statistics/rqradar.js';
import '../imports/api/statistics/sentimentbar.js';
import '../imports/api/statistics/followerlinechart.js';
import '../imports/api/dashboard/dashboard.js';
import '../imports/api/crisis/crisis.js';
import '../imports/api/crisis/managecrisis.js'
import '../imports/api/accounts/accounts.js';
import '../router/routes.js';

export const Followers = new Mongo.Collection("followers");
export const Posts = new Mongo.Collection("posts");
export const Targets = new Mongo.Collection("targets");
export const Crisis = new Mongo.Collection("crisis");
export const News = new Mongo.Collection("news");
export const NewsConfig = new Mongo.Collection("newsConfig");
export const Profile = new Mongo.Collection("profile");