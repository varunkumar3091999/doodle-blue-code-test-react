import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Chat from "./screens/Chat";
import Home from "./screens/Home";
import Header from "./shared/Header";
// export const ContactContext = createContext(null);

import { ContactContext } from "./utils/contactContext";
function App() {
  const [currentUser, setCurrentUser] = useState();
  // const { currentUser, setCurrentUser } = useContext(ContactContext);

  useEffect(() => {
    var currentUser =
      localStorage.getItem("currentUser") !== undefined
        ? JSON.parse(localStorage.getItem("currentUser"))
        : {};

    var contacts = localStorage.getItem("contacts")
      ? JSON.parse(localStorage.getItem("contacts"))
      : [];

    if (currentUser) {
      setCurrentUser(currentUser);
    } else if (contacts.length > 0) {
      localStorage.setItem("currentUser", JSON.stringify(contacts[0]));
    }
  }, []);

  return (
    <ContactContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="App h-screen overflow-hidden">
        <Router>
          <Header />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/chat/:id" exact component={Chat} />
          </Switch>
        </Router>
      </div>
    </ContactContext.Provider>
  );
}

export default App;
