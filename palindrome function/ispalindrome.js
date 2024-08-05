function Palindromo(str){
    var low = str.toLowerCase();
    var reverse = low.split('').reverse().join(''); 
    return reverse === low;
}
module.exports = Palindromo
// console.log(Palindromo("ovo"))