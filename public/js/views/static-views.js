/*global Backbone */
'use strict';

var staticViews = myLibrarryApp.module('staticViews', function(staticViews, MyLibrarryApp, Backbone){
	// создаем конструктор для нашего главного представления рутового
	staticViews.GeneralView = Backbone.Marionette.LayoutView.extend({
		// указываем уже существующий в дом, элемент
		el: "#general-template",
		// Указываем регионы, для нашего приложения
		regions: {
			header: "#header",
			main: "#main",
			footer: "#footer"
		},
		initialize: function(){
			console.log('general view has been created');
		}
	})
});