import { render } from 'preact'
import { App } from './App'
import './index.css'
import './css/premium.css'

console.log('🚀 Main.tsx starting...')

const appElement = document.getElementById('app')
if (appElement) {
  console.log('✅ App element found, rendering...')
  render(<App />, appElement)
  console.log('✅ App rendered successfully')
} else {
  console.error('❌ App element not found!')
}




