---
layout: layouts/event
tags:
  - myEvents
pagination:
  alias: roadEvent
  data: roadEvents.events
  size: 1
  addAllPagesToCollections: false
permalink: "/on-the-road/{{ roadEvent.content.slug.current }}/index.html"
eleventyExcludeFromCollections: false
noindex: false
---