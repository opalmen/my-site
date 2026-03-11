(function () {
  'use strict';

  function isDesktop() {
    return window.innerWidth >= 860;
  }

  function positionNotes() {
    if (!isDesktop()) return;
    const postBody = document.querySelector('.post-body');
    if (!postBody) return;
    const notes = Array.from(postBody.querySelectorAll('.sidenote'));
    if (!notes.length) return;
    const bodyRect = postBody.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    let lastBottom = 0;
    const GAP = 12;
    notes.forEach(function (note) {
      const id = note.dataset.sn;
      const anchor = postBody.querySelector('.sn-anchor[data-sn="' + id + '"]');
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      let idealTop = (anchorRect.top + scrollTop) - (bodyRect.top + scrollTop);
      let top = Math.max(idealTop, lastBottom + GAP);
      note.style.top = top + 'px';
      lastBottom = top + note.offsetHeight;
    });
  }

  function initSidenotes() {
    if (!isDesktop()) return;
    const postBody = document.querySelector('.post-body');
    if (!postBody) return;
    const notes = postBody.querySelectorAll('.sidenote');

    // Hover on the superscript number
    postBody.querySelectorAll('.sidenote-number').forEach(function (label) {
      const id = label.dataset.sn;
      if (!id) return;
      const note = postBody.querySelector('.sidenote[data-sn="' + id + '"]');
      if (!note) return;
      label.addEventListener('mouseenter', function () {
        label.classList.add('highlighted');
        note.classList.add('highlighted');
      });
      label.addEventListener('mouseleave', function () {
        label.classList.remove('highlighted');
        note.classList.remove('highlighted');
      });
    });

    // Hover on the sidenote
    notes.forEach(function (note) {
      const id = note.dataset.sn;
      const label = postBody.querySelector('.sidenote-number[data-sn="' + id + '"]');
      note.addEventListener('mouseenter', function () {
        note.classList.add('highlighted');
        if (label) label.classList.add('highlighted');
      });
      note.addEventListener('mouseleave', function () {
        note.classList.remove('highlighted');
        if (label) label.classList.remove('highlighted');
      });
    });

    positionNotes();
    window.addEventListener('resize', positionNotes);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(positionNotes);
    }
    window.addEventListener('load', positionNotes);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidenotes);
  } else {
    initSidenotes();
  }
})();
