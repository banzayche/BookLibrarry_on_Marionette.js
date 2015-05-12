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
		// это метод Marionette для прослушивания событий модели
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
		// какое дочерние представление будет использоваться для отображения пустой коллекции
		emptyView: listViews.NoChildView,

		initialize: function(){
			// слушаем изменение нашей вспомогательной модели и рендерим, если что-то изменилось.
			this.listenTo(MyLibrarryApp.request('filterState'), 'change', this.render, this);
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

		sortOperation: function(e){
			var sortAttribute = $(e.target).html().toLowerCase()
			this.collection.goSort(sortAttribute);
		}
	});


	// представление контрольной панели (там, где кнопка "создать новую модель" и список существующих атрибутов для фильтрации)
	listViews.ControlForList = Backbone.Marionette.ItemView.extend({
		// указали шаблон
		template: '#control-list-region-template',
		ui: {
			createBook : '#createBook',
			genreContainer : '#filter-atributes-container',
			genreSpan : '.filter-genre',
			goVarianListView : '#goVariantList'
		},
		events: {
			'click @ui.createBook' : 'goCreateBook',
			'click @ui.genreSpan' : 'setFilterAttribute',
			'click @ui.goVarianListView' : 'goVarianListView'
		},

		onShow: function(){
			this.showFilter();
			this.togleIconVariant();
		},

		// действие по нажатию на кнопку смены расположения моделей
		goVarianListView: function(){
			if(MyLibrarryApp.request('filterState').get('list_type') === 'tile'){
				MyLibrarryApp.request('filterState').set("list_type", 'table');
			} else{
				MyLibrarryApp.request('filterState').set("list_type", 'tile');
			}			
		},

		// смена иконки на кнопке смены расположения моделей
		togleIconVariant: function(){
			if(MyLibrarryApp.request('filterState').get('list_type') === 'tile'){
				this.ui.goVarianListView.removeClass('glyphicon-th');
				this.ui.goVarianListView.addClass('glyphicon-th-list');
			} else{
				this.ui.goVarianListView.removeClass('glyphicon-th-list');
				this.ui.goVarianListView.addClass('glyphicon-th');
			}
			
		},
		
		// Выводим список атрибутов для фильтрации
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

		// переходим к созданию книги
		goCreateBook: function(){
			Backbone.history.navigate('book/create', {trigger:true, replace: true });
		},
	});

	// это представление содержит в себе 2 региона: для отображение списка моделей и контрольной панели.
	listViews.mainLayoutView = Backbone.Marionette.LayoutView.extend({
		className: 'table-responsive',
		template: '#book-list-layout-template',
		regions: {
			listRegion: '#list-region',
			controlRegion: '#control-region'
		},
		initialize: function(){
			// слушаем изменение атрибута list-type у модели
			this.listenTo(MyLibrarryApp.request('filterState'), 'change:list_type', this.shoiceVariant, this);
		},
		onShow: function(){
			this.shoiceVariant();
		},

		// Определяем какой вариант прорисовки модели выбрать
		shoiceVariant: function(){
			// Смотрим значение атрибута нашей вспомогательной модели
			if(MyLibrarryApp.request('filterState').get('list_type') === 'tile'){
				this.tileShow();
			} else{
				this.tableShow();
			}

			// контрольная панель в обеих случаях одна и та же, поэтому она не зависит от вышеуказанных условий
			var controlListBooks = new MyLibrarryApp.listViews.ControlForList({
				collection: this.collection,
			});
			this.getRegion('controlRegion').show(controlListBooks);
		},

		// книги плиткой
		tileShow: function(){
			var mainView = new MyLibrarryApp.TileListViews.BookListView({
				collection: this.collection,
			});
			this.getRegion('listRegion').show(mainView);		
		},
		
		// книги таблицей
		tableShow: function(){
			var mainViewNew = new MyLibrarryApp.listViews.BookListView({
				collection: this.collection,
			});
			this.getRegion('listRegion').show(mainViewNew);
		}
	});
});