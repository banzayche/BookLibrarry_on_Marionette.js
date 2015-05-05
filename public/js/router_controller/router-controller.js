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
		initialize: function(){
			MyLibrarryApp.GeneralCollection = new MyLibrarryApp.modelCollection.CollectionBook();
			this.collection = MyLibrarryApp.GeneralCollection;
		},
		RouterProcessing: function(route){
			console.log('I have working with '+route+' route');
			this.showMain();
		},

		showMain: function(){
			var mainView = new MyLibrarryApp.listViews.BookListView({
				collection: this.collection,
			});
			console.log(this.collection);
			MyLibrarryApp.root.showChildView('main', mainView);

		},

	});
	
	$( document ).ready(function() {
    	var generalController = new routerController.GeneralController()
		var generalRouter = new routerController.GeneralRouter({
			controller: generalController,
		});
	});

	MyLibrarryApp.on('start', function(){
		console.log('book-application has been started');		
		MyLibrarryApp.GeneralCollection.fetch();
		// console.log(MyLibrarryApp.GeneralCollection);
	});
});