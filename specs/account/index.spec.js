import axios from "axios";
import { jest } from "@jest/globals"; 
import expect from "expect"; jest;
import supertest from "supertest";    
import account from '../../framework/services/account.services';
import bookstore from '../../framework/services/bookstore.services';
import config from '../../framework/config';
import { Feature } from '../../node_modules/jest-allure/dist/Reporter';
import { Story } from '../../node_modules/jest-allure/dist/Reporter';
import { description } from '../../node_modules/jest-allure/dist/Reporter';
import { epic } from '../../node_modules/jest-allure/dist/Reporter';



let userID=''
let token=''
let isbn=config.isbns[0]
let isbnNew=config.isbns[1] //  вторая книга
let collection=[]
let resultsCode=0

//describe('Account', () => {
	describe('1.0. Создание пользователя POST /Account/v1/User', () => {
	test('Регистрация должна проходить успешно с правильным логином и паролем', async () => {	  
      const res = await account.createAccount(config.credentials)	
	  token = await account.getAuthToken()
	  userID = res.body.userID	  
	  console.log('0. res',res.text)
	  console.log('0. token',token)
      expect(res.status).toEqual(201);
    })
  })
	
	
	
  describe('1.1 Авторизация POST /Account/v1/Authorized', () => {
	test.skip('Неуспешная авторизация (false) с правильным логином и паролем, и неправильным токеном', async () => {	  
      const res = await account.authLoginPass(config.credentials,'anyToken')	 	  
      expect(res.status).toEqual(200);
      expect(res.text).toEqual('false');
    })
	test('Неуспешная авторизация (404) с неправильным логином/паролем и правильным токеном', async () => {
	  token = await account.getAuthToken()
      const res = await account.authLoginPass({userName: 'testLogin20',	password:'1testPass%123456789'},token)	 	  
      expect(res.status).toEqual(404);
      expect(res.text).toEqual('{"code":"1207","message":"User not found!"}');
    })
	test('Неуспешная авторизация (400) при отсутствии обязательного параметра в body', async () => {
	  token = await account.getAuthToken()
      const res = await account.authLoginPass({userName: 'testLogin20'},token)	 	  
      expect(res.status).toEqual(400);
      expect(res.text).toEqual('{"code":"1200","message":"UserName and Password required."}');
    })
	test('Успешная авторизация (true) с правильным логином, паролем и токеном', async () => {
      const res = await account.authLoginPass(config.credentials,token)	 
	  console.log('1. res',res.text)			// для красоты
      expect(res.status).toEqual(200);
      expect(res.text).toEqual('true');
    })
	
  })
	
	
  describe('1.2. Получение информации о пользователе GET /Account/v1/User/{UUID}', () => {
	test('Успешное получение инфо с правильным токеном и userID', async () => {	  
      const res = await account.getInfo(userID,token)	 
	  console.log('2. res',res.text)	// для красоты
      expect(res.status).toEqual(200);	 
    })
	test('Неуспешное получение инфо с неправильным токеном к userID ', async () => {	  
      const res = await account.getInfo(userID,'anyToken')	 
      expect(res.status).toEqual(401);	 
	  expect(res.text).toEqual('{"code":"1200","message":"User not authorized!"}')
    })
	test('Неуспешное получение инфо для несуществующего userID ', async () => {	  
      const res = await account.getInfo('anyUserID',token)	 
      expect(res.status).toEqual(401);
	  expect(res.text).toEqual('{"code":"1207","message":"User not found!"}')	  
    })
  })
	
	
  describe('1.3. Неуспешные удаления пользователя DELETE /Account/v1/User/{UUID}', () => {	
	test('Неуспешное удаление юзера с несуществующим userID', async () => {		  
      const res = await account.deleteAccount('anyUserID',token)	 	  
      expect(res.status).toEqual(200);	 
	  expect(res.text).toEqual('{"code":"1207","message":"User Id not correct!"}')
    })
	test('Неуспешное удаление юзера с неправильным токеном', async () => {		  
      const res = await account.deleteAccount(userID,'anyToken')	 	  
      expect(res.status).toEqual(401);	 
	  expect(res.text).toEqual('{"code":"1200","message":"User not authorized!"}')
    })
  })
	

