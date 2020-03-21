# Simple Tweet

## 主要功能

#### 1.使用者填寫名子、Email、Password 註冊帳號

#### 2.使用者註冊成功後以 Email、Password 登入 Tweet

#### 3.使用者能瀏覽所有的推播 (tweet)

#### 4.使用者能在首頁看見跟隨者 (followers) 數量排列前 10 的使用者推薦名單

#### 5.點擊其他使用者的名稱時，能瀏覽該使用者的個人資料及推播

#### 6.使用者能新增推播,字數限制在 140 以內，且不能為空白

#### 7.使用者能新增推播並且點選下方打卡功能，加入打卡地點

#### 8.使用者能新增推播使用 Hashtag 特殊符號 #作為標記

#### 9.使用者能回覆別人的推播

#### 10.使用者可以追蹤/取消追蹤其他使用者 (不能追蹤自己)

#### 11.使用者能對別人的推播按 Like/Unlike

#### 12.任何登入使用者都可以瀏覽特定使用者的 Tweets、Following、Follower、Like

#### 13.使用者可以點選加到最愛/移除最愛追蹤餐廳

#### 12.使用者可以點選 Like/Unlike

#### 14.任何登入使用者都可以在特定使用者 Profile 點選 check with 和特定使用者進行對話

#### 網管理者:

##### 1. 管理者登入網站後，能夠經由瀏覽列進入後台頁面

##### 2. 管理者可以瀏覽全站的推播清單

##### 3. 管理者可以快覽推播回覆內容

##### 4. 管理者可以瀏覽站內所有的使用者清單包括推播數量、關注人數、跟隨者人數、推播被 like 的數量)

## 測試帳號

| Name  | Email             | Password | 預設權限 |
| ----- | ----------------- | -------- | -------- |
| root  | root@example.com  | 12345678 | admin    |
| user1 | user1@example.com | 12345678 | user     |
| user2 | user2@example.com | 12345678 | user     |

## Installing

#### 環境

1.  node.js v-10.15.0

2.  專案套件
    - bcryptjs: "^2.4.3",
    - body-parser": "^1.18.3",
    - chai: "^4.2.0",
    - connect-flash: "^0.1.1",
    - dotenv: "^8.2.0",
    - express: "^4.16.4",
    - express-handlebars: "^3.0.0",
    - express-session: "^1.15.6",
    - faker: "^4.1.0",
    - handlebars.moment: "^1.0.4",
    - imgur-node-api: "^0.1.0",
    - method-override: "^3.0.0",
    - mocha: "^6.0.2",
    - moment: "^2.24.0",
    - multer: "^1.4.2",
    - mysql2: "^1.7.0",
    - passport: "^0.4.0",
    - passport-local: "^1.0.0",
    - sequelize: "^4.44.4",
    - sequelize-cli: "^5.5.1",
    - sinon: "^7.2.3",
    - sinon-chai: "^3.3.0",
    - socket.io: "^2.3.0"

#### 確認本機是否安裝 [MySql](https://dev.mysql.com/downloads/windows/installer/)

#### 開啟終端機到存放專案本機位置並執行:

> git clone hhttps://github.com/StephHan232430/simple-twitter-express-starter.git

##### 專案套件安裝

```

1.使用終端機切換目錄到專案: simple-twitter-express-starter
2.使用終端機安裝套件: npm install

```

#### 專案的「根目錄」新增 .env 這個檔案，參考 env example

> #### [圖片網站 Imgur](https://api.imgur.com/oauth2/addclient) 填寫資料取得 client ID

#### 資料庫設定

##### 請在 MySQL Workbench 輸入下方指令

- 建立 ac_twitter_workspace 資料庫

```

create database ac_twitter_workspace

```

##### 建立 Users 和 restaurant table

- npx sequelize db:migrate

##### 建立種子資料

- npx sequelize db:seed:all

#### 執行程式

```

1. 終端機輸入: nodemon run dev
2. 開啟網頁輸入: http://localhost:3000/signin

```
