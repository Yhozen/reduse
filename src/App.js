import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import './App.css'
import { useFirestoreConnect, useFirestore } from 'react-redux-firebase'
import { values, map } from 'ramda'

import { useSelector } from 'react-redux'
import AnimatedNumber from 'animated-number-react'

const formatValue = value => value.toFixed(0)
const qrOptions = {
  type: 'svg',
  color: { light: '#FFFFFF00', dark: '#361d38EE' }
}
const populates = [
  { child: 'products', root: 'products' } // replace owner with user object
]

const cashierRef = { collection: 'cashier', doc: 'HKNi2VPkzmgeH30Cum0X' }
function App() {
  const firestore = useFirestore()
  const [counter, setCounter] = useState(0)
  useFirestoreConnect([
    cashierRef // or 'todos'
  ])
  const cashiers = useSelector(state => state.firestore.ordered.cashier)
  const cashier = cashiers && cashiers[0]
  console.log(cashier)
  const subtotal =
    cashier && cashier.products
      ? values(cashier.products).reduce(
          (totalCalories, meal) => totalCalories + meal.price,
          0
        )
      : 0

  const discount =
    cashier && cashier.discounts
      ? values(cashier.discounts).reduce(
          (totalCalories, meal) => totalCalories + meal.credits * 1000,
          0
        )
      : 0

  useEffect(() => {
    var canvas = document.getElementById('qr')

    QRCode.toCanvas(canvas, cashier && cashier.id, qrOptions, error => {
      canvas.style = 'height: 28vmin; width: 28vmin;'
    })
  }, [cashier])

  const handleSubmit = async () => {
    const doc = await firestore.get(cashierRef)
    const product = (await firestore.get(`products/${counter}`)).data()
    const data = doc.data()
    const products = data.products || {}
    if (product) {
      await firestore.update(cashierRef, {
        products: { ...products, [counter]: product }
      })
    }
    setCounter(state => state + 5)
  }
  const handleChange = event => {
    setCounter(event.target.value)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="flex-2">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {cashier &&
            cashier.products &&
            values(
              map(product => {
                return (
                  <h3 style={{ margin: 5 }}>
                    <AnimatedNumber
                      value={product.price}
                      formatValue={formatValue}
                      duration={200}
                    />
                  </h3>
                )
              }, cashier.products)
            )}
          <p style={{ marginTop: 20, marginBottom: 2 }}>Subtotal</p>
          <h2 style={{ margin: 5 }}>
            <AnimatedNumber
              value={subtotal}
              formatValue={formatValue}
              duration={200}
            />
          </h2>
          <p style={{ marginTop: 20, marginBottom: 2 }}>Descuentos REDUSE</p>
          {cashier &&
            cashier.discounts &&
            values(
              map(product => {
                return (
                  <h3 style={{ margin: 5 }}>
                    <AnimatedNumber
                      value={product.credits * 1000}
                      formatValue={formatValue}
                      duration={200}
                    />
                  </h3>
                )
              }, cashier.discounts)
            )}
          <p style={{ marginTop: 20, marginBottom: 2 }}>TOTAL</p>

          <h1 style={{ margin: 5 }}>
            <AnimatedNumber
              value={subtotal - discount}
              formatValue={formatValue}
              duration={200}
            />
          </h1>

          <input type="text" value={counter} onChange={handleChange} />
          <button onClick={handleSubmit}>wea</button>
        </div>
        <div className="flex-1">
          <canvas id="qr" />
        </div>
      </header>
    </div>
  )
}

export default App
