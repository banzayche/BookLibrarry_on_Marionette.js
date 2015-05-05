/*global Backbone */
'use strict';

var listViews = myLibrarryApp.module('listViews', function(listViews, MyLibrarryApp, Backbone){
	// Это наше представление одной модели
	listViews.BookItemView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		template: '#book-template',
		ui: {
			destroy : '#delete',
			edit : '#edit',
		},
		events: {
			'click @ui.destroy' : "destroyModel",
			'click @ui.edit' : "goEdit",
			'dblclick' : 'goDetail'
		},
		modelEvents: {
			'change' : 'render',
		},
		
		goEdit: function(){
			Backbone.history.navigate('book/'+this.model.get('id')+'/edit', {trigger:true, replace: true });
		},
		goDetail: function(){
			Backbone.history.navigate('book/'+this.model.get('id')+'/detail', {trigger:true, replace: true });
		},
		
		destroyModel: function(){
			this.model.destroy();
		},
	});

	// Это наше представление коллекции моделей
	listViews.BookListView = Backbone.Marionette.CompositeView.extend({
		tagName: 'table',
		className: 'table table-bordered',
		template: "#book-list-template",
		// какое дочерние представление будет использоваться для отображения элементов коллекции
		childView:  listViews.BookItemView,
		// представление для пустой коллекции
		emptyView: listViews.NoChildView,
		ui: {
			createBook : '#createBook',
		},
		events: {
			'click @ui.createBook' : "goCreateBook",
		},
		// ul: {
		// 	newBook : '#create-book'
		// },
		// events: {
		// 	'click @ui.createBook' : 'goCreateBook'
		// },
		goCreateBook: function(){
			Backbone.history.navigate('book/create', {trigger:true, replace: true });
		}
	});

	// View for empty collection
	listViews.NoChildView = Backbone.Marionette.ItemView.extend({
		// указали шаблон
		template: '#noChildView-template',
	});
});