/*global Backbone */
'use strict';

// Создаем конструктор для нашего будущего приложения
var MyLibrarryApp = Marionette.Application.extend({
	// Следующий метод будет выполняться автоматически при старте приложения.
	onStart: function(){
		console.log('book-application has been started');
		this.setRootLayout();
		// стартуем бекбон хистори, для работы роутов
		Backbone.history.start({ pushstate : true });
	},
	setRootLayout: function(){
		console.log('general view has been created');
		// app.rootView = new RootView(); это будет главная вьюха нашего приложения
	},
});

window.myLibrarryApp = new MyLibrarryApp();