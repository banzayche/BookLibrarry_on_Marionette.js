/*global Backbone */
'use strict';

var listViews = myLibrarryApp.module('listViews', function(listViews, MyLibrarryApp, Backbone){
	// Это наше представление одной модели
	listViews.BookItemView = Backbone.Marionette.ItemView.extend({
		ul: 'tr',
		template: '#book-template',
	});
	// Это наше представление коллекции моделей
	listViews.BookListView = Backbone.Marionette.CompositeView.extend({
		ul: 'div',
		className: 'table-responsive',
		template: '#book-list-template',
		// какое дочерние представление будет использоваться для отображения элементов коллекции
		childView:  listViews.BookItemView,
	});
});