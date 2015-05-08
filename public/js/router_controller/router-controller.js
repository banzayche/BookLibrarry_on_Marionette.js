/*global Backbone */
'use strict';

var routerController = myLibrarryApp.module('routerController', function(routerController, MyLibrarryApp, Backbone){
	// Добавим роутер
	routerController.GeneralRouter = Backbone.Marionette.AppRouter.extend({

		// будем обрабатывать все роуты и лишь потом вычислять, какие действия предпринимать
		appRoutes: {			
			'book/:id/edit': 'control404_edit',
			'book/:id/detail': 'control404_detail',
			'book/create': 'control404_edit',
			'*route' : 'RouterProcessing',			
		},	
	});

	// Добавим контроллер
	routerController.GeneralController = Marionette.Controller.extend({
		// -------------------------Обработка роутов-------------------------
		control404_edit: function(id){this.control404_part2(id,'edit')},
		control404_detail: function(id){this.control404_part2(id,'detail')},
		
		control404_part2: function(id, direction){
			// создадим модель
			var activeModel = new MyLibrarryApp.modelCollection.Book({ id: id });
			// смотрим на ответ сервера
			// если положительный - рисуем как положено
			// если отрицательный - переадресация на 404 - page
			var there = this;
			activeModel.fetch({
				success: function(){
					if(direction === 'edit'){
						there.showEditBook(id, activeModel);
					} else {
						there.showDetailBook(id, activeModel);
					}
				},
				error: function(one, responseStatus, three){
					Backbone.history.navigate('page-404', {trigger:true, replace: true });
				},
			});
		},

		RouterProcessing: function(route){
			console.log('I have working with '+route+' route');
			switch (route) {
				case null:
				case "home":
					var there = this;
					there.showMain();
					there.showFooter_Header();
					break;
				default:
					Backbone.history.navigate('page-404', {trigger:false, replace: false });
					this.show404();
					this.showFooter_Header();
					break;
			};			
		},
		
		// -------------------------Функции прорисовки-------------------------
		showEditBook: function(id, activeModel){
			// Если модель новая id не будет - поля пустые
			// иначе в полях отобразятся значения модели			
			if( id == null){
				var book = new MyLibrarryApp.staticViews.EditBookView({	
					model: activeModel,
				});
				MyLibrarryApp.root.showChildView('main', book);
			} else{
				var activeView = new MyLibrarryApp.staticViews.EditBookView({
					model: activeModel
				});
				MyLibrarryApp.root.showChildView('main', activeView);
			}
			// в не зависимости от id, нужно всеравно рисовать header и footer
			this.showFooter_Header();										
		},

		showDetailBook: function(id, activeModel){
			// создаем новую вьюху
			var activeView = new MyLibrarryApp.staticViews.DetailBookView({
				model: activeModel
			});
			MyLibrarryApp.root.showChildView('main', activeView);
			this.showFooter_Header();			
		},		

		showFooter_Header: function(){
			var header = new MyLibrarryApp.staticViews.GeneralHeaderView({
				collection: MyLibrarryApp.GeneralCollection,
			});
			var footer = new MyLibrarryApp.staticViews.GeneralFooterView({
				collection: MyLibrarryApp.GeneralCollection,
			});

			MyLibrarryApp.root.showChildView('header', header);
			MyLibrarryApp.root.showChildView('footer', footer);
		},

		show404: function(){
			var page_404 = new MyLibrarryApp.staticViews.NotFoundView({
				collection: MyLibrarryApp.GeneralCollection,
			});

			MyLibrarryApp.root.showChildView('main', page_404);
		},

		showMain: function(){			
			var mainView = new MyLibrarryApp.listViews.mainLayoutView({
				collection: MyLibrarryApp.GeneralCollection,
			});

			MyLibrarryApp.root.showChildView('main', mainView);
		},
	});
	
	// инициализируем наш роут и контроллер, только когда все прогрузилось
	$( document ).ready(function() {
    	var generalController = new routerController.GeneralController()
		var generalRouter = new routerController.GeneralRouter({
			controller: generalController,
		});
	});
});