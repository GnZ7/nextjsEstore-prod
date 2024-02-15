//Algoritmo para mezclar los productos mostrados (Fisher-Yates)
  export default function ArrayShuffle(arr: any){
    const n = arr.length
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }