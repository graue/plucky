var baudio = require('baudio');
var b = baudio({ rate : 44100 });
var tau = 2 * Math.PI;
var player = require('../');

var music = [
    function (t, clip) {
        if (t > 1 / 4) clip.end();
        return Math.sin(tau * 200 * t);
    },
    function (t, clip) {
        if (t > 1 / 4) clip.end();
        return Math.sin(tau * t * 200 * Math.pow(2, 1/3))
            + Math.sin(tau * t * 240 * Math.pow(2, 1/3))
        ;
    },
    function (t, clip) {
        if (t > 1 / 2) clip.go(0);
        return Math.sin(tau * 80 * t)
            + Math.sin(tau * 85 * t)
        ;
    }
];
b.push(player(music));
b.play();
