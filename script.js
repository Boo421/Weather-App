function getWeather() {
    const apiKey = 'f8dde5d8b3c0e4616bb411b165af5714'; //OpenWeatherMapAPIへのリクエストの認証に使用されるAPIキーを定義します
    const city = document.getElementById('city').value; //ID「city」の入力フィールドに入力された値を取得します

    if (!city) {             //都市の入力が空かどうかを確認します
        alert('都市または国の名前を入力してください');  //都市の入力が空の場合にアラートを表示する
        return;  //都市の入力が空の場合は関数を終了します
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; 
    //現在の気象データAPIリクエストのURLを構築します
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;  
    //予測データAPIリクエストのURLを構築します

    fetch(currentWeatherUrl)  //現在の気象データAPIにリクエストを送信します
        .then(response => response.json())  //レスポンスをJSONに変換します
        .then(data => {             //取得したデータを使用して「displayWeather」関数を呼び出します
            displayWeather(data);
        })
        .catch(error => {
            console.error('現在の天気データの取得中にエラーが発生します：', error); //フェッチ中に発生したエラーを処理します
            alert('現在の天気データの取得中にエラーが発生しました。もう一度お願いします。');
        });

    fetch(forecastUrl)  //予測データAPIにリクエストを送信します
        .then(response => response.json())  //レスポンスをJSONに変換します
        .then(data => {
            displayHourlyForecast(data.list);  //取得したデータを使用して「displayHourlyForecast」関数を呼び出します
        })
        .catch(error => {
            console.error('時間ごとの予報データの取得中にエラーが発生します：', error); //フェッチ中に発生したエラーを処理します
            alert('時間ごとの予報データの取得中にエラーが発生しました。もう一度お願いします。');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div'); //ID「temp-div」の要素を取得
    const weatherInfoDiv = document.getElementById('weather-info'); //ID「weather-info」の要素を取得
    const weatherIcon = document.getElementById('weather-icon'); //ID「weather-icon」の要素を取得
    const hourlyForecastDiv = document.getElementById('hourly-forecast'); //ID「hourly-forecast」の要素を取得

    // Clear previous content
    weatherInfoDiv.innerHTML = ''; //「weather-info」要素の内容をクリア
    hourlyForecastDiv.innerHTML = ''; //「hourly-forecast」要素の内容をクリア
    tempDivInfo.innerHTML = ''; //「temp-div」要素の内容をクリア

    if (data.cod === '404') { //応答コードが404(都市が見つからない)かどうかを確認します
        weatherInfoDiv.innerHTML = `<p>見つかりません</p>`; //エラーメッセージを表示する
    } else {
        const cityName = data.name;  //データから都市名を取得する
        const temperature = Math.round(data.main.temp - 273.15); //温度をケルビンから摂氏に変換します（ケルビンと摂氏は°Kと°Cです）
        const description = data.weather[0].description; //天気の説明を取得する
        const iconCode = data.weather[0].icon; //天気アイコンのコードを取得する
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; //天気アイコンのURLを構築する

        const temperatureHTML = ` 
            <p>${temperature}°C</p>
        `;    //温度を表示するためのHTMLを作成する             

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `; //都市名と天気の説明を表示するためのHTMLを作成する

        tempDivInfo.innerHTML = temperatureHTML; //「temp-div」要素を温度で更新します
        weatherInfoDiv.innerHTML = weatherHtml; //「weather-info」要素を都市名と説明で更新します
        weatherIcon.src = iconUrl; //天気アイコン画像の「src」属性を更新する
        weatherIcon.alt = description; //天気アイコン画像の「alt」属性を更新する

        showImage(); //「showImage」関数を呼び出して天気アイコンを表示します
        
    }
}

function displayHourlyForecast(hourlyData) { 
    const hourlyForecastDiv = document.getElementById('hourly-forecast'); //ID「hourly-forecast」の要素を取得する

    const next24Hours = hourlyData.slice(0, 8); //時間ごとのデータ配列(次の24時間を表す)から最初の8項目を取得します

    next24Hours.forEach(item => { //「next24Hours」配列内の各項目を反復処理します
        const dateTime = new Date(item.dt * 1000); //タイムスタンプをミリ秒に変換します
        const hour = dateTime.getHours(); //Dateオブジェクトから時間を取得する
        const temperature = Math.round(item.main.temp - 273.15); //温度をケルビンから摂氏に変換します
        const iconCode = item.weather[0].icon; //天気アイコンのコードを取得する
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; //天気アイコンのURLを構築する

        const dateHtml = `<p>${dateTime.toLocaleDateString()}</p>`; //日付を含める

        const hourlyItemHtml = ` 
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
                ${dateHtml}
            </div>
        `; //時間別予報項目を表示するHTMLを作成

        hourlyForecastDiv.innerHTML += hourlyItemHtml; //「hourly-forecast」項目をhourly-forecast要素に追加します
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; //ロードされた画像を表示します
}