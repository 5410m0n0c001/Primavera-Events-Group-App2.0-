
fetch('http://72.62.129.94:8090/api/analytics/dashboard')
    .then(res => res.text())
    .then(body => console.log('RESPONSE BODY:', body))
    .catch(err => console.error('ERROR:', err));
