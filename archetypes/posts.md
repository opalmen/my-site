---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
tags: []
sidenotes: true
---

Your post content here.

To add a sidenote, use the `sn` shortcode:

{{</* sn id="sn1" note="Your sidenote text here." */>}}the anchor text in the body{{</* /sn */>}}

Each `id` must be unique within the post (sn1, sn2, sn3, ...).
