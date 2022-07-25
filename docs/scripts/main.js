var DateTime = luxon.DateTime;
const sortedRegions = [
    'Northland',
    'Auckland',
    'Waikato',
    'Bay of Plenty',
    'Lakes',
    "Hawke's Bay",
    'MidCentral',
    'Whanganui',
    'Taranaki',
    'Tairawhiti',
    'Wairarapa',
    'Capital and Coast/Hutt',
    'Nelson Marlborough',
    'Canterbury/West Coast',
    'South Canterbury',
    'Southern',
    'Unknown',
];

window.onload = function() {
    let today = DateTime.now().toISODate();
    let dateEl = document.querySelector('#date');
    dateEl.value = today;
    dateEl.max = today;
    dateUpdated();
}

function dateUpdated() {
    let dateEl = document.querySelector('#date');
    let newDate = dateEl.value;
    document.querySelector('#prev').disabled = newDate === dateEl.min;
    document.querySelector('#next').disabled = newDate === dateEl.max;
    if (newDate !== "") {
        let yesterday = DateTime.fromISO(newDate).minus({days: 1});
        let path = yesterday.toFormat("'data'/yyyy/MM/yyyy-MM-dd.'json'");
        fetch(path).then(resp => {
            resp.json().then(data => {
                let stats = sortedRegions.reduce((regions, region) => {
                    let label = region;
                    let count = data[region];
                    switch (region) {
                        case 'Tairawhiti':
                            label = 'Tair&amacr;whiti';
                            break;

                        case 'Auckland':
                            if (data.hasOwnProperty('Counties Manukau')) {
                                count += data['Counties Manukau'];
                            }
                            if (data.hasOwnProperty('Waitemata')) {
                                count += data['Waitemata'];
                            }
                            break;
                        
                        case 'Capital and Coast/Hutt':
                            label = 'Capital and Coast &amp; Hutt Valley';
                            break;

                        case 'Canterbury/West Coast':
                            label = 'Canterbury &amp; West Coast';
                            break;
                    }
                    if (data.hasOwnProperty(region)) {
                        regions.push(`${label} (${count})`);
                    }
                    return regions;
                }, []);
                document.querySelector('#stats').innerHTML = stats.join(', ');
            }).catch(() => {
                document.querySelector('#stats').innerHTML = 'No data available for the selected date.';
            });
        })
    }
}

function setDate(newDate) {
    document.querySelector('#date').value = newDate;
    dateUpdated();
}
function prev() {
    setDate(DateTime.fromISO(document.querySelector('#date').value).minus({days: 1}).toISODate());
}
function next() {
    setDate(DateTime.fromISO(document.querySelector('#date').value).plus({days: 1}).toISODate());
}