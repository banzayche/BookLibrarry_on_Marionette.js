/*global Backbone */
'use strict';

// это модуль, который содержит в себе представления, для изображения списка книг в виде плитки
var TileListViews = myLibrarryApp.module('TileListViews', function(TileListViews, MyLibrarryApp, Backbone){
	// Это наше представление одной модели
	TileListViews.BookItemView = Backbone.Marionette.ItemView.extend({
		className: 'item-book-tile col-sm-6 col-md-3 col-xs-6',
		template: '#tile-book-template',
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

	// Представление для пустой коллекции
	TileListViews.NoChildView = Backbone.Marionette.ItemView.extend({
		tagName: 'div',
		// указали шаблон
		template: '#tile-empty-collection',
	});

	// Это наше представление коллекции моделей
	TileListViews.BookListView = Backbone.Marionette.CompositeView.extend({
		tagName: 'div',
		template: "#tile-list",
		// какое дочерние представление будет использоваться для отображения элементов коллекции
		childView:  TileListViews.BookItemView,
		// представление для пустой коллекции
		emptyView: TileListViews.NoChildView,

		initialize: function(){
			this.listenTo(MyLibrarryApp.request('filterState'), 'change', this.render, this);
		},

		// ------------------------------------------------------------------------------
		// изменяем стандартную функцию прорисовки моделей из коллекции
		addChild: function(childModel){
			var newFilter = MyLibrarryApp.request('filterState').get('filter');
			// если метод соответствия модели для данного роута вернет "правда" то она рисуется
			if(childModel.accordance(newFilter))	{
				// стандартный метод прорисовки моделей
				Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
			}
		},
		// ------------------------------------------------------------------------------
	});
});