---
author: SamyrOR
pubDatetime: 2024-11-15T15:35:53Z
title: My First Open Source Contribution
slug: my-first-contribution
featured: true
draft: false
tags:
  - opensource
  - elixir
  - phoenix
  - javascript
  - front-end
  - sass
  - community
description: Sharing my first contribution to the open-source community
lang: en
---

Hello, dear readers! Today, I’m thrilled to share a very special experience: my **first open source contribution**! 🥳 And to make it even more exciting, this is my first blog post! 😁

I’ve always wanted to contribute to the community since most of the content I relied on to break into the tech industry came from it. Finally, I had the opportunity to give back, and I managed to contribute! (Here’s hoping for many more contributions in the future! Haha)

---

## The Contribution

Although I consider myself a front-end developer, my first contribution was to a project using the [Phoenix](https://www.phoenixframework.org/) framework, part of the functional programming language [Elixir](https://elixir-lang.org/). 👀

If you’re interested in functional programming, Elixir is an amazing language, created by a Brazilian, and definitely worth checking out! 🇧🇷

### How It All Began

My journey started at **ElixirDays 2024**, during a talk by Zoey Pesanha about her [Supabase](https://supabase.com/) package for Elixir, called [supabase-ex](https://github.com/supabase-community/supabase-elixir). She mentioned her involvement in the open-source project **[PEA Pescarte](https://github.com/peapescarte/pescarte-plataforma)**, which aims to support regional fishing community organization. This immediately piqued my interest in contributing.

Shortly after, I explored the project’s _issues_ page and found one about creating a **visual calendar component**. Time to roll up my sleeves! I read the project guidelines (always important) and checked out the Figma design.

---

## The Creation Process

It was a highly enriching experience. Despite already working in front-end, this was my first time building a _date picker_ from scratch. It came with challenges, and I relied on my friend Freitas for help (shoutout to Freitas!). However, to meet the expectations for navigating between months and years, I had to use an existing solution.

### Choosing the Component

After some research, I found [Air Datepicker](https://air-datepicker.com/), a framework-agnostic component built purely with JavaScript and CSS. It was customizable enough to meet the project’s needs.

---

### Integrating with Phoenix

The integration process was straightforward. Here’s the Phoenix component code:

```elixir
doc """
  A date picker component for selecting dates.
  The `name` attribute is required.
  Use the `value` attribute to set an initial value for the component.

  ## Example
      <.date_input name="birthday"/>
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
      <input type="text" id="air-datepicker" class="input" placeholder="mm/dd/yyyy" value={@value} />
      <Lucideicons.calendar_days class="date_input--suffix" />
    </div>
  </div>
  """
end

```

### Customizing the Locale

I created a custom locale for the calendar since the default one didn’t match the required design:

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

### Styling with SASS

I adapted the style using SASS, which made writing the CSS much easier:

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

### Configuration and Behavior

After several attempts, I adjusted the visual behavior using Air Datepicker properties:

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

### Complete Code

You can check out the full contribution code on [GitHub](https://github.com/peapescarte/pescarte-plataforma/commit/474548c657ba2939e49a6a25b6995f36aa2e3b30#diff-8fc54d662f3f02022972927b06f2d4f8e37d0038032d329348cc484ba2a1ccf2R57)

### Conclusion

This experience taught me so much and left me feeling fulfilled. It’s amazing to contribute to open-source projects. If you haven’t tried it yet, I encourage you to start today! 😁
