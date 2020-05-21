document.addEventListener('DOMContentLoaded', function(){
    'use strict';
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    const modalTitle = document.querySelector('.modal-title');

    const firebaseConfig = {
        apiKey: "AIzaSyAtFMI9ZbtLDabYmXVjKBJ9e7pYHZXfjFM",
        authDomain: "testburger-deea1.firebaseapp.com",
        databaseURL: "https://testburger-deea1.firebaseio.com",
        projectId: "testburger-deea1",
        storageBucket: "testburger-deea1.appspot.com",
        messagingSenderId: "1052887784448",
        appId: "1:1052887784448:web:65a5bc42a7df098077cce5",
        measurementId: "G-L3B73FTLTM"
    };
      // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const getData = () => {
        formAnswers.textContent = 'LOAD';
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        firebase.database().ref().child('questions').once('value')
        .then(snap => playTest(snap.val()))
    };

    btnOpenModal.addEventListener('click',  () => {
        modalBlock.classList.add('d-block');
        getData();
    });
    closeModal.addEventListener('click', ()=>{
        modalBlock.classList.remove('d-block');
    });

    const playTest = (questions) => {
        const finalAnswers = [];
        const obj = {};
        let numberQuestion = 0;

        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer)=>{
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML= `
                    <input type="${ questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span class="answerName">${answer.title}</span> 
                    </label>  
                `;
                formAnswers.appendChild(answerItem);
            });
        };

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
            switch(true){
                case numberQuestion >= 0 && numberQuestion <= questions.length - 1:
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    nextButton.classList.remove('d-none');
                    prevButton.classList.remove('d-none');
                    sendButton.classList.add('d-none');
                break;
                case numberQuestion === 0:
                    prevButton.classList.add('d-none');
                break;
                case numberQuestion === questions.length:
                    questionTitle.textContent = '';
                    modalTitle.textContent= '';
                    nextButton.classList.add('d-none');
                    prevButton.classList.add('d-none');
                    sendButton.classList.remove('d-none');
                    formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Введите ваш номер телефона</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                    
                    `;
                break;
                case numberQuestion === questions.length + 1:
                    formAnswers.textContent = 'Спасибо за тест!';

                    for(let key in obj){
                        let newObj = {};
                        newObj[key]= obj[key];
                        finalAnswers.push(newObj);
                    }
    
                    setTimeout(()=>{
                        modalBlock.classList.remove('d-block');
                    }, 2000);
                break;
            };
        };
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            
            const inputs = [...formAnswers.elements].filter((input)=> input.checked || input.id === 'numberPhone');
            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1){
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                };
                if(numberQuestion === questions.length){
                    obj['Номер телефона'] = input.value;
                }
            });
        };


        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        };
    
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        };

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
                .database()
                .ref()
                .child('contacts')
                .push(finalAnswers); 
        }
    };


});

