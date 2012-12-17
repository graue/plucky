module.exports = function (music) {
    var playing = [];
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
};
