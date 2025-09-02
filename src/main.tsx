import { render } from 'preact'
import { App } from './App'
import './index.css'
import './i18n' // Initialize i18n

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}

const appElement = document.getElementById('app')
if (appElement) {
  render(<App />, appElement)
}




