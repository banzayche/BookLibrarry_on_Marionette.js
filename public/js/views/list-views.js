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
		template: "#list-region-template",
		// какое дочерние представление будет использоваться для отображения элементов коллекции
		childView:  listViews.BookItemView,
		// представление для пустой коллекции
		emptyView: listViews.NoChildView,
		ui: {
			createBook : '#createBook',
			goSort : '.go-sort'
		},
		events: {
			'click @ui.createBook' : "goCreateBook",
			'click @ui.goSort' : "sortOperation",
		},
		// ul: {
		// 	newBook : '#create-book'
		// },
		// events: {
		// 	'click @ui.createBook' : 'goCreateBook'
		// },
		sortOperation: function(e){
			var sortAttribute = $(e.target).html().toLowerCase()
			this.collection.goSort(sortAttribute);
		}
	});

	// View for empty collection
	listViews.NoChildView = Backbone.Marionette.ItemView.extend({
		// указали шаблон
		template: '#noChildView-template',
	});

	// control panel view
	listViews.ControlForList = Backbone.Marionette.ItemView.extend({
		className: 'ovf-a',
		// указали шаблон
		template: '#control-list-region-template',
		ui: {
			createBook : '#createBook',
			genreContainer : '#filter-atributes-container',
			genreSpan : '.filter-genre'
		},
		events: {
			'click @ui.createBook' : 'goCreateBook',
			'click @ui.genreSpan' : 'setFilterAttribute'
		},

		onShow: function(){
			this.showFilter();
		},
		showFilter: function(){
			// var self= this;
			// var attrsValue = _.pluck(self.collection.toJSON(), 'genre');
			// console.log(attrsValue);
			var self = this;
			var pluckOBJ = _.pluck(self.collection.toJSON(), 'genre');
			var filter = _.uniq(pluckOBJ);

			for(var i = 0; i<filter.length; i++){
				self.ui.genreContainer.append('<li><a class="filter-genre">'+filter[i]+'</a></li>');
			}
		},
		goCreateBook: function(){
			Backbone.history.navigate('book/create', {trigger:true, replace: true });
		},
	});

	// Layout view
	listViews.mainLayoutView = Backbone.Marionette.LayoutView.extend({
		className: 'table-responsive',
		template: '#book-list-layout-template',
		regions: {
			listRegion: '#list-region',
			controlRegion: '#control-region'
		},
		onShow: function(){
			var mainView = new MyLibrarryApp.listViews.BookListView({
				collection: this.collection,
			});
			var controlListBooks = new MyLibrarryApp.listViews.ControlForList({
				collection: this.collection,
			});
			
			this.getRegion('listRegion').show(mainView);
			this.getRegion('controlRegion').show(controlListBooks);
		}
	});
});