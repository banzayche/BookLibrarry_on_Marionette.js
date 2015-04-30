/*global Backbone */
'use strict';

var routerController = myLibrarryApp.module('routerController', function(routerController, MyLibrarryApp, Backbone){
	// Добавим роутер
	routerController.GeneralRouter = Backbone.Marionette.AppRouter.extend({
		// будем обрабатывать все роуты и лишь потом вычислять, какие действия предпринимать
		appRoutes: {
			'*route' : 'RouterProcessing'
		}
	});

	// Добавим контроллер
	routerController.GeneralController = Marionette.Controller.extend({
		RouterProcessing: function(route){
			console.log('I have working with '+route+' route');
		}
	});
	
	$( document ).ready(function() {
    	var generalController = new routerController.GeneralController()
		var generalRouter = new routerController.GeneralRouter({
			controller: generalController,
		});
	});

	MyLibrarryApp.on('start', function(){
		console.log('book-application has been started');
		MyLibrarryApp.GeneralCollection = new MyLibrarryApp.modelCollection.CollectionBook();
		MyLibrarryApp.GeneralCollection.fetch();
		console.log(MyLibrarryApp.GeneralCollection);
	});
});