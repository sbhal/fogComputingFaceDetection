
module.exports = {
    fn: function(str, socket, data) { this[str](socket, data); },
    //app1 handler
    appHandler1: function(socket, data) {
        console.log('app1 handler called');
        
    },

    //app2 handler
    appHandler2: function(socket, data) {
        console.log('app2 handler called');
    }
}