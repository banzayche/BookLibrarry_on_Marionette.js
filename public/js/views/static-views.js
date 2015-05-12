/*global Backbone */
'use strict';

var staticViews = myLibrarryApp.module('staticViews', function(staticViews, MyLibrarryApp, Backbone){
	// создаем конструктор для нашего главного представления (рутового)
	staticViews.GeneralView = Backbone.Marionette.LayoutView.extend({
		// указываем уже существующий в дом, элемент
		el: "#general-template",
		// Указываем регионы, для нашего приложения
		regions: {
			header: "#header",
			main: "#main",
			footer: "#footer"
		},

		// console.log, просто, чтобы увидеть, что приложение запустилось
		initialize: function(){
			console.log('general view has been created');
		}
	});

	
	// Для header
	staticViews.GeneralHeaderView = Backbone.Marionette.ItemView.extend({
		className: 'container header-book',
		// указываем уже существующий в дом, элемент
		template: '#header-template',
	});

	

	// Для подробного описания книги
	staticViews.DetailBookView = Backbone.Marionette.ItemView.extend({
		className: 'detail-book',
		// указываем уже существующий в дом, элемент
		template: '#book-detail-template',
		// это представление конкретной модели и мы указываем что за конструктор модели использовать
		model: MyLibrarryApp.modelCollection.Book,
		// здесь указываем присущие этому представлению UI элементы
		ui: {
			cancel : '#cancel',
		},
		events: {
			'click @ui.cancel' : "goCancel",
		},

		// функция закрытия - просто переход на начальную страницу
		goCancel: function(){
			Backbone.history.navigate('home', {trigger:true, replace: true });
		}
	});

	

	// представление, для редактирования модели
	staticViews.EditBookView = Backbone.Marionette.ItemView.extend({
		// указываем уже существующий в дом, элемент
		template: '#edit-book-template',
		model: MyLibrarryApp.modelCollection.Book,
		ui: {
			save : '#save',
			cancel : '#cancel',
			title : '#title', 
			author : '#author', 
			genre : '#genre', 
			year : '#year', 
			description : '#description',
			error : '.error' 
		},
		events: {
			'click @ui.save' : "goSave",
			'click @ui.cancel' : "goCancel",
		},

		// для сохранения функции
		goSave: function(){
			// так, как UI элементы уже указаны то мы можем ссылаться на них this.ui. ...
			var title = this.ui.title.val().trim();
			var author = this.ui.author.val().trim();
			var year = this.ui.year.val().trim();
			var genre = this.ui.genre.val().trim();
			var description = this.ui.description.val().trim();
			
			// если указанные поля не пусты то создаем модель в коллекции и переходим на главную
			if(title && author && year && genre){
				// если модель новая - мы должны создать ее в коллекции
				if(this.model.isNew()){
					// create потому, что это даст событие изменение колекции и обновит представление без дополнительного обращения к серверу.
					MyLibrarryApp.GeneralCollection.create({
						title: title,
						author: author,
						year: year,
						genre: genre,
						description: description,
					});
					Backbone.history.navigate('home', {trigger:true, replace: true });
				} else{					
					// иначе - просто сохранить
					// savе - потому, что модель уже существует в колекции и ее изменение вызовет событие изменения коллекции.
					this.model.save({
						title: title,
						author: author,
						year: year,
						genre: genre,
						description: description,
					}).done(function(){
						Backbone.history.navigate('home', {trigger:true, replace: true });
					});
				}				
			} else{
				// иначе - показываем сообщение об ощибке
				this.ui.error.show();
			}
		},

		goCancel: function(){
			Backbone.history.navigate('home', {trigger:true, replace: true });
		}
	});
	
	

	// Для 404 page
	staticViews.NotFoundView = Backbone.Marionette.ItemView.extend({
		className: 'page-404',
		// указываем уже существующий в дом, элемент
		template: '#page-404-template',
	});
	
	

	// Для footer
	staticViews.GeneralFooterView = Backbone.Marionette.ItemView.extend({
		className: 'container footer-book',
		// указываем уже существующий в дом, элемент
		template: '#footer-template',
	});
});