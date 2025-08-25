import {Footer , Navbar, ScrollToTop} from "./components"
import {Outlet} from "react-router-dom"

function App() {
  return(
    <>
      <Navbar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  )
}

export default App