describe('2.1. Создание книги POST /BookStore/v1/Books', () => {
	test('Успешное создание', async () => {
	  const res = await bookstore.createBook(userID,token,isbn)	 
	  console.log('1. res Создание книги',res.text)			// для красоты
      expect(res.status).toEqual(201);      
    })
	
	test('Успешное создание пачки книг', async () => {
		collection=await bookstore.createCollections(config.isbns) // создаем коллекцию книг для загрузки
		console.log('1. collection',collection)
		const res = await bookstore.createBookList(userID,token,collection)	 
		console.log('1. res Создание пачки книг',res.text)			// для красоты
		expect(res.status).toEqual(201);      
    })
	
  })
		

	
  describe('2.2. Обновление книги PUT /BookStore/v1/Books', () => {
	test('Успешное обновление', async () => {
	  const res = await bookstore.putBook(userID,token,isbn,isbnNew)	 
	  console.log('2. res Обновление книги',res.text)			// для красоты
      expect(res.status).toEqual(200);      
    })

  })
	
	
  describe('2.3. Получении информации о книге GET /BookStore/v1/Books', () => {
	test('Успешное получение инфо', async () => {
	  const res = await bookstore.getBook(isbnNew)	 
	  //console.log('2. res',res)  // отсюда извлечь бы ответ красиво
	  console.log('2. res Получение инфо',res.text)			// для красоты
      expect(res.status).toEqual(200);      
    })

  })
	
	// метод для отработки методов аллюр репорта НЕ РАБОТАЮТ
  describe('2.3A. Отработка Allure: Получении информации о книге GET /BookStore/v1/Books', () => {
	
	// объект reporter у коотрого есть методы. 
			//можно добавить для всех тестов внутри describe
			// beforeEach(()=>{
				// тут перечислить репортеры
			//})
	/*
	reporter.feature('some feature')  
	reporter.story('some story')
	reporter.description('some description')
	reporter.epic('some epic')
	*/
	
	test('Успешное получение инфо', async () => {
		jest.retryTimes(3); // не работает
	  const res = await bookstore.getBook(isbnNew)	 
	  //console.log('2. res',res)  // отсюда извлечь бы ответ красиво
	  console.log('2. res Получение инфо',res.text)			// для красоты
      expect(res.status).toEqual(200);      
    })

  })
	
	
	
	
  describe('2.4. Удаление книги DELETE /BookStore/v1/Book', () => {
	test('Успешное удаление книги', async () => {	  
      const res = await bookstore.deleteBook(userID,token,isbnNew)	 
	  console.log('2.4. res Удаление книги',res.text)	    // для красоты
      expect(res.status).toEqual(204);	 
    }),
	// сюда накидать тестов на ручку
	
	test.each`
		isbnNew | resultsCode				
		${config.isbns[2]} | ${204}
		${config.isbns[3]} | ${204}
		${0} | ${400}
		`('Удаление книги: при isbn=$isbnNew возвращается $resultsCode', async ({isbnNew,resultsCode}) => {	  
      const res = await bookstore.deleteBook(userID,token,isbnNew)	 
	  //console.log('4. res Удаление книги',res)
	  console.log('4. isbnNew',isbnNew)
	  console.log('4. resultsCode',resultsCode)
	  console.log('4. res Удаление книги',res.text)	    // для красоты
      expect(res.status).toEqual(resultsCode);	 
    })
	
	
		/* это не работает((( userID и token не подтягиваются
		test.each`
		userIDt | tokent | isbnNewt | resultsCode				
		${'uncorrectUserID'} | ${this.token} | ${config.isbns[2]} | ${401}
		${this.userID} | ${'uncorrectToken'} | ${config.isbns[3]} | ${401}
		${this.userID} | ${this.token} | ${config.isbns[9]} | ${400}
		`('Неуспешное удаление: при $userIDt, $tokent, $isbnNewt возвращается $resultsCode', async ({userIDt,tokent,isbnNewt,resultsCode}) => {	  
      const res = await bookstore.deleteBook(userIDt,tokent,isbnNewt)	 
	  console.log('4. res Удаление книги',res.text)	    // для красоты
      expect(res.status).toEqual(resultsCode);	 
    })
	*/
		
	
  })
  



	
  describe('3.1. Успешное удаление пользователя DELETE /Account/v1/User/{UUID}', () => {	
	test('3.1 Успешное удаление юзера с правильным логином, паролем и userID', async () => {		  
      const res = await account.deleteAccount(userID,token)
	  console.log('N. res Удаление юзера',res.text)	// для красоты
      expect(res.status).toEqual(204);	 
    })	
  })
	

	    

