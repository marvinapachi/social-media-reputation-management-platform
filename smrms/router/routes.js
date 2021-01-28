import {Router} from 'meteor/iron:router';

import '/imports/ui/targets/targets.html';
import '/imports/ui/statistics/statistics.html';
import '/imports/ui/news/news.html';
import '/imports/ui/dashboard/dashboard.html';
import '/imports/ui/crisis/crisis.html';
import '/imports/ui/crisis/managecrisis.html';
import '/imports/ui/accounts/accounts.html';
import '/client/main.html';

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function () {
    this.redirect('dashboard')
});

Router.route('/dashboard', {
    name: 'dashboard',
    template: 'dashboard'
});

Router.route('/targets', {
    name: 'targets',
    template: 'targets'
});

Router.route('/statistics', {
    name: 'statistics',
    template: 'statistics'
});

Router.route('/news', {
    name: 'news',
    template: 'news'
});

Router.route('/manage-crisis', {
    name: 'manageCrisis',
    template: 'manageCrisis'
});

Router.route('/crisis', {
    name: 'crisis',
    template: 'crisis'
});

Router.route('/accounts', {
    name: 'accounts',
    template: 'accounts'
});
