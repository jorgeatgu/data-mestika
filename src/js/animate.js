var madridTimeline = anime.timeline();
var madridDuration = 600;
var madridDelay = function(el, i) { return i * 200 };

madridTimeline
    .add({
        targets: '.mdl-two',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        delay: madridDelay,
        duration: madridDuration
    })
    .add({
        targets: '.madrid-dendogram-circle-middle',
        r: [0, 5],
        easing: 'easeInOutSine',
        delay: madridDelay,
        duration: 300
    })
    .add({
        targets: '.madrid-dendogram-text-job',
        opacity: [0, 1],
        easing: 'easeInOutSine',
        delay: madridDelay,
        duration: 300
    })
    .add({
        targets: '.mdl-three',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        delay: madridDelay,
        duration: madridDuration
    })
    .add({
        targets: '.madrid-dendogram-circle-final',
        r: function(el) {
            return el.getAttribute('mydata:id') * 1.25;
        },
        easing: 'easeInOutSine',
        delay: madridDelay,
        duration: madridDuration
    })
    .add({
        targets: '.madrid-dendogram-text-percentage',
        opacity: [0, 1],
        easing: 'easeInOutSine',
        delay: madridDelay,
        duration: 300
    });



