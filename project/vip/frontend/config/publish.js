var publisher = require('publish-helper')
var path = require('path');


console.log("publish")


new publisher({
    src:path.resolve(__dirname, '../output/*.html'),
    dist:path.resolve(__dirname, '../../templates'),
    iwantcdn:false,
    sourceMappingURL:true,
    chunk: false,
    chunkFilename: '/static/js/[name].chunk.js',
    hostname:function(type, data){
        let num = (data.hash).replace(/[^0-9]/ig,"");
        num = num%5;
        if(type=="img"){
            return 'xxi'+num+".cdn.xiongmaoxingyan.com";
        }else{
            return 'xxs'+num+".cdn.xiongmaoxingyan.com";
        }
    },
    onScand: function(map, next){
        console.log('onScand');
        next();
    },
    onMoved: function(map, next){
        console.log('onMoved')
        next();
    },
    onDone: function(map){
        console.log('onDone')
    },
});