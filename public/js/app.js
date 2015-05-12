/*global Backbone */
'use strict';

// Создаем конструктор для нашего будущего приложения
var MyLibrarryApp = Marionette.Application.extend({
	// Следующий метод будет выполняться автоматически при старте приложения.
	onStart: function(){		
		this.setRootLayout();
		
		this.GeneralCollection = new this.modelCollection.CollectionBook();
		this.GeneralCollection
			.fetch()
			.done(function(){
				// стартуем бекбон хистори, для работы роутов
				Backbone.history.start({pushState: true});
			});
	},
	// Этот метод создан нами
	setRootLayout: function(){		
		// это будет главная вьюха нашего приложения
		this.root = new this.staticViews.GeneralView();
	},
});

window.myLibrarryApp = new MyLibrarryApp();

// В этой функции содержится вспомогательная модель и запрос-ответ, который эту модель и возвращает  
// это тоже своеобразный модуль нашего приложения
(function(){
	// модель со значением фильтрации и значением представления списка книг(таблица или плитка)
	var filterState = new Backbone.Model({
	  	filter: 'all',
		list_type:  'tile'
	});

	// обработчик запроса 
	myLibrarryApp.reqres.setHandler('filterState', function(){
	    return filterState;
	});	
})();