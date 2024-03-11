const username = localStorage.getItem('name')

if (!username) {
  window.location.replace('/')
  throw new Error('El nombre de usuario es obligatorio')
}

const statusOnline = document.querySelector('#status-online')
const statusOffline = document.querySelector('#status-offline')

const usersList = document.querySelector('ul')
const form = document.querySelector('form')
const input = document.querySelector('input')
const chat = document.querySelector('#chat')

const renderUsers = (users) => {
  usersList.innerHTML = ''
  users.forEach((user) => {
    const li = document.createElement('li')
    li.innerText = user.name
    usersList.appendChild(li)
  })
}

const renderMessages = (payload) => {
  const { userId, message, name } = payload
  const div = document.createElement('div')
  div.classList.add('message')
  if (userId !== socket.id) {
    div.classList.add('incoming')
  }
  div.innerHTML = message
  chat.appendChild(div)
  chat.scrollTop = chat.scrollHeight
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = input.value
  input.value = ''
  socket.emit('send-message', message)
})

const socket = io({
  auth: {
    token: 'token',
    name: username,
  },
})

socket.on('connect', () => {
  statusOnline.classList.remove('hidden')
  statusOffline.classList.add('hidden')
  console.log('Conectado')
})

socket.on('disconnect', () => {
  statusOnline.classList.add('hidden')
  statusOffline.classList.remove('hidden')
  console.log('Desconectado')
})

socket.on('on-client-changed', renderUsers)

socket.on('on-message', renderMessages)
