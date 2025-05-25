const API_KEY = "8BqBxCzQH23H6Cuvs5bbgpytqY58xP2t"; // Tomorrow.io のAPIキーに置き換えてください

document.getElementById("status").textContent = "位置情報を取得中...";

navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  document.getElementById("status").textContent = `現在地：緯度${lat.toFixed(3)}、経度${lon.toFixed(3)} の天気を確認中...`;

  const url = `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=precipitationIntensity&timesteps=1m&units=metric&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const timeline = data.data.timelines[0].intervals;
    const now = new Date();

    const nextRain = timeline.find(interval => interval.values.precipitationIntensity > 0);

    if (nextRain) {
      const rainTime = new Date(nextRain.startTime);
      const diffMin = Math.round((rainTime - now) / 60000);

      document.getElementById("result").textContent =
        diffMin <= 0
          ? "まもなく雨が降ります ☔️"
          : `あと ${diffMin} 分で雨が降ります ☔️`;
    } else {
      document.getElementById("result").textContent = "しばらく雨の予報はありません ☀️";
    }
  } catch (error) {
    console.error("エラー:", error);
    document.getElementById("result").textContent = "天気情報の取得に失敗しました。";
  }
}, () => {
  document.getElementById("status").textContent = "位置情報の取得に失敗しました。";
});
// 1. 位置情報を取得
navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // 2. 逆ジオコーディングして住所取得
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  const data = await response.json();

  // 3. 表示（例：div#locationに表示）
  const locationElement = document.getElementById('location');
  if (data.address) {
    const { state, city, town, village } = data.address;
    const address = `${state || ''} ${city || town || village || ''}`;
    locationElement.textContent = `📍 あなたの現在地：${address}`;
  } else {
    locationElement.textContent = '📍 現在地を特定できませんでした';
  }
});

