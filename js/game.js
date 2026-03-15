async function dayCycle(day) {
    let emails = await fetch('campaign.json');
    emails = await emails.json();
    today = day;

    let todayEmail = emails[day];
    console.log(todayEmail)
    if (todayEmail["govt"]) {
        todayEmail["govt"].forEach((mail, i) => appendEmail(mail, i));
    }

    let otherEmails = Object.keys(todayEmail).filter(item => item != "govt" && item != "rebel");
    otherEmails.forEach(topic => todayEmail[topic].forEach((item, i) => appendEmail(item, i, topic)));
}

function appendEmail(email, index, topic = false) {
    let emailsLeft = document.getElementById("emailsLeft");
    let emailReader = document.getElementById("emailReader");

    let emailItem = document.createElement("div");
    emailItem.innerHTML = `
        <b>${email.title}</b><br>
        ${email.writerName}<br>
        <i>${email.writer}</i><br>
    `
    emailItem.onclick = () => {
        emailReader.innerHTML = `
            <b>
                Title: ${email.title}<br>
                Writer: ${email.writerName}<br>
                Address: ${email.writer}
            </b><br><br>
        `

        let openInSauron = document.createElement("button");
        openInSauron.innerText = "Open in Sauron";
        openInSauron.classList.add("openSauron");
        emailReader.appendChild(openInSauron);
        openInSauron.onclick = () => {
            sauronAnalysis(email, topic, index);
        };

        email.content.forEach(element => {
            let text = document.createElement("span");
            text.innerText = element.text;

            emailReader.appendChild(text)
        });
    }

    newNotification(`You got Mail - ${email.writer}`)
    emailsLeft.appendChild(emailItem);
}

var sauronResults = {}
function sauronAnalysis(email, topic, index) {
    let sauronLeft = document.getElementById("sauronLeft");
    let sauronRight = document.getElementById("sauronRight");
    toggleWindowVisibility('sauron', true);

    sauronRight.innerHTML = `
        <b>
            Title: ${email.title}<br>
            Writer: ${email.writerName}<br>
            Address: ${email.writer}
        </b><br><br>
    `

    email.content = email.content.filter(item => item.effect);
    email.content.forEach((element, i) => {
        let text = document.createElement("span");
        text.innerText = element.text;
        text.classList.add("sauronText");
        text.onclick = () => {
            if (text.style.backgroundColor != "black") {
                document.querySelectorAll('.sauronText').forEach(element => {
                    element.style.backgroundColor = "transparent";
                    element.style.color = "black";
                    sauronAnalyze(true, text.textContent, topic, index, i, email, text);
                });

                text.style.backgroundColor = "black";
                text.style.color = "white";
            } else {
                text.style.backgroundColor = "transparent";
                text.style.color = "black";
                sauronAnalyze(false);
            }
        };

        if (!sauronResults[topic]) {
            sauronResults[topic] = {};
            let topicElem = document.createElement("div");
            topicElem.innerHTML = `${topic}<br>&nbsp;Analysed: 0<br>`;
            topicElem.id = `topic-${topic}`;
            topicElem.className = 'topic';

            document.getElementById("sidebar").appendChild(topicElem)
        }

        sauronResults[topic][index] ??= {};
        sauronResults[topic][index][i] ??= {};
        sauronResults[topic][index][i]["govt"] = 0;
        sauronResults[topic][index][i]["civ"] = 0;
        sauronResults[topic][index][i]["bur"] = 0;
        sauronResults[topic][index][i]["rebel"] = 0;
        sauronRight.appendChild(text);
    });

    if (email.content.length == 0) {
        let text = document.createElement("span");
        text.innerText = "Nothing to analyze here!";
        sauronRight.appendChild(text);
    }

    sauronLeft.innerHTML = `
        <b>
            Sauron Analysis<br><br>
        </b>
        <p>Select a sentence to analyze.</p>
    `

    function sauronAnalyze(select, text, topic, index, i, email, textEl) {
        if (select == true) {
            sauronLeft.innerHTML = `
                <b>
                    Sauron Analysis<br><br>
                </b>
                <i>"${text}"</i><br><br>
                <b>Final Verdict: </b><br>
            `
            let yes = document.createElement("button");
            yes.textContent = "True";
            yes.onclick = () => {
                sauronResults[topic][index][i]["govt"] = email.content[i].effect.true[0];
                sauronResults[topic][index][i]["civ"] = email.content[i].effect.true[1];
                sauronResults[topic][index][i]["bur"] = email.content[i].effect.true[2];
                sauronResults[topic][index][i]["rebel"] = email.content[i].effect.true[3];
                textEl.id = "yes";
                document.getElementById(`topic-${topic}`).innerHTML = `${topic}<br>&nbsp;Analysed: ${Object.keys(sauronResults[topic]).length}<br>`;
            };

            let no = document.createElement("button");
            no.textContent = "False"
            no.onclick = () => {
                sauronResults[topic][index][i]["govt"] = email.content[i].effect.false[0];
                sauronResults[topic][index][i]["civ"] = email.content[i].effect.false[1];
                sauronResults[topic][index][i]["bur"] = email.content[i].effect.false[2];
                sauronResults[topic][index][i]["rebel"] = email.content[i].effect.false[3];
                textEl.id = "no";
                document.getElementById(`topic-${topic}`).innerHTML = `${topic}<br>&nbsp;Analysed: ${Object.keys(sauronResults[topic]).length}<br>`;
            };

            let undecided = document.createElement("button");
            undecided.textContent = "Undecided";
            undecided.onclick = () => {
                sauronResults[topic][index][i]["govt"] = 0;
                sauronResults[topic][index][i]["civ"] = 0;
                sauronResults[topic][index][i]["bur"] = 0;
                sauronResults[topic][index][i]["rebel"] = 0;
                textEl.id = "undecided";
                document.getElementById(`topic-${topic}`).innerHTML = `${topic}<br>&nbsp;Analysed: ${Object.keys(sauronResults[topic]).length}<br>`;
            };

            sauronLeft.appendChild(yes);
            sauronLeft.appendChild(no);
            sauronLeft.appendChild(undecided);
        } else {
            sauronLeft.innerHTML = `
                <b>
                    Sauron Analysis<br><br>
                </b>
                <p>Select a sentence to analyze.</p>
            `;
        }
    }
}

