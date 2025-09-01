import { render } from 'preact'
import { App } from './App'
import './index.css'
import './i18n' // Initialize i18n

const appElement = document.getElementById('app')
if (appElement) {
  render(<App />, appElement)
}




