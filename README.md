# Sorteadores de Números 🎲

Projeto front-end com dois sorteadores:
- Sorteador de números (site principal)
- Sorteador de nomes (site secundário)

Ambos compartilham a mesma identidade visual, estilos reutilizáveis e validações orientadas a formulário.

## Sobre o projeto

### 1) Site principal: Sorteador de números

O site principal permite definir:
- Quantidade de números a sortear
- Valor inicial do intervalo
- Valor final do intervalo
- Se os números podem ou não se repetir

Depois do envio, os resultados aparecem em uma tela dedicada com animação sequencial dos cards.

### 2) Site secundário: Sorteador de nomes

O site secundário pode ser acessado pelo link "Clique aqui para sortear nomes" na página principal.

Nele, é possível:
- Informar nomes separados por vírgula
- Sortear 1 nome por vez
- Escolher entre repetir ou não repetir nomes
- Reiniciar automaticamente o ciclo quando a opção "não repetir" está ativa e todos os nomes já foram sorteados

## Funcionalidades implementadas ✅

### Gerais

- Estrutura modular de CSS por camadas (base, layout, components e pages)
- Scripts separados por página
- Layout responsivo

### Sorteador de números

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

### Sorteador de nomes

- Entrada de nomes por textarea (separados por vírgula)
- Sorteio aleatório de nomes
- Switch para modo com repetição ou sem repetição
- Reinício automático do conjunto de nomes quando o modo sem repetição esgota a lista
- Transição visual simples entre o resultado atual e o próximo

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
├── names.html
├── scripts/
│   └── pages/
│       ├── name-picker.js
│       └── number-generator.js
├── assets/
└── styles/
	├── base/
	│   └── theme.css
	├── components/
	│   ├── faq-list.css
	│   ├── generator-panel.css
	│   └── page-title.css
	├── layout/
	│   ├── page-grid.css
	│   └── site-header.css
	└── pages/
		├── name-picker.css
		└── number-generator.css
```

- index.html e names.html: páginas da aplicação
- scripts/pages/: lógica separada por página
- assets/: imagens, ícones e recursos visuais
- styles/: estilos da aplicação organizados por camada e por página

## Tecnologias utilizadas 

- HTML5
- CSS3
- JavaScript (Vanilla)

## Como executar

1. Abra a pasta do projeto no VS Code
2. Abra o arquivo index.html no navegador
3. Para acessar o sorteador de nomes, clique no link da página principal ou abra diretamente o arquivo names.html

Opcional:
- Use a extensão Live Server para recarregamento automático durante o desenvolvimento

Observação: 
- Também é possível visualizar pelo link do deploy no GitHub Pages
