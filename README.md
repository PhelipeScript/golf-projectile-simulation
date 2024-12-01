# Golf Projectile Simulation 🏌️‍♂️🔬

## Descrição do Projeto

Este projeto é uma simulação física de um lançamento de golfe que modela o movimento de um projétil considerando arrasto aerodinâmico. Desenvolvido como parte do curso de Bacharelado em Ciência da Computação, o objetivo é demonstrar a aplicação prática de conceitos físicos de lançamento de projéteis.

## 🧮 Conceitos Físicos Aplicados

A simulação implementa um modelo físico baseado em:
- Lançamento de projétil com resistência do ar
- Cálculo de trajetória considerando:
  - Velocidade inicial
  - Ângulo de lançamento
  - Massa do projétil
  - Diâmetro do projétil
  - Aceleração gravitacional
- Modelo de arrasto aerodinâmico

## 🚀 Funcionalidades

- Simulação interativa de lançamento de projétil
- Configurações ajustáveis:
  - Ângulo de lançamento
  - Massa do projétil
  - Diâmetro do projétil
  - Gravidade
  - Velocidade inicial
- Visualização da trajetória
- Cálculo de:
  - Altura máxima
  - Distância total percorrida
- Animação com rastreamento da bola
- Detecção de colisão com alvo

## 🛠 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Canvas API para renderização gráfica

## 📝 Detalhes da Implementação Física

### Equações Principais
- Velocidade horizontal: `v_x = v_zero * cos(θ)`
- Velocidade vertical: `v_y = v_zero * sin(θ)`
- Força de arrasto: `F_a = 0.5 * ρ * v² * A * C_a`

### Parâmetros Físicos
- Densidade do ar (ρ): 1.225 kg/m³
- Coeficiente de arrasto (C_a): 0.8

## 🎮 Como Usar

1. Ajuste os parâmetros de lançamento usando os controles
2. Clique em "Lançar" para iniciar a simulação
3. Observe a trajetória da bola
4. Verifique métricas como altura máxima e distância

## 👨‍💻 Autor

Phelipe Pereira
Estudante de Bacharelado em Ciência da Computação

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
