import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // substitua por seu URL do servidor

socket.on('connect', () => {
  console.log('Conectado ao servidor WebSocket');
});

socket.on('progress', (data) => {
  console.log('Progresso recebido:', data);
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor WebSocket');
});
