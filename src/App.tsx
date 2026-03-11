import { LanguageProvider } from './i18n/LanguageContext'
import MageApp from './MageApp'

export default function App() {
  return (
    <LanguageProvider>
      <MageApp />
    </LanguageProvider>
  )
}

