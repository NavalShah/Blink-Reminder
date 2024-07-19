document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['screenTimeData'], (result) => {
    const screenTimeData = result.screenTimeData || {};
    const labels = [];
    const data = [];

    for (const tabId in screenTimeData) {
      const tabInfo = screenTimeData[tabId];
      labels.push(tabInfo.title || `Tab ${tabId}`);
      data.push(tabInfo.time / 1000 / 60); // Convert milliseconds to minutes
    }

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Screen Time (minutes)',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  });
});
