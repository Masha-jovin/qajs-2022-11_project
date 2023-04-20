import supertest from "supertest"
import config from "../config"
const {url}=config

let userID='';
let token=''

// создаем контроллер account
const account ={							

	// Функция создания аккаунта
	createAccount: (payload) => {						
		return supertest (url)
			.post('/Account/v1/User')
			.set('Accept','application/json')
			.send(payload)						
	},
	
	async getUserID(){					// создали получение UserID - как будто не пригодилось
		const payload=config.credentials      // 1.в переменную кладем логин и пароль из конфига (объект)
		const resu=await this.createAccount(payload)
		return resu.body.userID
	},
	async getUserIDwithCache() {
		if(UserID){
			return UserID;
		}
		UserID=await this.getUserID()
		return UserID
	},
	
	// получение токена
	getToken: (payload) => {						// 2. переменную забираем сюда
		return supertest (url)
			.post('/Account/v1/GenerateToken')
			.set('Accept','application/json')
			.send(payload)						// 3.отправляет переменную
	},
	async getAuthToken(){					// создали получение токена
		const payload=config.credentials      // 1.в переменную кладем логин и пароль из конфига (объект)
		const rest=await account.getToken(payload)
		return rest.body.token
	},
	
	
		
	// авторизация по логину и паролю
	authLoginPass: (payload,token) => {						
		return supertest (url)
			.post('/Account/v1/Authorized')
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			.send(payload)						
	},
	
	// получение инфы
	getInfo: (userID,token) => {						
		return supertest (url)
			.get(`/Account/v1/User/${userID}`)
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			.send()						
	},
	
	
	// удаление аккаунта - ЭТО НЕ РАБОТАЕТ! не понимаю почему
	deleteAccount: (userID,token) => {						
	//deleteAccount: (userID,token,payload) => {
	//deleteAccount: (userID) => {
		return supertest (url)
			.del(`/Account/v1/User/${userID}`)
			.set('Accept','application/json')
			.set('Authorization', `Bearer ${token}`)
			//.set('Authorization', `Basic ${payload}`)
			.send()						
	}
}
	
		

export default account