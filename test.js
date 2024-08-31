// BIKIN FUNCTION YANG MENERIMA 3 PARAMETER, LALU RETURN PARAM1 + PARAM2 * PARAM3
// MISAL: 2, 8, 2 => 18

function test(param1, param2, param3) { // <= PARAMETER
    var hasil = param1 + param2 * param3
    return hasil
}

let hasil = test(10, 2, 5) // <= ARGUMEN
console.log("HASIL: ", hasil);

// 5
// 1 + 2 + 3 + 4 + 5

function sumLooping(n) {
    var result = 0
    for(let i = 1; i <= n; i++) {
        console.log("I: ", i);
        result += i
    }
    return result
}

console.log("SUM LOOPING", sumLooping(5));

// 1 => 5
// 1 * 2 * 3 * 4 * 5
function kaliLooping(x) {
    let hasil = 1
    for(let i = 1; i <= x; i++) {
        console.log("i: ", i);
        hasil *= i
    }
    return hasil
}

console.log("Kali Looping: ", kaliLooping(5));

// PERTAMBAHAN YANG ANGKA GENAP
// 1 => 10
// 2 + 4 + 6 + 8 + 10

function sumLoopingGenap(x) {
    let hasil = 0
    for(let i = 1; i <= x; i++) {
        if(i % 2 == 0) {
            console.log("i: ", i);
            hasil += i
        }
    }

    return hasil
}

console.log("sumLoopingGenap: ", sumLoopingGenap(10));



// GANJIL
function sumLoopingGanjil(x) {
    let hasil = 1

    for(let i = 1; i <= x; i++) {
        if(i % 2 == 1) {
            console.log("i: ", i);
            hasil = hasil * i
        }
    }

    return hasil
}

console.log("sumLoopingGanjil: ", sumLoopingGanjil(7));


function lala(arr) {
    let result = 0

    // 0, 1, 2
    // result = 0

    // ITERASI 0
    // result += arr[0]
    // result = 1

    // ITERASI 1
    // result += arr[1]
    // result = 5

    // ITERASI 3
    // result += arr[2]
    // result = 11
    for(let i = 0; i < arr.length; i++) {
        result += arr[i]
    }

    return result
}

console.log("RESULT: ", lala([1,4,6]));










// 2 params
// 1. data berupa array
// 2. "+", "*"
// 4 + 5 + 6
// 4 * 5 * 6
function arr(data, pilih) {
    let result = 0

    if(pilih == "+") result = 0
    else result = 1
    
    for(let i = 0; i < data.length; i++) {
        if(pilih == "+") result += data[i]
        else result *= data[i]
    }
 
    // let result = pilih == "+" ? 0 : 1
    // for(let i = 0; i < data.length; i++) pilih == "+" ? result += data[i] : result *= data[i]

    return result
}

console.log("HASIL: ", arr([1,2,4], "+"));





// let arr = [2, 5, 9, 69]
// let i = 3
// console.log(arr[i]);