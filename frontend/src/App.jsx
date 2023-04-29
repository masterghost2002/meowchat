import { ChakraProvider } from '@chakra-ui/react';
import { UserContextProvider } from './userContext';
import PageRouter from './pageRouter';
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router >
    <ChakraProvider>
        <UserContextProvider>
          <PageRouter />
        </UserContextProvider>
    </ChakraProvider>
    </Router>
  )
}

export default App
