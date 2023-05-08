function start() {
    handleModal();
    handleField();
    // render();
}

start();

function getData(callback) {
    fetch('http://localhost:3000/user')
    .then(response => response.json())
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
            document.getElementById(field.getAttribute('field-name') + '-modal')
            .classList.remove('hidden');
        }

    })
}

function handleModal() {
    let modals = document.querySelectorAll('.modal-viewer');
    modals.forEach((modal) => {
        modal.onclick = (e) => {
            e.stopPropagation();
            modal.classList.add('hidden');
        }
        modal.querySelector('.modal-container').onclick = (e) => {
            e.stopPropagation();
        }
        modal.querySelector('i').onclick = () => {
            modal.classList.add('hidden');
        }
        modal.querySelector('button').onclick = () => {
            modal.classList.add('hidden');
            // modal.querySelector('form').
        }
    })
}



// function render() {
//     getData((data) => {
//         data = data[0];
//         renderTextField(data);
//         renderTemplatedField(data);
//     })
// }

function renderTextField(data) {
    let fields = document.querySelectorAll('.text-field');

    fields.forEach(field => {
        field.querySelector('p').innerText = data[field.getAttribute('field-name')];
    })
}


// function renderTemplatedField(data) {
//     let fields = document.querySelectorAll('.templated-field');

//     fields.forEach(field => {
//         let fieldName = field.getAttribute('field-name');
//         let visibleInfo = [];
//         let htmls = '';

//         data[fieldName].forEach((data) => {
//             let info = [];
            
//             if (fieldName === 'education') {
//                 info[0] = data.education.school;
//                 info[1] = data.education.degree + ', ' + data.education.field;
//                 info[2] = data.education['start-month'] + '/' + data.education['start-year']
//                 info[3] = data.education['end-month'] + '/' + data.education['end-year']
//             }

//             visibleInfo.append(info);
//         })


//         htmls +=
//         `<div class="field-item d-flex py-4">
//             <div class="field-item-logo d-flex align-items-start justify-content-center">
//                 <img class="w-80" src="/assets/img/logoBK.png" alt="">
//             </div>
//             <div class="field-item-text">
//                 <p class="line h6">Ho Chi Minh City University of Technology</p>
//                 <p class="line">Bachelor's degree, Computer Science</p>
//                 <p class="line">Oct 2020 - Nov 2024</p>
//             </div>
//         </div>`

//         field.querySelector('.field-content').innerHTML = htmls;
//     })
// }