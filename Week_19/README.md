# 学习笔记
## 搭建Nodejs环境

- sudo apt-get update
- sudo apt install nodejs
- sudo apt install npm
- sudo npm install -g n
- sudo n 14.11.0


## 利用Express,编写服务器
- npm init
- npm install express --save
- npx express-generator
- SET DEBUG=server:* & npm start
- powerSheel:$env:DEBUG='server:*'; npm start

## 把Server部署到服务器上
- scp -r E:\ATrain\Frontend-09-Template\Week_19\server root@1.117.186.165:/home 
-  http://1.117.186.165:3000
-  http://1.117.186.165:8082
-  http://1.117.186.165:3000/stylesheets/style.css

 

