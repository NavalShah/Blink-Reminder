chrome.storage.local.get(['screenTimeData'], (result) => {
    const screenTimeData = result.screenTimeData || {};
    const labels = [];
    const data = [];
  
    for (const tabId in screenTimeData) {
      labels.push(`Tab ${tabId}`);
      data.push(screenTimeData[tabId] / 1000 / 60); // Convert milliseconds to minutes
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
  