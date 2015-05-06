/*global Backbone */
'use strict';

// Создаем конструктор для нашего будущего приложения
var MyLibrarryApp = Marionette.Application.extend({
	initialize: function(){
		
	},
	// Следующий метод будет выполняться автоматически при старте приложения.
	onStart: function(){		
		this.setRootLayout();
		// стартуем бекбон хистори, для работы роутов
		Backbone.history.start({pushState: true});
	},
	setRootLayout: function(){		
		// это будет главная вьюха нашего приложения
		this.root = new this.staticViews.GeneralView();
	},
});

window.myLibrarryApp = new MyLibrarryApp();

(function(){
	// модель со значением фильтрации
	var filterState = new Backbone.Model({
	  	filter: 'all',
		generalInput: true
	});

	// обработчик запроса 
	myLibrarryApp.reqres.setHandler('filterState', function(){
	    return filterState;
	});
})();