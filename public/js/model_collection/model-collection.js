/*global Backbone */
'use strict';

var modelCollection = myLibrarryApp.module('modelCollection', function(modelCollection, MyLibrarryApp, Backbone){
	// модель книги
	modelCollection.Book = Backbone.Model.extend({
		// как и в backbone, пишем, какие атрибуты будут по умолчанию у модели
		defults: {
			title: undefined,
			author: undefined,
			year: undefined,
			description: undefined,
			genre: undefined,
			id: undefined
		},
		defaults: {
		    "title" : undefined,
		    "author" : undefined,
		    "year" : undefined,
		    "description" : undefined,
		    "genre" : undefined,
		    "id" : undefined
		},

		accordance: function(filterVal){
			// если роут ровняется all - то вернет "правда" для всех моделей
			if(this.get('genre') === filterVal){
				return true;
			} else if(filterVal === 'all'){
				return true;
			} else {
				return false;
			}
		},
		// это url адресс запроса для модели
		urlRoot: '/api/books'
	});
	// коллекция для наших моделей
	modelCollection.CollectionBook = Backbone.Collection.extend({
		// на основе какого конструктора будут строиться модели коллекции
		model: modelCollection.Book,
		
		sortAttribute: 'title',
		goSort: function(sortAttribute){
			this.sortAttribute = sortAttribute;
			this.sort();
		},
		comparator: function(model){
			return model.get(this.sortAttribute);
		},

		// это url адресс запроса для коллекции
		url: '/api/books'
	});
});