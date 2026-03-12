# Sorteador de Números 🎲

Projeto front-end de sorteio de números com interface moderna, validações de formulário e animação em cascata dos resultados.

## Sobre o projeto 

O aplicativo permite definir:
- Quantidade de números a sortear
- Valor inicial do intervalo
- Valor final do intervalo
- Se os números podem ou não se repetir

Depois do envio, os resultados aparecem em uma tela dedicada com animação sequencial dos cards.

## Funcionalidades implementadas ✅

- Sorteio de números dentro de intervalo customizado
- Controle de repetição por meio de switch (não repetir / permitir repetir)
- Validação completa dos campos antes do sorteio 
- Exibição de mensagens de erro para entradas inválidas
- Contador de rodada (1º resultado, 2º resultado, etc.)
- Animação dos números em sequência (efeito cascata) 🎬
- Bloqueio de ações enquanto a animação está em execução
- Botão de novo sorteio
- Botão de voltar para o formulário
- Reset de estado ao voltar para o formulário

## Regras de validação 

As seguintes regras estão aplicadas:

- Todos os campos devem ser números inteiros
- Quantidade mínima: 1
- Quantidade máxima por sorteio: 10
- Valor inicial não pode ser maior que o valor final
- Valor mínimo permitido: 0
- Valor máximo permitido: 999

## Regra de não repetição 

Quando a opção de não repetir está ativa:

- O sorteio evita números já usados em rodadas anteriores
- A lógica usa um conjunto em memória para armazenar os números utilizados
- Quando não há mais números disponíveis no intervalo, o botão de novo sorteio é desabilitado

## Animação dos resultados

Fluxo da animação:

1. Os cards são renderizados e suas posições finais são medidas
2. O container é travado em altura para evitar salto de layout
3. Cada card passa por etapas visuais (centro, fade, movimento)
4. A execução é sequencial com atraso entre cards (stagger)
5. Ao final, a tela volta para estado estático e interativo

## Estrutura do projeto 🗂️

```text
number-generator/
├── index.html
├── script.js
├── assets/
└── styles/
	├── generator.css
	├── global.css
	├── header.css
	├── index.css
	├── main.css
	├── questions.css
	└── title.css
```

- index.html: marcação da interface
- script.js: lógica de sorteio, validação, estado e animações
- assets/: imagens, ícones e recursos visuais
- styles/: estilos da aplicação organizados por seção/componente

## Tecnologias utilizadas 

- HTML5
- CSS3
- JavaScript (Vanilla)

## Como executar

1. Abra a pasta do projeto no VS Code
2. Abra o arquivo index.html no navegador

Opcional:
- Use a extensão Live Server para recarregamento automático durante o desenvolvimento

Observação: 
- Também é possível visualizar pelo link do deploy no GitHub Pages
