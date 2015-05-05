/*global Backbone */
'use strict';

var listViews = myLibrarryApp.module('listViews', function(listViews, MyLibrarryApp, Backbone){
	// Это наше представление одной модели
	listViews.BookItemView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		template: '#book-template',
		ui: {
			destroy : '#delete', 
		},
		events: {
			'click @ui.destroy' : "destroyModel",
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
	});

	// View for empty collection
	listViews.NoChildView = Backbone.Marionette.ItemView.extend({
		id: 'image-attention',
		// указали шаблон
		template: '#noChildView-template',
	});
});