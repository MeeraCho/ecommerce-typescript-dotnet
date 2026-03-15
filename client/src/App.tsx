import { useState } from "react";

function App() {
  const [products, setProducts] = useState<{name: string, price: number}[]>([]);

  const addProduct = () => {
    setProducts(prevState => [...prevState, {name: 'product' + (prevState.length + 1), price: (prevState.length * 100) + 100}]);
  }


  return (
    <>
      <div>
        <h1 style={{color: 'red'}}>Re-store</h1>
        <ul>
          {products.map((item, index) => (
            <li key={index}>{item.name} - {item.price}</li>
          ))}
        </ul>
        <button onClick={addProduct}>Add Product</button>
      </div>
    </>
  )
}

export default App
