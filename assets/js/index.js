function start() {
    getCv((data) => {
        render(data)
        handleField();
        handleModal(data);
    });
}

start();

//TEMP PARAMETERS
let USER_ID = 0;
const hostApi = 'http://localhost:3000';

function getCv(callback) {
    const userApi = 'http://localhost:3000/user';
    const cvApi = 'http://localhost:3000/cv';
    const eduApi = 'http://localhost:3000/education';
    const certApi = 'http://localhost:3000/certificate';
    const expApi = 'http://localhost:3000/experience';
    const refApi = 'http://localhost:3000/reference';

    Promise.all([fetch(userApi), fetch(cvApi), fetch(eduApi), fetch(certApi), fetch(expApi), fetch(refApi)])
    .then((responses) => Promise.all(responses.map(response => response.json())))
    .then((datas) => {
        let user = datas[0].filter(datas => datas.id === USER_ID)[0];
        let cv = datas[1].filter(datas => datas.id === user['cv-id'])[0];
        let educations = datas[2].filter(datas => cv['education-id'].includes(datas.id))
        let certificates = datas[3].filter(datas => cv['certificate-id'].includes(datas.id))
        let experiences = datas[4].filter(datas => cv['experience-id'].includes(datas.id))
        let references = datas[5].filter(datas => cv['reference-id'].includes(datas.id))

        return Promise.resolve({
            'user': user,
            'cv': cv,
            'education': educations,
            'certificate': certificates,
            'experience': experiences,
            'reference': references
        })
    })
    .then(callback)
}

function postField(fieldName, cvData, fieldData, callback) {
    fetch(hostApi + '/' + fieldName, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(fieldData)
    })
    .then(response => response.json())
    .then((responseData) => {
        cvData[fieldName + '-id'].push(responseData.id);
        return fetch(hostApi + '/cv' + '/' + cvData.id, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(cvData)
        })
    })
    .then(callback)
}


function handleField() {
    
    // HANDLE FIELDS REQUIRE DIRECT TEXT INPUT
    document.querySelectorAll('.text-field')
    .forEach((field) => {

        // EDIT BUTTON
        field.querySelector('i').onclick = () => {
            field.querySelector('textarea').value = field.querySelector('p').innerText;

            field.querySelector('.field-input').classList.remove('hidden');
            field.querySelector('p').classList.add('hidden');
        }

        // SAVE BUTTON
        field.querySelector('button').onclick = () => {
            field.querySelector('p').innerText = field.querySelector('textarea').value;

            field.querySelector('.field-input').classList.add('hidden');
            field.querySelector('p').classList.remove('hidden');
        }
    })
    
    // HANDLE FIELDS REQUIRE TEMPLATED INPUT
    document.querySelectorAll('.templated-field')
    .forEach((field) => {

        // ADD BUTTON
        field.querySelector('i').onclick = () => {
            let modal = document.getElementById(field.getAttribute('field-name'));
            modal.classList.remove('hidden');
            
            let modalForm = modal.querySelector('form')
            for (let index in modalForm) {
                if (modalForm.hasOwnProperty(index)) {
                    modalForm[index].value = '';
                }
            }
        }
    })
}

function handleModal(data) {
    let modals = document.querySelectorAll('.modal-view');
    modals.forEach((modal) => {
        modal.onclick = (e) => {
            modal.classList.add('hidden');
        }
        modal.querySelector('.modal-container').onclick = (e) => {
            e.stopPropagation();
        }
        modal.querySelector('i').onclick = () => {
            console.log('hi');
            modal.classList.add('hidden');
        }
        modal.querySelector('button').onclick = () => {
            modal.classList.add('hidden');
            
            let modalForm = modal.querySelector('form')
            let fieldData = {}
            for (let index in modalForm) {
                if (modalForm.hasOwnProperty(index)) {
                    fieldData[modalForm[index].name] = modalForm[index].value
                }
            }
            postField(modal.getAttribute('id'), data.cv, fieldData, () => {getCv(render)})
        }
    })
}



function render(data) {
    renderTextField(data);
    renderTemplatedField(data);
}

function renderTextField(data) {
    let fields = document.querySelectorAll('.text-field');

    fields.forEach(field => {
        field.querySelector('p').innerText = data.cv[field.getAttribute('field-name')];
    })
}


function renderTemplatedField(data) {
    let fields = document.querySelectorAll('.templated-field');

    fields.forEach(field => {
        let fieldName = field.getAttribute('field-name');
        let htmls = '';
        data[fieldName].forEach((fieldData) => {
            let info = [];
            if (fieldName === 'education') {
                info.push(fieldData.school);
                info.push(fieldData.degree + ', ' + fieldData.field);
                info.push(fieldData['start-month'] + '/' + fieldData['start-year'] + ' - ' + fieldData['end-month'] + '/' + fieldData['end-year']);
            }
            else if (fieldName === 'certificate') {
                info.push(fieldData.name);
                info.push(fieldData.organization);
                info.push('Issued ' + fieldData['issue-month'] + '/' + fieldData['issue-year']);
            }
            else if (fieldName === 'experience') {
                info.push(fieldData.position);
                info.push(fieldData.company);
                info.push(fieldData['start-month'] + '/' + fieldData['start-year'] + ' - ' + fieldData['end-month'] + '/' + fieldData['end-year']);
            }
            else if (fieldName === 'reference') {
                info.push(fieldData.name);
                info.push(fieldData.phone);
                info.push(fieldData.email);
            }

            htmls += 
            `<div class="field-item d-flex py-4">
                <div class="field-item-logo d-flex align-items-start justify-content-center">
                    <img class="w-80" src="/assets/img/logoBK.png" alt="">
                </div>
                <div class="field-item-text">
                    <p class="line h6">${info[0]}</p>
                    <p class="line">${info[1]}</p>
                    <p class="line">${info[2]}</p>
                </div>
            </div>`
        })

        field.querySelector('.field-content').innerHTML = htmls;
    })
}