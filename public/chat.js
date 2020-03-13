const socket = io.connect('http://localhost:3000')

const message = document.querySelector('#message')
const sender = document.querySelector('#sender')
const btn = document.querySelector('#send')
const output = document.querySelector('#output')
const feedback = document.querySelector('#feedback')

btn.addEventListener('click', () => {
  socket.emit('chatMessage', {
    message: message.value,
    sender: sender.value
  })
})

message.addEventListener('keypress', () => {
  socket.emit('typing', sender.value)
})

socket.on('chatMessage', data => {
  feedback.innerHTML = ''
  message.value = ''
  output.innerHTML +=
    '<p><strong>' + data.sender + ':</strong>' + data.message + '</p>'
})

socket.on('typing', data => {
  feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>'
})
