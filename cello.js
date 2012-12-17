var baudio = require('baudio');
var b = baudio({ rate : 44100 });
var tau = 2 * Math.PI;

var music = [
    function (t, clip) {
        if (t > 0.5) clip.end();
        
        return pluck(t, 100, 32, 10)
            + pluck(t, 50 * Math.pow(2, 1/2), 16, 23)
        ;
    },
    function (t, clip) {
        if (t > 0.5) clip.end();
        
        return pluck(t, 100, 32)
            + pluck(t, 100 * Math.pow(2, 3/5), 32, 10)
        ;
    },
    function (t, clip) {
        if (t > 0.5) clip.end();
        
        return pluck(t, 100 * Math.pow(2, 7/5), 32, 10)
            + pluck(t, 100 * Math.pow(2, 3/5), 32, 10)
        ;
    },
    function (t, clip) {
        if (t > 0.5) clip.go(0);
        
        return pluck(t, 200, 32, 10)
            + pluck(t, 100 * Math.pow(2, 3/5), 32, 10)
        ;
    }
];
b.push(player(music));
b.play();

function player (music) {
    var playing = [];
    var bucket = 0;
    var elapsed = 0;
    var index = -1;
    
    shift(0);
    
    function shift (start) {
        index ++;
        if (index >= music.length) return b.end();
        var m = music[index];
        
        playing.push(function (t, clip) {
            return m(t - start, clip);
        });
    }
    
    return function (t) {
        if (playing.length === 0) b.end();
        
        return playing.reduce(function (sum, clip) {
            var handle = {
                go : function (i) {
                    var ix = playing.indexOf(clip);
                    if (ix >= 0) playing.splice(ix, 1);
                    index = i - 1;
                    shift(t);
                },
                next : function () {
                    shift(t);
                },
                end : function () {
                    var ix = playing.indexOf(clip);
                    if (ix >= 0) playing.splice(ix, 1);
                    shift(t);
                }
            };
            return sum + clip(t, handle);
        }, 0);
    };
}

function pluck (t, freq, duration, steps) {
    var n = duration;
    var scalar = Math.max(0, 0.95 - (t * n) / ((t * n) + 1));
    var sum = 0;
    for (var i = 0; i < steps; i++) {
        sum += Math.sin(tau * t * (freq + i * freq));
    }
    return scalar * sum / 6;
}
