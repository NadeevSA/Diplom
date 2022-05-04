import React from 'react'
import { store, RootState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import { selectProducts, fetchProducts, decrement, increment } from './createSlice'

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  React.useEffect(() => {
    store.dispatch(fetchProducts());
  }, [dispatch]); 
  
  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}