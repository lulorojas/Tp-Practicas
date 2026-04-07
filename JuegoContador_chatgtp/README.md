# 🎮 JuegoContador

JuegoContador es una aplicación web interactiva construida con React, TypeScript y CSS puro. El objetivo es hacer la mayor cantidad de clics posibles en 5 segundos.

## Características

- **Cuenta regresiva visual**: "Preparados" → "Listos" → "¡YA!" antes de cada ronda.
- **Temporizador de 5 segundos**: Barra de progreso y cronómetro en tiempo real.
- **Puntaje Máximo persistente**: Se actualiza automáticamente cuando el jugador supera su récord.
- **Animaciones**: Efecto de pulso en la cuenta regresiva, efecto de brillo en el botón activo y escala al hacer clic.
- **Diseño moderno**: Estilo glassmorphism con gradientes y sombras.

## Tecnologías

- React 17 con Componentes Funcionales
- Hooks: `useState`, `useEffect`, `useRef`, `useCallback`
- TypeScript
- CSS puro (inline styles)

## Project Structure

```
JuegoContador_chatgtp
├── public
│   └── index.html
├── src
│   ├── components
│   │   └── Counter.tsx
│   ├── hooks
│   │   └── useCounter.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd JuegoContador_chatgtp
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Click the "Start Game" button to begin the countdown.
- Click the "Score" button as many times as you can before the timer runs out.
- Your final score will be displayed at the end of the countdown.

## License

This project is open-source and available under the MIT License.