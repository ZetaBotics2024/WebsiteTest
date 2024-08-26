/*
This code is mostly for interfacing with The Blue Alliance
*/

const BASEURL = "https://www.thebluealliance.com/api/v3/"

const APIKEY = "uh1nEYCNUE8NrMuVCE1smKf6QRDhNS0GLbbDTYiSDHFLUIYPWOlgUWf4NjmxUEHK" // I know it's nasty but I don't think there's another way without running a proxy server (not happening)

const TEAMKEY = "frc7826"

const EVENTS = document.getElementById("events");

SYMBOLS = {
    "award": "🏆"
}

// Death to jQuery!
async function getJSONFromPath(path) {
    result = await fetch(BASEURL + path, {
        headers: {
            "X-TBA-Auth-Key": APIKEY
        }
    });
    json = result.json();
    return json;
}

async function createYearHeader(year) {
    let header = document.createElement("div");
    header.classList.add("year-header");

    let year_header = document.createElement("h3");
    year_header.innerText = year;
    header.appendChild(year_header);

    let header_content = document.createElement("div");
    header.appendChild(header_content);

    EVENTS.appendChild(header);
    return header_content;
}

async function createEventHeader(year_header, name, event_key) {
    let header = document.createElement("div");
    header.classList.add("event-header");

    let event_header = document.createElement("h4");
    event_header.innerText = name;
    header.appendChild(event_header);

    let award_data = await getJSONFromPath("team/" + TEAMKEY + "/event/" + event_key + "/awards")
    if (award_data.length != 0) {
        let award_header = document.createElement("div");
        award_header.classList.add("awards");

        for (let i = 0; i < award_data.length; i++) {
            let award = document.createElement("div");
            award.classList.add("award");
            award.innerText = SYMBOLS.award + " " + award_data[i].name;
            award_header.appendChild(award);
        }

        header.appendChild(award_header);
    }

    year_header.appendChild(header);
}

async function updateStats() {

    event_headers = {}

    event_list = await getJSONFromPath("team/" + TEAMKEY + "/events");
    event_list.reverse();
    for (let i = 0; i < event_list.length; i++) {
        e = event_list[i];
        console.log(e);
        event_year = e.start_date.split("-")[0]
        if (!(event_year in event_headers)) {
            event_headers[event_year] = await createYearHeader(event_year);
        }
        header = event_headers[event_year];
        createEventHeader(header, e.name, e.key)
    }

    let link = document.createElement("a");
    link.classList.add("tba-backlink");
    link.innerText = "Powered by The Blue Alliance";
    link.href = "https://thebluealliance.com/"
    EVENTS.appendChild(link)
}

updateStats();