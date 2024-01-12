// index.html에 정의된 태그들을 불러옴
const list = document.getElementById('list');
const createBtn = document.getElementById("create-btn");

// 투두 데이터를 일시적으로 저장하기 위해서 배열이 필요하다.
let todos = [];

createBtn.addEventListener("click", createNewTodo);

// 버튼을 클릭하였을 때, 생성되는 것은 하나의 객체이다.
function createNewTodo(){
    
    const item = {
        id: new Date().getTime(),
        text: '',
        complete: false
    };

    // 배열 처음에 새로운 아이템을 추가
    todos.unshift(item);

    // 요소 생성하기
    const {itemEl, inputEl, editBtnEl, removeBtnEl} = createTodoElement(item);

    list.prepend(itemEl);

    inputEl.removeAttribute('disabled');
    inputEl.focus();
    saveToLocalStorage();
}

function createTodoElement(item){
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');

    const checkBoxEl = document.createElement('input');
    checkBoxEl.type = 'checkBox';
    checkBoxEl.checked = item.complete

    // 새로고침을 하여 아이템을 다시 불러 들여있을 떄, item의 complete의 상태를 보고, true이면 complete 클래스 추가
    if(item.complete){
        itemEl.classList.add('complete');
    }

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled','');

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons')
    editBtnEl.innerText = 'edit';

    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add("material-icons","remove-btn");
    removeBtnEl.innerText = 'remove_circles';

    // input 적은 데이터를 불러오기 위해 item의 텍스트에도 적어놓음
    inputEl.addEventListener('input', () =>{
        item.text = inputEl.value;
    })

    checkBoxEl.addEventListener('change',()=>{
        item.complete = checkBoxEl.checked;

        if(item.complete){
            itemEl.classList.add('complete');
        }else{
            itemEl.classList.remove('complete');
        }
        saveToLocalStorage();
    })

    //item 태그에서 focus가 사라지면 input 태그에 disabled가 생성되게 바뀜
    inputEl.addEventListener('blur', ()=>{
        inputEl.setAttribute('disabled',"");
        saveToLocalStorage();
    })

    // edit 버튼을 눌렀을 떄, input 태그에 있는 것을 수정
    editBtnEl.addEventListener('click',()=>{
        inputEl.removeAttribute('disabled');
        inputEl.focus();
    })

    // remove 버튼을 눌렀을 때, remove 버튼이 들어간 Item태그를 삭제
    removeBtnEl.addEventListener('click', ()=>{
        todos = todos.filter(t => t.id !== item.id)
        itemEl.remove();
        saveToLocalStorage();
    })

    itemEl.append(checkBoxEl);
    itemEl.append(inputEl);
    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);
    itemEl.append(actionsEl);

    return {itemEl, inputEl, editBtnEl, removeBtnEl};
}

function saveToLocalStorage(){
    // 데이터를 로컬 스토리지에 저장하기 위해서는 항상 String 타입으로 저장해야 한다.
    // 배열로 된 todos를 JSON.stringify()를 통해 저장해야 한다.
    const data = JSON.stringify(todos);

    // window 부분은 생략할 수 있다.
    window.localStorage.setItem('my_todos',data);
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('my_todos');

    if(data){
        todos = JSON.parse(data);
    }
}


function displayTodos(){
    loadFromLocalStorage();
    for(let i = 0; i < todos.length; i++){
        const item = todos[i];
        const {itemEl} = createTodoElement(item);

        list.append(itemEl);
    }
}

displayTodos();