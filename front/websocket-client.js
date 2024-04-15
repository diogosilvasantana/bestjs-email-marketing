const socket = new WebSocket('ws://localhost:3000'); // Endereço do servidor WebSocket

// Evento chamado quando a conexão WebSocket é aberta
socket.onopen = () => {
  console.log('Conexão WebSocket estabelecida.');
};

// Evento chamado quando uma mensagem é recebida do servidor WebSocket
socket.onmessage = (event) => {
  console.log('Mensagem recebida:', event.data);
};

// Evento chamado quando ocorre um erro na conexão WebSocket
socket.onerror = (error) => {
  console.error('Erro na conexão WebSocket:', error);
};

// Evento chamado quando a conexão WebSocket é fechada
socket.onclose = () => {
  console.log('Conexão WebSocket fechada.');
};
