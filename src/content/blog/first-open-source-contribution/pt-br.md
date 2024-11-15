---
author: SamyrOR
pubDatetime: 2024-11-15T15:35:53Z
title: Minha primeira contribuição opensource
slug: minha-primeira-contribuicao
featured: true
draft: false
tags:
  - opensource
  - elixir
  - phoenix
  - javacript
  - front-end
  - sass
  - comunidade
description: Como foi a minha primeira contribuição para a comunidade
lang: pt-br
---

Olá, caros leitores! Hoje venho compartilhar uma experiência muito especial: minha **primeira contribuição open source**! 🥳 E, para tornar isso ainda mais especial, este é meu primeiro post no blog! 😁

Sempre tive muita vontade de contribuir com a comunidade, já que grande parte do conteúdo que consumi para ingressar no mercado veio de materiais compartilhados por ela. Finalmente, tive a oportunidade de retribuir e consegui contribuir! (Espero continuar contribuindo muito mais no futuro! haha)

---

## A Contribuição

Apesar de me considerar um desenvolvedor front-end, minha primeira contribuição foi em um projeto usando o framework [Phoenix](https://www.phoenixframework.org/), que pertence à linguagem funcional [Elixir](https://elixir-lang.org/). 👀

Para quem tem interesse em programação funcional, Elixir é uma linguagem incrível, criada por um brasileiro, e vale muito a pena conferir! 🇧🇷

### Como Tudo Começou

Minha jornada começou na **ElixirDays 2024**, durante uma palestra da Zoey Pesanha sobre seu pacote de [Supabase](https://supabase.com/) para Elixir, chamado [supabase-ex](https://github.com/supabase-community/supabase-elixir). Ela mencionou sua participação no projeto open source **[PEA Pescarte](https://github.com/peapescarte/pescarte-plataforma)**, que busca fortalecer a organização comunitária de pesca regional Logo me despertou a vontade de querer contribuir.

Pouco tempo depois, explorei as _issues_ do projeto e encontrei uma que envolvia a criação de um **componente visual de calendário**. Era hora de arregaçar as mangas!
Li as guidelines do projeto (muito importante), e acessei o projeto no figma.
Dito isso, mãos a massa.

---

## O Processo de Criação

Foi uma experiência enriquecedora. Apesar de já atuar com front-end, essa foi a primeira vez que criei um _date picker_ do zero. Enfrentei desafios e contei com a ajuda do meu amigo Freitas (valeu, Freitas!). Mas, para atender às expectativas de navegação entre meses e anos, precisei recorrer a uma solução pronta.

### A Escolha do Componente

Após pesquisa, encontrei o [Air Datepicker](https://air-datepicker.com/), um componente agnóstico a frameworks, feito puramente em JavaScript e CSS. Ele era customizável o suficiente para atender às necessidades do projeto.

---

### Integração com Phoenix

A integração foi simples. Aqui está o código do componente no Phoenix:

```elixir
doc """
  Um componente de date picker para selecionar datas.
  O mesmo recebe obrigatoriamente o atributo `name`.
  Caso queira dar um valor inicial para o componente, use o atributo `value`.
  ## Exemplo
      <.date_input name="aniversario"/>
  """
attr :name, :string, required: true
attr :class, :string, default: ""
attr :value, :string, default: ""

def date_input(%{field: %Phoenix.HTML.FormField{}} = assigns) do
  assigns
  |> input()
  |> date_input()
end

def date_input(assigns) do
  ~H"""
  <div class={["date_input", @class]}>
    <div class="date_input__container">
      <input type="text" id="air-datepicker" class="input" placeholder="dd/mm/aaaa" value={@value} />
      <Lucideicons.calendar_days class="date_input--suffix" />
    </div>
  </div>
  """
end
```

### Personalizando a Localização

Criei uma locale personalizada para o calendário, pois a padrão não atendia ao design requerido:

```js
let customLocale = {
  days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  daysMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthsShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  today: "Hoje",
  clear: "Limpar",
  dateFormat: "dd/MM/yyyy",
  timeFormat: "HH:mm",
  firstDay: 0,
};
```

### Estilização com SASS

Adaptei o estilo utilizando SASS, facilitando a escrita do CSS:

```sass
.date_input {
  max-width: 300px;

  &__container {
    position: relative;
    input {
      @apply focus:border-black-10 focus:ring-0 focus:ring-offset-0;
    }
    &:focus-within {
      #air-datepicker {
        border-bottom: none;
        border-radius: 0.25rem 0.25rem 0 0;
      }
      &:after {
        @apply bg-black-10;
        content: "";
        position: absolute;
        left: 12px;
        bottom: 0;
        width: 276px;
        height: 1.5px;
      }
    }
  }

  &--suffix {
    @apply absolute top-3 right-3 disabled:text-black-20 pointer-events-none;
  }
}
```

### Configuração e Comportamento

Após diversas tentativas e erros, ajustei o comportamento visual utilizando as propriedades do Air Datepicker:

```js
new AirDatepicker("#air-datepicker", {
  locale: customLocale,
  navTitles: {
    days: "<i>MMMM</i>",
  },
  autoClose: true,
  position({ $datepicker, $target, $pointer }) {
    let coords = $target.getBoundingClientRect(),
      dpWidth = $datepicker.clientWidth;
    let top = coords.y + coords.height;
    let left = coords.x + (coords.width - 2) / 2 - dpWidth / 2;
    $datepicker.style.left = `${left}px`;
    $datepicker.style.top = `${top}px`;
    $pointer.style.display = "none";
  },
});
```

### Código Completo

Você pode conferir o código completo da contribuição no [GitHub](https://github.com/peapescarte/pescarte-plataforma/commit/474548c657ba2939e49a6a25b6995f36aa2e3b30#diff-8fc54d662f3f02022972927b06f2d4f8e37d0038032d329348cc484ba2a1ccf2R57)

### Conclusão

Essa experiência me trouxe aprendizado e satisfação, mostrando como é gratificante contribuir para projetos open source. Se você ainda não tentou, recomendo começar hoje mesmo! 😁
