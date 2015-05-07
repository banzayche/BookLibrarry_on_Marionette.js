/*global Backbone */
'use strict';

var listViews = myLibrarryApp.module('listViews', function(listViews, MyLibrarryApp, Backbone){
	// Это наше представление одной модели
	listViews.BookItemView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		className: 'book-tr',
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

	// View for empty collection
	listViews.NoChildView = Backbone.Marionette.ItemView.extend({
		tagName: 'tr',
		id: 'empty-collection',
		// указали шаблон
		template: '#noChildView-template',
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

		initialize: function(){
			// Слушаем filterState и если модель изменится то проверяем, правильно ли отображен инпут
			this.listenTo(MyLibrarryApp.request('filterState'), 'change', this.render, this);
			console.log(MyLibrarryApp.GeneralCollection);
		},

		ui: {
			createBook : '#createBook',
			goSort : '.go-sort'
		},
		events: {
			'click @ui.createBook' : "goCreateBook",
			'click @ui.goSort' : "sortOperation",
		},

		// -------------------------------------------------------------
		// изменяем стандартную функцию прорисовки моделей из коллекции
		addChild: function(childModel){
			var newFilter = MyLibrarryApp.request('filterState').get('filter');
			// если метод соответствия модели для данного роута вернет "правда" то она рисуется
			if(childModel.accordance(newFilter))	{
				// стандартный метод прорисовки моделей
				Backbone.Marionette.CompositeView.prototype.addChild.apply(this, arguments);
			}
		},
		// -------------------------------------------------------------

		filterStart: function(){
			alert(myLibrarryApp.request('filterState').get('filter'));
		},

		sortOperation: function(e){
			var sortAttribute = $(e.target).html().toLowerCase()
			this.collection.goSort(sortAttribute);
		}
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
			var self = this;
			var pluckOBJ = _.pluck(self.collection.toJSON(), 'genre');
			var filter = _.uniq(pluckOBJ);

			for(var i = 0; i<filter.length; i++){
				self.ui.genreContainer.append('<li><a class="filter-genre">'+filter[i]+'</a></li>');
			}
		},
		// функция смены атрибута фильтрации, у нашей вспомогательной модели
		setFilterAttribute: function(e){
			var attrFilter = $(e.target).html();
			myLibrarryApp.request('filterState').set("filter", attrFilter);
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