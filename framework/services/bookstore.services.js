import supertest from "supertest"
import config from "../config"
const {url}=config

let userID='';
let token=''
let collection=[]
let isbns=[]
let isbn='9781449325862'
let isbnNew='9781449331818'

// создаем контроллер bookstore
const bookstore ={							

	// Функция создания книги
	//createBook: (userID,collection) => {			
	createBook: (userID,token,isbn) => {	
		return supertest (url)
			.post('/BookStore/v1/Books')
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
					userId: `${userID}`,
					//"collectionOfIsbns": config.collectionOfIsbns1
					collectionOfIsbns:[{isbn: `${isbn}`}]
				})						
	},
	
	// массовая загрузка книг
	createBookList: (userID,token,collection) => {	
		return supertest (url)
			.post('/BookStore/v1/Books')
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
					userId: `${userID}`,
					//"collectionOfIsbns": config.collectionOfIsbns1
					collectionOfIsbns: collection
				})						
	},
	
	// создаем коллекцию
	createCollections: (isbns) => {	
		for (let i=2; i<config.isbns.length; i++) {
			collection.push ({"isbn": isbns[i]})
		}		
		return collection						
	},
	
	// удаление книги						
	deleteBook: (userID,token,isbn) => {
		return supertest (url)
			.del('/BookStore/v1/Book')
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			//.set('Authorization', `Basic ${payload}`)
			.send({
					userId: `${userID}`,
					isbn:`${isbn}`
				})						
	},
	
	
	//* получение списка книг - не пригодится похоже						
	getAllBooks: () => {
		return supertest (url)
			.get(`/BookStore/v1/Book`)
			.set('Accept','application/json')
			.send()						
	},
	
	
	// обновление книги (замена книги на новую)
	putBook: (userID,token,isbn,isbnNew) => {
		return supertest (url)
			.put(`/BookStore/v1/Books/${isbn}`)
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			.send({
					userId: `${userID}`,
					isbn:`${isbnNew}`
				})						
	},
	
	// получение инфо о книге 
	getBook: (isbn) => {
		return supertest (url)
			.get(`/BookStore/v1/Book?ISBN=${isbn}`)
			.set('Accept','application/json')
			//.set('Authorization', `Bearer ${token}`)
			.send()						
	},
	
}
	
	
	

export default bookstore