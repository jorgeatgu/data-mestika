var madridTimeline = anime.timeline();
var madridDuration = 600;

madridTimeline
    .add({
        targets: '.mdl-two',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        delay: function(el, i) { return i * 250 },
        duration: madridDuration
    })
    .add({
        targets: '.mdl-three',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        delay: function(el, i) { return i * 250 },
        duration: madridDuration
    });
