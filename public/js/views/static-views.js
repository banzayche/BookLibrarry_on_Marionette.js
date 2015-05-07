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
	});

	// Для подробного описания книги
	staticViews.DetailBookView = Backbone.Marionette.ItemView.extend({
		className: 'detail-book',
		// указываем уже существующий в дом, элемент
		template: '#book-detail-template',
		model: MyLibrarryApp.modelCollection.Book,
		ui: {
			cancel : '#cancel',
		},
		events: {
			'click @ui.cancel' : "goCancel",
		},

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

		goSave: function(){
			var title = this.ui.title.val().trim();
			var author = this.ui.author.val().trim();
			var year = this.ui.year.val().trim();
			var genre = this.ui.genre.val().trim();
			var description = this.ui.description.val().trim();
			
			if(title && author && year && genre){
				if(this.model.isNew()){
					MyLibrarryApp.GeneralCollection.create({
						title: title,
						author: author,
						year: year,
						genre: genre,
						description: description,
					});
					Backbone.history.navigate('home', {trigger:true, replace: true });
				} else{
					this.ui.error.hide();
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
				this.ui.error.show();
			}
		},

		goCancel: function(){
			Backbone.history.navigate('home', {trigger:true, replace: true });
		}
	});
});