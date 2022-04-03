{
	"info": {
		"_postman_id": "0f43f14a-6832-4150-83e7-6fbcb00eee59",
		"name": "sos2122-25",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "GET/countries",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Status code is 200\", function () {\r",
							"    pm.response.to.have.status(200);\r",
							"});\r",
							"\r",
							"pm.test(\"Response is an array\", function () {\r",
							"    var jsonData = pm.response.json();\r",
							"    pm.expect(Array.isArray(jsonData)).to.eql(true);\r",
							"});\r",
							"\r",
							"pm.test(\"Response has countries\", function () {\r",
							"    var jsonData = pm.response.json();\r",
							"    pm.expect(jsonData.length).to.be.at.least(1);\r",
							"});"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						""
					]
				}
			},
			"response": []
		},
		{
			"name": "GET/countries/eeuu",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Status code is 200\", function () {\r",
							"    pm.response.to.have.status(200);\r",
							"});\r",
							"\r",
							"pm.test(\"Response is an array\", function () {\r",
							"    var jsonData = pm.response.json();\r",
							"    pm.expect(Array.isArray(jsonData)).to.eql(true);\r",
							"});\r",
							""
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/eeuu",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						"eeuu"
					]
				}
			},
			"response": []
		},
		{
			"name": "POST /madagascar",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Status code is 201\", function () {\r",
							"    pm.response.to.have.status(201);\r",
							"});"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"country\": \"madagascar\",\r\n    \"year\": 2019,\r\n    \"percapita\": -2391,\r\n    \"currency\": 14787.768,\r\n    \"currentprices\":20939\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						""
					]
				}
			},
			"response": []
		},
		{
			"name": "DELETE /economies",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Status code is 200\", function () {\r",
							"    pm.response.to.have.status(200);\r",
							"});"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						""
					]
				}
			},
			"response": []
		},
		{
			"name": "DELETE /countries/madagascar",
			"event": [
				{
					"listen": "test",
					"script": {
						"exec": [
							"pm.test(\"Status code is 200\", function () {\r",
							"    pm.response.to.have.status(200);\r",
							"});"
						],
						"type": "text/javascript"
					}
				}
			],
			"request": {
				"method": "DELETE",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/eeuu/2019",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						"eeuu",
						"2019"
					]
				}
			},
			"response": []
		},
		{
			"name": "PUT /economies FAIL",
			"request": {
				"method": "PUT",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies"
					]
				}
			},
			"response": []
		},
		{
			"name": "PUT /countries/eeuu",
			"request": {
				"method": "PUT",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/eeuu",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						"eeuu"
					]
				}
			},
			"response": []
		},
		{
			"name": "POST /economies/eeuu FAIL",
			"request": {
				"method": "POST",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/eeuu",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						"eeuu"
					]
				}
			},
			"response": []
		},
		{
			"name": "InitialData",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "https://sos2122-25.herokuapp.com/api/v1/economies/loadInitialData",
					"protocol": "https",
					"host": [
						"sos2122-25",
						"herokuapp",
						"com"
					],
					"path": [
						"api",
						"v1",
						"economies",
						"loadInitialData"
					]
				}
			},
			"response": []
		}
	]
}
