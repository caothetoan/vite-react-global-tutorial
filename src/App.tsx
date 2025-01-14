import './App.css'
import { WalletProvider } from '~/hooks/WalletProvider'
import { SelectedWallet } from './components/SelectedWallet'
import { WalletList } from './components/WalletList'
import { WalletError } from './components/WalletError'
import PushNotification from "./components/PushNotification";
import GPS from "./components/GPS";
import OrientationInfo from "./components/OrientationInfo";

function App() {
  const handleShake = () => {
    alert("Device shaken!");
  };

  return (
    <WalletProvider>
      <WalletList />
      <hr />
      <SelectedWallet />
      <WalletError />
      <hr />
      <GPS />
      <PushNotification vapidPublicKey="BJGLpmIwUKXMJMKzqEhvhebzRFHqF90PomeQ3vHhAxxztvpje9eXs9ScIysLgkLVXOp9GulUv3hzNj9G16PdGlo" />
      <OrientationInfo />
    </WalletProvider>
  )
}

export default App
