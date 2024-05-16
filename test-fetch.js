function start() {
  const btnGetData = document.getElementById('btn_get_data');
  btnGetData.onclick = getPageViewsForTopic;
} //end start

function getPageViewsForTopic() {
  let searchTerm = document.getElementById('search_term').value;
  let outputList = document.getElementById('output');

  const startDateInput = document.getElementById('start_date');
  const endDateInput = document.getElementById('final_date');

  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (startDate == '' || endDate == '') {
    alert('Please enter start and end dates');
    return;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    alert('Please enter dates in the format YYYY-MM-DD');
    return;
  }

  if (startDate > endDate) {
    alert('Start date must be before end date');
    return;
  }

  // Convert start date to number
  const startDateNumber = startDate.split('-').join('');

  // Convert end date to number
  const endDateNumber = endDate.split('-').join('');

  let viewTotal = 0;

  outputList.innerHTML =
    '<h2 class="title">Results for ' + searchTerm + '</h2>';

  searchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);

  fetch(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${searchTerm}/daily/${startDateNumber}/${endDateNumber}`
  )
    .then((response) => response.json())
    .then((data) => {
      const dataArray = data.items;
      dataArray.forEach((dayData) => {
        const dateData = dayData.timestamp;
        const year = dateData.slice(0, 4); // e.g., 2023
        const month = dateData.slice(4, 6); // e.g., 09
        const day = dateData.slice(6, 8); // e.g., 01
        const dateString = `${year} - ${month} - ${day}`;

        // display the data
        outputList.innerHTML += `<li>${dateString}: <span class="total-views"> ${dayData.views} </span> views</li>`;

        viewTotal += parseInt(dayData.views);
      });

      outputList.innerHTML += `<li class="total">Total views: ${viewTotal}</li>`;
    });
}

function clearOutput() {
  const outputList = document.getElementById('output');
  outputList.innerHTML = '';
}

window.onload = start;
