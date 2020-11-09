---
title: 'Hello, world!'
layout: 'layouts/home.html'
intro:
  eyebrow: 'Digital Marketing is our'
  main: 'Bread & Butter'
  summary: 'Let us help you create the perfect campaign with our multi-faceted team of talented creatives.'
  buttonText: 'See our work'
  buttonUrl: '/work'
  image: '/images/bg/toast.jpg'
  imageAlt: 'Buttered toasted white bread'
---

{% if menu.length %}

  {% for item in menu %}
  <div className="menuList">
    <h2>{{item.shortDate}} </h2>
    <div>
    <p>
      <strong>{{item.name}}</strong>: 
      <a href="https://dg2go.foxycart.com/cart?name={{item.dishNameURI}}&price=10&pickup-date={{item.longDate}}&meal=lunch">Order for lunch</a> | <a href="https://dg2go.foxycart.com/cart?name={{item.dishNameURI}}&price=10&pickup-date={{item.longDate}}&meal=dinner">Order for dinner</a>
    </p>
    <p>
      {{ item.description}}
    </p>
    </div>
  </div>
  <hr/>
{% endfor %}

{% endif%}

<!-- <article class="intro">
  <div class="[ intro__header ] [ radius frame ]">
    <h1 class="[ intro__heading ] [ weight-normal text-400 md:text-600 ]">
      {{ intro.eyebrow }}
      <em class="text-800 md:text-900 lg:text-major weight-bold">{{ intro.main }}</em>
    </h1>
  </div>
  <div class="[ intro__content ] [ flow ]">
    <p class="intro__summary">{{ intro.summary }}</p>
    <a href="{{ intro.buttonUrl }}" class="button">{{ intro.buttonText }}</a>
  </div>
  <div class="[ intro__media ] [ radius dot-shadow ]">
    <img
      class="[ intro__image ] [ radius ]"
      src="{{ intro.image }}"
      alt="{{ intro.imageAlt }}"
    />
  </div>
</article> -->