/*
 * The build task compiles *.tpl.html files into a single cache module that
 * injects all the templates into Angular's $httpCache. This module is just a
 * placeholder for when the app is served uncomiled, as if the 'my.templates'
 * module is missing, angular will throw an error.
 *  TODO: there's got to be a more elegant way of doing this
 */

'use strict';
goog.provide('my.templates');
my.templates = angular.module("templates", []);