function clockOut() {
    const topicTotals = {};
    const grandTotals = {
        govt: 0,
        civ: 0,
        bur: 0,
        rebel: 0
    };

    for (const topic in sauronResults) {
        topicTotals[topic] = {
            govt: 0,
            civ: 0,
            bur: 0,
            rebel: 0
        };

        for (const index in sauronResults[topic]) {
            for (const i in sauronResults[topic][index]) {
                const entry = sauronResults[topic][index][i];

                topicTotals[topic].govt += entry.govt || 0;
                topicTotals[topic].civ += entry.civ || 0;
                topicTotals[topic].bur += entry.bur || 0;
                topicTotals[topic].rebel += entry.rebel || 0;
            }
        }

        grandTotals.govt += topicTotals[topic].govt;
        grandTotals.civ += topicTotals[topic].civ;
        grandTotals.bur += topicTotals[topic].bur;
        grandTotals.rebel += topicTotals[topic].rebel;
    }

    document.getElementById("outro").style.display = 'flex';
    document.getElementById("government").style.width = '50%';
    document.getElementById("civilian").style.width = '50%';
    document.getElementById("bureaucrats").style.width = '50%';
    document.getElementById("rebels").style.width = '50%';

    setTimeout(() => {
        document.getElementById("government").style.width = `${(5 + grandTotals.govt) * 10}%`;
        document.getElementById("civilian").style.width = `${(5 + grandTotals.civ) * 10}%`;
        document.getElementById("bureaucrats").style.width = `${(5 + grandTotals.bur) * 10}%`;
        document.getElementById("rebels").style.width = `${(5 + grandTotals.rebel) * 10}%`;
    }, 1000);

    let allSaves = JSON.parse(localStorage.getItem('saveData')) || [];
    allSaves.push(JSON.stringify({ "grandTotals": grandTotals, "day": today }, null, 2));
    localStorage.setItem('saveData', JSON.stringify(allSaves));
}