const socket = io();

//coletando dados
let username = '';
let userList = []

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

//inplementando logica
loginPage.style.display = 'flex';
chatPage.style.display = 'none';

function renderUserList(){
    let ul = document.querySelector('.userList');
    ul.innerHTML = '';

    userList.forEach( i =>{
        ul.innerHTML += '<li>'+ i +'</li>';
    });
}

function addMensage(type,user,msg)
{
    let ul = document.querySelector('.chatList');

    switch(type){
        case 'status':
            ul.innerHTML += '<li class="m-status">'+ msg +'</li>';
        break;
        case 'msg':
            if(username === user)
            {
                ul.innerHTML += '<li class="m-txt"><span class="me">'+ user +':</span> '+ msg +'</li>';

            }else{
                ul.innerHTML += '<li class="m-txt"><span>'+ user +':</span> '+ msg +'</li>';
            }
        break;
    }
    ul.scrollTop = ul.scrollHeight ;

}

loginInput.addEventListener('keyup',(e)=> {
    if(e.keyCode === 13){
        let name = loginInput.value.trim();
        if(name != '')
        {
            username = name;
            document.title = 'User:('+username+')';
            socket.emit('join-request',username);
        }
    } 
});

textInput.addEventListener('keyup',(e)=>{
    if(e.keyCode === 13)
    {
        let txt = textInput.value.trim();
        textInput.value = '';

        if(txt != '')
        {
            addMensage('msg', username , txt);
            socket.emit('send-msg', txt)
        }
    }
})

socket.on('user-ok',(list)=>{
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    textInput.focus()

    addMensage('status',null,'conectado!')

    userList = list ;

    renderUserList();

})

socket.on('list-update',(data)=>{

    if(data.joined)
    {
        addMensage('status',null,data.joined + ' entrou no chat.')
    }
    if(data.left)
    {
        addMensage('status',null,data.left + ' saiu no chat.')
    }
    userList = data.list;
    renderUserList();

});

socket.on('show-msg',(data)=>
{
    addMensage('msg', data.username , data.message)
})

socket.on('connect',()=>{
    addMensage('status',null,'você foi desconectado!')
    userList = [];
    renderUserList();
})

socket.on('connect_error',()=>{
    addMensage('status',null,'tentando reconectar...')
})

socket.on('connect',()=>{
    addMensage('status',null,'reconectado!');
    if(username != ''){
        socket.emit('join_request',username)
    }
})