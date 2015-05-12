/*global Backbone */
'use strict';

// Создаем модуль который будет содержать в себе нашу модель и коллекцию
var modelCollection = myLibrarryApp.module('modelCollection', function(modelCollection, MyLibrarryApp, Backbone){
	// модель книги
	modelCollection.Book = Backbone.Model.extend({
		// как и в backbone, пишем, какие атрибуты будут по умолчанию у модели
		defaults: {
		    "title" : undefined,
		    "author" : undefined,
		    "year" : undefined,
		    "description" : 'Not specified.',
		    "genre" : undefined,
		    "id" : undefined
		},

		// этот метод помогает нам производить фильтрацию, без воздействия на коллекцию
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
		
		// методы ниже, помогают реализовать сортировку коллекции
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