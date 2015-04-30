/*global Backbone */
'use strict';

var modelCollection = myLibrarryApp.module('modelCollection', function(modelCollection, MyLibrarryApp, Backbone){
	// модель книги
	modelCollection.Book = Backbone.Model.extend({
		// как и в backbone, пишем, какие атрибуты будут по умолчанию у модели
		defult: {
			title: undefined,
			author: undefined,
			year: undefined,
			description: undefined,
			genre: undefined,
			id: undefined
		},

		// это url адресс запроса для модели
		urlRoot: '/api/todos'
	});
	// коллекция для наших моделей
	modelCollection.CollectionBook = Backbone.Collection.extend({
		// на основе какого конструктора будут строиться модели коллекции
		model: modelCollection.Book,

		// это url адресс запроса для коллекции
		url: '/api/todos'
	});
});